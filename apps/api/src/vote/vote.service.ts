import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ProposalChoice, VoteStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VoteService {
  constructor(private prisma: PrismaService) {}

  async voteForProposal(
    userId: string,
    proposalId: string,
    choices: ProposalChoice[],
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
        choices: true,
        votes: true,
      },
    });

    if (!proposal) {
      throw new BadRequestException('Proposal not found');
    }
    if (proposal.choices.length < choices.length) {
      throw new BadRequestException('Invalid number of choices');
    }
    const userVote = proposal.votes.find((vote) => vote.userId === userId);

    if (userVote.status === VoteStatus.RESOLVED) {
      throw new ConflictException('User vote already resolved');
    }

    const availableChoiceIdSet = new Set(
      proposal.choices.map((choice) => choice.id),
    );

    if (!choices.every((choice) => availableChoiceIdSet.has(choice.id))) {
      throw new BadRequestException('Invalid choice id');
    }

    return await this.prisma.vote.update({
      where: {
        userId_proposalId: {
          userId,
          proposalId,
        },
      },
      data: {
        choices: {
          set: choices.map((choice) => ({
            id: choice.id,
          })),
        },
        status: VoteStatus.RESOLVED,
      },
    });
  }

  async editVote(
    userId: string,
    proposalId: string,
    voteId: string,
    choices: ProposalChoice[],
    voteStatus: VoteStatus,
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
        choices: true,
        votes: true,
        managers: {
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

    if (proposal.choices.length < choices.length) {
      throw new BadRequestException('Invalid number of choices');
    }

    const manager = proposal.managers.find(
      (manager) => manager.userId === userId,
    );

    if (!manager.role.permissions.canEditVoteChoices) {
      throw new ConflictException(
        'User does not have permission to edit votes',
      );
    }

    return await this.prisma.vote.update({
      where: {
        id: voteId,
      },
      data: {
        choices: {
          set: choices.map((choice) => ({
            id: choice.id,
          })),
        },
        status: voteStatus,
      },
    });
  }
}
