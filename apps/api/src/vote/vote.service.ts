import { Injectable } from '@nestjs/common';
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
}
