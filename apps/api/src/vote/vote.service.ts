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

    if (!userVote) {
      throw new BadRequestException(
        'User is not allowed to vote on this proposal',
      );
    }

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
}
