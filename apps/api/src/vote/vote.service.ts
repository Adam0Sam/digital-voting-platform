import { Action } from '@ambassador';
import { Candidate } from '@ambassador/candidate';
import { VoteStatus } from '@ambassador/vote';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { LoggerService } from 'src/logger/logger.service';
import { NotificationService } from 'src/notification/notification.service';

import { PrismaService } from 'src/prisma/prisma.service';

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
    candidates: Candidate[],
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
    if (proposal.candidates.length < candidates.length) {
      throw new BadRequestException('Invalid number of candidates');
    }
    const userVote = proposal.votes.find((vote) => vote.userId === userId);

    if (userVote.status === VoteStatus.RESOLVED) {
      throw new ConflictException('User vote already resolved');
    }

    if (userVote.status === VoteStatus.DISABLED) {
      throw new ConflictException('User vote disabled');
    }

    const availableChoiceIdSet = new Set(
      proposal.candidates.map((choice) => choice.id),
    );

    if (!candidates.every((choice) => availableChoiceIdSet.has(choice.id))) {
      throw new BadRequestException('Invalid choice id');
    }

    this.logger.logAction({
      action: Action.RESOLVED_VOTE,
      info: {
        userId,
        proposalId,
        message: `Voted for ${candidates.map((candidate) => candidate.value).join(', ')}`,
      },
    });

    return await this.prisma.vote.update({
      where: {
        userId_proposalId: {
          userId,
          proposalId,
        },
      },
      data: {
        candidates: {
          set: candidates.map((choice) => ({
            id: choice.id,
          })),
        },
        status: VoteStatus.RESOLVED,
      },
    });
  }

  async suggestVote(
    userId: string,
    proposalId: string,
    voteId: string,
    candidates: Candidate[],
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
            suggestedCandidates: true,
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

    if (proposal.candidates.length < candidates.length) {
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

    this.logger.logAction({
      action: Action.OFFER_VOTE_SUGGESTION,
      info: {
        userId,
        proposalId,
        message: `Suggested ${candidates.map((candidate) => candidate.value).join(', ')} for ${voteUser.personalNames.join(' ')}, ${voteUser.familyName}`,
      },
    });

    this.notifier.notifyUsers({
      proposalId,
      userId,
      package: {
        type: NotificationType.VOTE_SUGGESTION,
        content: {
          candidates,
          suggestedBy: `${manager.user.personalNames.join(' ')}, ${manager.user.familyName}`,
        },
      },
    });

    return await this.prisma.vote.update({
      where: {
        id: voteId,
      },
      data: {
        suggestedCandidates: {
          set: candidates.map((choice) => ({
            id: choice.id,
          })),
        },
        suggestedManagerId: proposal.managers[0].id,
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
            suggestedCandidates: true,
            suggestedBy: true,
            user: true,
          },
        },
      },
    });

    if (!proposal) {
      throw new BadRequestException('Proposal not found');
    }

    const userVote = proposal.votes.find((vote) => vote.userId === userId);

    if (
      !userVote.suggestedCandidates ||
      userVote.suggestedCandidates.length === 0
    ) {
      throw new ConflictException('No vote suggestions to accept');
    }

    if (userVote.suggestedManagerId === '' || !userVote.suggestedBy) {
      throw new ConflictException('No manager associated with vote suggestion');
    }

    this.logger.logAction({
      action: Action.ACCEPT_VOTE_SUGGESTION,
      info: {
        userId,
        proposalId,
        message: `Accepted vote suggestion ${userVote.suggestedCandidates.map((candidate) => candidate.value).join(', ')}`,
      },
    });
    console.log('userVote', userVote);
    this.notifier.notifyUsers({
      userId: userVote.suggestedBy.userId,
      proposalId,
      package: {
        type: NotificationType.VOTE_SUGGESTION_ACCEPTED,
        content: {
          acceptedBy: `${userVote.user.personalNames.join(' ')}, ${userVote.user.familyName}`,
        },
      },
    });

    return await this.prisma.vote.update({
      where: {
        id: userVote.id,
      },
      data: {
        status: VoteStatus.RESOLVED,
        candidates: {
          set: userVote.suggestedCandidates,
        },
        suggestedCandidates: {
          set: [],
        },
        suggestedManagerId: null,
      },
    });
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
            suggestedCandidates: true,
            suggestedBy: true,
            user: true,
          },
        },
      },
    });

    if (!proposal) {
      throw new BadRequestException('Proposal not found');
    }

    const userVote = proposal.votes.find((vote) => vote.userId === userId);

    if (
      !userVote.suggestedCandidates ||
      userVote.suggestedCandidates.length === 0
    ) {
      throw new ConflictException('No vote suggestions to reject');
    }

    if (userVote.suggestedManagerId === '' || !userVote.suggestedBy) {
      throw new ConflictException('No manager associated with vote suggestion');
    }

    this.logger.logAction({
      action: Action.REJECT_VOTE_SUGGESTION,
      info: {
        userId,
        proposalId,
        message: `Rejected vote suggestion ${userVote.suggestedCandidates.map((candidate) => candidate.value).join(', ')}`,
      },
    });

    this.notifier.notifyUsers({
      userId: userVote.suggestedBy.userId,
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
        suggestedCandidates: {
          set: [],
        },
        suggestedManagerId: null,
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
            candidates: true,
          },
        },
      },
    });

    if (!proposal) {
      throw new BadRequestException('Proposal not found');
    }

    return proposal.votes.map((vote) => vote.candidates);
  }
}
