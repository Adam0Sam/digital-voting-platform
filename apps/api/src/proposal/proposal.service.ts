import { Injectable } from '@nestjs/common';
import {
  Proposal,
  ProposalResolutionValue,
  ProposalStatus,
  ProposalVisibility,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProposalDto } from './dto';

@Injectable()
export class ProposalService {
  constructor(private prisma: PrismaService) {}

  private getRequiredRolesByVisibility(
    userId: string,
    visibility: ProposalVisibility,
  ) {
    const requiredRolesByVisibility = {
      PUBLIC: [],
      MANAGER_ONLY: [
        { owners: { some: { id: userId } } },
        { reviewers: { some: { id: userId } } },
      ],
      RESTRICTED: [
        { owners: { some: { id: userId } } },
        { reviewers: { some: { id: userId } } },
        { userVotes: { some: { userId: userId } } },
      ],
    } satisfies Record<ProposalVisibility, Record<string, any>[]>;

    return requiredRolesByVisibility[visibility];
  }

  async getAllProposalsDemo(): Promise<Proposal[]> {
    return this.prisma.proposal.findMany({
      include: {
        owners: true,
        reviewers: true,
        resolutionValues: true,
        userVotes: true,
      },
    });
  }
  async getAllSpecificProposals(
    userId: string,
    proposalVisibility: ProposalVisibility,
    proposalStatus: ProposalStatus,
  ): Promise<Proposal[]> {
    return this.prisma.proposal.findMany({
      where: {
        status: proposalStatus,
        visibility: proposalVisibility,
        OR: this.getRequiredRolesByVisibility(userId, proposalVisibility),
      },
      include: {
        owners: true,
        reviewers: true,
        resolutionValues: true,
        userVotes: true,
      },
    });
  }

  async getProposalCategories(
    userId: string,
    proposalVisibility: ProposalVisibility,
  ): Promise<string[]> {
    const proposals = await this.prisma.proposal.findMany({
      where: {
        visibility: proposalVisibility,
        OR: this.getRequiredRolesByVisibility(userId, proposalVisibility),
      },
    });

    return proposals.map((proposal) => proposal.title);
  }

  async createProposal(proposal: ProposalDto) {
    const ownerIds = proposal.owners.map((owner) => ({
      id: owner.id,
    }));
    const reviewerIds =
      proposal.reviewers?.map((reviewer) => ({
        id: reviewer.id,
      })) ?? [];
    const voterIds =
      proposal.voters?.map((voter) => ({
        id: voter.id,
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
        userVotes: {
          create: voterIds.map((voterId) => ({
            userId: voterId.id,
          })),
        },
      },
    });
  }

  async deleteProposal(id: string) {
    return this.prisma.proposal.delete({ where: { id } });
  }
}
