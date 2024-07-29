import { Injectable } from '@nestjs/common';
import {
  Proposal,
  ProposalResolutionValue,
  ProposalStatus,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProposalDto } from './dto';

@Injectable()
export class ProposalService {
  constructor(private prisma: PrismaService) {}

  async getAllProposals(): Promise<Proposal[]> {
    return this.prisma.proposal.findMany({
      include: {
        owners: true,
        reviewers: true,
        resolutionValues: true,
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

    const resolutionValues: Omit<
      ProposalResolutionValue,
      'id' | 'proposalId'
    >[] = proposal.resolutionValues.map((val) => {
      return { value: val.value, description: val.description };
    });

    return this.prisma.proposal.create({
      data: {
        title: proposal.title,
        description: proposal.description,
        startDate: proposal.startDate,
        endDate: proposal.endDate,
        status: proposal.status,
        owners: { connect: ownerIds },
        reviewers: { connect: reviewerIds },
        resolutionValues: {
          create: resolutionValues,
        },
      },
    });
  }

  async deleteProposal(id: string) {
    return this.prisma.proposal.delete({ where: { id } });
  }
}
