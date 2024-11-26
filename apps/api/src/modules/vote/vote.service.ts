import {
  Action,
  CreateVoteSuggestionDto,
  VoteSelection,
  VoteStatus,
} from '@ambassador';

import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { LoggerService } from 'src/modules/logger/logger.service';
import { NotificationService } from 'src/modules/notification/notification.service';

import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class VoteService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
    private notifier: NotificationService,
  ) {}

  async voteForProposal(
    userId: string,
    proposalId: string,
    voteSelections: VoteSelection[],
  ) {
    const proposal = await this.prisma.proposal.findUnique({
      where: {
        id: proposalId,
        votes: {
          some: {
            userId,
          },
        },
      },
      include: {
        candidates: true,
        votes: true,
      },
    });

    if (!proposal) {
      throw new BadRequestException('Proposal not found');
    }
    if (proposal.candidates.length < voteSelections.length) {
      throw new BadRequestException('Invalid number of candidates');
    }
    const userVote = proposal.votes.find((vote) => vote.userId === userId);

    if (userVote.status === VoteStatus.RESOLVED) {
      throw new ConflictException('User vote already resolved');
    }

    if (userVote.status === VoteStatus.DISABLED) {
      throw new ConflictException('User vote disabled');
    }

    const candidateIdValueMap = new Map(
      proposal.candidates.map((candidate) => [candidate.id, candidate.value]),
    );

    if (
      !voteSelections.every((selection) =>
        candidateIdValueMap.has(selection.candidateId),
      )
    ) {
      throw new BadRequestException('Invalid choice id');
    }

    this.logger.logAction({
      action: Action.RESOLVED_VOTE,
      info: {
        userId,
        proposalId,
        message: `Voted for ${voteSelections
          .map(
            (selection) => `${candidateIdValueMap.get(selection.candidateId)} 
          ${selection.rank ? `at rank ${selection.rank}` : ''}
          `,
          )
          .join(', ')}`,
      },
    });

    return await this.prisma.vote.update({
      where: {
        id: userVote.id,
      },
      data: {
        status: VoteStatus.RESOLVED,
        voteSelections: {
          createMany: {
            data: voteSelections.map((selection) => ({
              candidateId: selection.candidateId,
              rank: selection.rank,
            })),
          },
        },
      },
    });
  }

  async suggestVote(
    userId: string,
    proposalId: string,
    voteId: string,
    voteSuggestions: CreateVoteSuggestionDto[],
  ) {
    const proposal = await this.prisma.proposal.findUnique({
      where: {
        id: proposalId,
        managers: {
          some: {
            userId,
          },
        },
      },
      include: {
        candidates: true,
        votes: {
          where: {
            id: voteId,
          },
          include: {
            voteSelections: true,
            user: true,
          },
        },
        managers: {
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
            user: true,
          },
        },
      },
    });

    if (!proposal) {
      throw new BadRequestException('Proposal not found');
    }

    if (proposal.candidates.length < voteSuggestions.length) {
      throw new BadRequestException('Invalid number of candidates');
    }

    const manager = proposal.managers.find(
      (manager) => manager.userId === userId,
    );

    const voteUser = proposal.votes.find((vote) => vote.id === voteId).user;

    if (!manager.role.permissions.canOfferVoteSuggestions) {
      throw new ConflictException(
        'User does not have permission to suggest votes',
      );
    }

    const candidateIdValueMap = new Map(
      proposal.candidates.map((candidate) => [candidate.id, candidate.value]),
    );

    if (
      !voteSuggestions.every((selection) =>
        candidateIdValueMap.has(selection.candidateId),
      )
    ) {
      throw new BadRequestException('Invalid choice id');
    }

    this.logger.logAction({
      action: Action.OFFER_VOTE_SUGGESTION,
      info: {
        userId,
        proposalId,
        message: `Suggested ${voteSuggestions
          .map(
            (suggestion) =>
              `${candidateIdValueMap.get(suggestion.candidateId)} ${
                suggestion.rank ? `at rank ${suggestion.rank}` : ''
              }`,
          )
          .join(
            ', ',
          )} for ${voteUser.personalNames.join(' ')}, ${voteUser.familyName}`,
      },
    });

    this.notifier.notifyUsers({
      proposalId,
      userId,
      package: {
        type: NotificationType.VOTE_SUGGESTION,
        content: {
          candidateNames: voteSuggestions.map((suggestion) =>
            candidateIdValueMap.get(suggestion.candidateId),
          ),
          suggestedBy: `${manager.user.personalNames.join(' ')}, ${manager.user.familyName}`,
        },
      },
    });

    return await this.prisma.vote.update({
      where: {
        id: voteId,
      },
      data: {
        voteSuggestions: {
          createMany: {
            data: voteSuggestions.map((suggestion) => ({
              ...suggestion,
              candidateId: suggestion.candidateId,
              suggestedByManagerId: manager.id,
            })),
          },
        },
      },
    });
  }

  async acceptVoteSuggestion(userId: string, proposalId: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: {
        id: proposalId,
        votes: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        votes: {
          where: {
            userId,
          },
          include: {
            voteSuggestions: {
              include: {
                suggestedByManager: true,
                candidate: true,
              },
            },

            user: true,
          },
        },
      },
    });

    if (!proposal) {
      throw new BadRequestException('Proposal not found');
    }

    const userVote = proposal.votes.find((vote) => vote.userId === userId);

    if (!userVote.voteSuggestions || userVote.voteSuggestions.length === 0) {
      throw new ConflictException('No vote suggestions to accept');
    }

    if (!userVote.voteSuggestions[0].suggestedByManager) {
      throw new ConflictException('No manager associated with vote suggestion');
    }

    this.logger.logAction({
      action: Action.ACCEPT_VOTE_SUGGESTION,
      info: {
        userId,
        proposalId,
        message: `Accepted vote suggestion ${userVote.voteSuggestions.map((suggestion) => suggestion.candidate.value).join(', ')}`,
      },
    });
    console.log('userVote', userVote);
    this.notifier.notifyUsers({
      userId: userVote.voteSuggestions[0].suggestedByManagerId,
      proposalId,
      package: {
        type: NotificationType.VOTE_SUGGESTION_ACCEPTED,
        content: {
          acceptedBy: `${userVote.user.personalNames.join(' ')}, ${userVote.user.familyName}`,
        },
      },
    });

    return await this.prisma.$transaction([
      this.prisma.voteSelection.deleteMany({
        where: {
          voteId: userVote.id,
        },
      }),
      this.prisma.vote.update({
        where: {
          id: userVote.id,
        },
        data: {
          status: VoteStatus.RESOLVED,
          voteSelections: {
            createMany: {
              data: userVote.voteSuggestions.map((suggestion) => ({
                candidateId: suggestion.candidateId,
                rank: suggestion.rank,
              })),
            },
          },
          voteSuggestions: {
            set: [],
          },
        },
      }),
    ]);
  }

  async rejectVoteSuggestion(userId: string, proposalId: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: {
        id: proposalId,
        votes: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        votes: {
          where: {
            userId,
          },
          include: {
            voteSuggestions: {
              include: {
                candidate: true,
                suggestedByManager: true,
              },
            },
            user: true,
          },
        },
      },
    });

    if (!proposal) {
      throw new BadRequestException('Proposal not found');
    }

    const userVote = proposal.votes.find((vote) => vote.userId === userId);

    if (!userVote.voteSuggestions || userVote.voteSuggestions.length === 0) {
      throw new ConflictException('No vote suggestions to reject');
    }

    if (!userVote.voteSuggestions[0].suggestedByManager) {
      throw new ConflictException('No manager associated with vote suggestion');
    }

    this.logger.logAction({
      action: Action.REJECT_VOTE_SUGGESTION,
      info: {
        userId,
        proposalId,
        message: `Rejected vote suggestion ${userVote.voteSuggestions.map((suggestion) => suggestion.candidate.value).join(', ')}`,
      },
    });

    this.notifier.notifyUsers({
      userId: userVote.voteSuggestions[0].suggestedByManagerId,
      proposalId,
      package: {
        type: NotificationType.VOTE_SUGGESTION_REJECTED,
        content: {
          rejectedBy: `${userVote.user.personalNames.join(' ')}, ${userVote.user.familyName}`,
        },
      },
    });

    return await this.prisma.vote.update({
      where: {
        id: userVote.id,
      },
      data: {
        voteSuggestions: {
          set: [],
        },
      },
    });
  }

  async mutateUserVoteStatus({
    userId,
    proposalId,
    voteId,
    status,
  }: {
    userId: string;
    proposalId: string;
    voteId: string;
    status: typeof VoteStatus.DISABLED | typeof VoteStatus.PENDING;
  }) {
    const proposal = await this.prisma.proposal.findUnique({
      where: {
        id: proposalId,
        AND: [
          {
            managers: {
              some: {
                userId,
              },
            },
          },
          {
            votes: {
              some: {
                id: voteId,
              },
            },
          },
        ],
      },
      include: {
        votes: {
          where: {
            id: voteId,
          },
          include: {
            user: true,
          },
        },
        managers: {
          where: {
            userId,
          },
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
      },
    });

    if (!proposal) {
      throw new BadRequestException('Proposal not found');
    }

    const managerPermissions = proposal.managers.find(
      (manager) => manager.userId === userId,
    ).role.permissions;

    const userVote = proposal.votes.find((vote) => vote.id === voteId);

    if (!managerPermissions.canChangeVoteStatus) {
      throw new ConflictException(
        'User does not have permission to change vote status',
      );
    }

    this.logger.logAction({
      action:
        status === VoteStatus.DISABLED
          ? Action.DISABLE_USER_VOTE
          : Action.ENABLE_USER_VOTE,
      info: {
        userId,
        proposalId,
        message: `${status === VoteStatus.DISABLED ? 'Disabled' : 'Enabled'} ${userVote.user.personalNames.join(' ')}, ${userVote.user.familyName} vote`,
      },
    });

    this.notifier.notifyUsers({
      userId: userVote.userId,
      proposalId,
      package: {
        type:
          status === VoteStatus.DISABLED
            ? NotificationType.VOTE_DISABLED
            : NotificationType.VOTE_ENABLED,
        content: null,
      },
    });

    return await this.prisma.vote.update({
      where: {
        id: voteId,
      },
      data: {
        status,
      },
    });
  }

  async getAnonVotes(proposalId, userId) {
    const proposal = await this.prisma.proposal.findUnique({
      where: {
        id: proposalId,
        OR: [
          {
            votes: {
              some: {
                userId,
              },
            },
          },
          {
            managers: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      include: {
        votes: {
          where: {
            status: VoteStatus.RESOLVED,
          },
          include: {
            voteSelections: {
              include: {
                candidate: true,
              },
            },
          },
        },
      },
    });

    if (!proposal) {
      throw new BadRequestException('Proposal not found');
    }

    return proposal.votes.map((vote) => vote.voteSelections);
  }
}
