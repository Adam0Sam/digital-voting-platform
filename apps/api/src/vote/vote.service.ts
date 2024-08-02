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

  async getOneUserVote(userId: string, proposalId: string) {
    return await this.prisma.vote.findUnique({
      where: {
        userId_proposalId: {
          userId,
          proposalId,
        },
      },
      include: {
        choices: true,
      },
    });
  }
  async getAllUserVotes(userId: string) {
    return await this.prisma.vote.findMany({
      where: {
        userId,
      },
      include: {
        choices: true,
      },
    });
  }
  async voteForProposal(
    userId: string,
    proposalId: string,
    choices: ProposalChoice[],
  ) {
    const proposal = await this.prisma.proposal.findUnique({
      where: {
        id: proposalId,
      },
      include: {
        choices: true,
      },
    });
    if (!proposal) {
      throw new BadRequestException('Proposal not found');
    }
    if (proposal.choices.length < choices.length) {
      throw new BadRequestException('Invalid number of choices');
    }

    const availableChoiceIdSet = new Set(
      proposal.choices.map((choice) => choice.id),
    );
    if (!choices.every((choice) => availableChoiceIdSet.has(choice.id))) {
      throw new BadRequestException('Invalid choice id');
    }

    const { status } = await this.prisma.vote.findUnique({
      where: {
        userId_proposalId: {
          userId,
          proposalId,
        },
      },
    });

    const allVotes = await this.prisma.vote.findMany({
      include: {
        choices: true,
      },
    });

    console.log('ALL VOTES', allVotes[1].choices);

    if (status === VoteStatus.RESOLVED) {
      throw new ConflictException('Vote already resolved');
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
}
