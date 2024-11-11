import { Candidate } from '@ambassador/candidate';
import { VoteStatus } from '@ambassador/vote';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VoteService {
  constructor(private prisma: PrismaService) {}

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

    const availableChoiceIdSet = new Set(
      proposal.candidates.map((choice) => choice.id),
    );

    if (!candidates.every((choice) => availableChoiceIdSet.has(choice.id))) {
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
        candidates: {
          set: candidates.map((choice) => ({
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
    candidates: Candidate[],
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
        candidates: true,
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

    if (proposal.candidates.length < candidates.length) {
      throw new BadRequestException('Invalid number of candidates');
    }

    const manager = proposal.managers.find(
      (manager) => manager.userId === userId,
    );

    if (!manager.role.permissions.canEditVotes) {
      throw new ConflictException(
        'User does not have permission to edit votes',
      );
    }

    return await this.prisma.vote.update({
      where: {
        id: voteId,
      },
      data: {
        candidates: {
          set: candidates.map((choice) => ({
            id: choice.id,
          })),
        },
        status: voteStatus,
      },
    });
  }

  async getAnonVotes(proposalId, userId) {
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
