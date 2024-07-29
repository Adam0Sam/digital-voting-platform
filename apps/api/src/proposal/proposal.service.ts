import { Injectable } from '@nestjs/common';
import { Proposal } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProposalDto } from './dto';

@Injectable()
export class ProposalService {
  constructor(private prisma: PrismaService) {}

  async getAllProposals(): Promise<Proposal[]> {
    return this.prisma.proposal.findMany({
      include: {
        Owners: true,
        Reviewers: true,
      },
    });
  }

  async createProposal(proposal: ProposalDto) {
    const ownerIds = proposal.owners.map((owner) => ({
      id: owner.id,
    }));
    const reviewerIds =
      proposal.reviewers?.map((reviewer) => ({
        id: reviewer.id,
      })) ?? [];

    return this.prisma.proposal.create({
      data: {
        title: proposal.title,
        description: proposal.description,
        startDate: proposal.startDate,
        endDate: proposal.endDate,
        status: proposal.status,
        Owners: { connect: ownerIds },
        Reviewers: { connect: reviewerIds },
      },
    });
  }

  async deleteProposal(id: string) {
    return this.prisma.proposal.delete({ where: { id } });
  }
}
