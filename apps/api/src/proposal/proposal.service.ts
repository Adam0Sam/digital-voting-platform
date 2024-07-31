import { Injectable } from '@nestjs/common';
import {
  Proposal,
  ProposalResolutionValue,
  ProposalStatus,
  ProposalVisibility,
  UserRole,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProposalDto } from './dto';
import { PrismaQuery } from 'src/lib/types';

@Injectable()
export class ProposalService {
  constructor(private prisma: PrismaService) {}

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
    } satisfies PrismaQuery<ProposalVisibility, Record<string, any>[]>;

    return requiredRolesByVisibility[visibility];
  }

  async getAllSpecificProposals(
    userId: string,
    proposalVisibility: ProposalVisibility,
    proposalStatus: ProposalStatus,
  ) {
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

  async getProposalsByVisibility(
    userId: string,
    proposalVisibility: ProposalVisibility,
  ) {
    const requiredRoles = this.getRequiredRolesByVisibility(
      userId,
      proposalVisibility,
    );
    const query: PrismaQuery = {
      where: {
        visibility: proposalVisibility,
      },
    };
    if (requiredRoles.length > 0) {
      query.where.OR = requiredRoles;
    }

    return this.prisma.proposal.findMany({
      where: query.where,
      include: {
        resolutionValues: true,
        userVotes: true,
      },
    });
  }

  // TODO: All three following methods are nearly identical, consider making a more genetic way to fetch proposals
  async getVoterProposals(userId: string) {
    return this.prisma.proposal.findMany({
      where: {
        userVotes: {
          some: {
            userId,
          },
        },
        // MANGER_ONLY visibility is excluded here
        /**
         * TODO
         * Make a more consistent way to handle visibility
         */
        OR: [
          { visibility: ProposalVisibility.PUBLIC },
          { visibility: ProposalVisibility.RESTRICTED },
        ],
      },
      include: {
        resolutionValues: true,
        userVotes: {
          include: {
            user: true,
            chosenResolutions: true,
          },
        },
        owners: true,
        reviewers: true,
      },
    });
  }

  async getOwnerProposals(userId: string) {
    return this.prisma.proposal.findMany({
      where: {
        owners: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        resolutionValues: true,
        userVotes: {
          include: {
            user: true,
            chosenResolutions: true,
          },
        },
        owners: true,
        reviewers: true,
      },
    });
  }

  async getReviewerProposals(userId: string) {
    return this.prisma.proposal.findMany({
      where: {
        reviewers: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        resolutionValues: true,
        userVotes: {
          include: {
            user: true,
            chosenResolutions: true,
          },
        },
        owners: true,
        reviewers: true,
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
        visibility: proposal.visibility,
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
