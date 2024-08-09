import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { ProposalDto, ProposalManagerListDtoSchema } from './dto';
import { z } from 'zod';

@Injectable()
export class ProposalService {
  constructor(private prisma: PrismaService) {}

  // private getWhereClauseByAgent(
  //   agentId: string,
  //   agentRole: ProposalAgentRole,
  // ): Prisma.ProposalWhereInput {
  //   if (agentRole === 'VOTER') {
  //     return {
  //       votes: { some: { userId: agentId } },
  //       OR: [
  //         {
  //           visibility: ProposalVisibility.PUBLIC,
  //         },
  //         {
  //           visibility: ProposalVisibility.AGENT_ONLY,
  //         },
  //       ],
  //     };
  //   }
  //   return { managers: { some: { userId: agentId, role: agentRole } } };
  // }

  // private getIncludeClauseByAgent(
  //   agentRole: ProposalAgentRole,
  // ): Prisma.ProposalInclude {
  //   if (agentRole === 'VOTER') {
  //     return {
  //       choices: true,
  //     };
  //   }
  //   return {
  //     votes: true,
  //     managers: true,
  //     choices: true,
  //   };
  // }

  // async getProposalByAgent(agentId: string, agentRole: ProposalAgentRole) {
  //   return this.prisma.proposal.findMany({
  //     where: this.getWhereClauseByAgent(agentId, agentRole),
  //     include: this.getIncludeClauseByAgent(agentRole),
  //   });
  // }

  private getCreateManagersInput(
    managerLists: z.infer<typeof ProposalManagerListDtoSchema>[],
  ): Prisma.ProposalManagerUncheckedCreateNestedManyWithoutProposalInput {
    const createManagersInput: Prisma.ProposalManagerCreateManyProposalInput[] =
      [];

    for (const managerList of managerLists) {
      const roleId = managerList.role.id;
      for (const user of managerList.users) {
        createManagersInput.push({
          userId: user.id,
          proposalManagerRoleId: roleId,
        });
      }
    }

    return {
      createMany: { data: createManagersInput },
    };
  }

  async createOne(proposal: ProposalDto) {
    const voteUserIds =
      proposal.voters?.map((voter) => ({ userId: voter.id })) ?? [];
    const choices = proposal.choices.map((choice) => ({
      value: choice.value,
      description: choice.description,
    }));

    return this.prisma.proposal.create({
      data: {
        title: proposal.title,
        description: proposal.description,
        startDate: proposal.startDate,
        endDate: proposal.endDate,
        status: proposal.status,
        visibility: proposal.visibility,
        choices: {
          create: choices,
        },
        choiceCount: proposal.choiceCount,
        votes: {
          create: voteUserIds,
        },
        managers: this.getCreateManagersInput(proposal.managers),
      },
    });
  }

  async getOne(id: string) {
    return this.prisma.proposal.findUnique({
      where: { id },
    });
  }

  async getAllManaged(userId: string) {
    return this.prisma.proposal.findMany({
      where: {
        managers: {
          some: {
            userId,
          },
        },
      },
      include: {
        votes: {
          include: {
            choices: true,
          },
        },
        choices: true,
        managers: true,
      },
    });
  }

  /**
   * TODO: Might be useful l8r but currently completely deprecated
   */
  //   async getAllProposalsDemo(): Promise<Proposal[]> {
  //     return this.prisma.proposal.findMany({
  //       include: {
  //         owners: true,
  //         reviewers: true,
  //         resolutionValues: true,
  //         userVotes: true,
  //       },
  //     });
  //   }

  //   private getRequiredRolesByVisibility(
  //     userId: string,
  //     visibility: ProposalVisibility,
  //   ) {
  //     const requiredRolesByVisibility = {
  //       PUBLIC: [],
  //       MANAGER_ONLY: [
  //         { owners: { some: { id: userId } } },
  //         { reviewers: { some: { id: userId } } },
  //       ],
  //       RESTRICTED: [
  //         { owners: { some: { id: userId } } },
  //         { reviewers: { some: { id: userId } } },
  //         { userVotes: { some: { userId: userId } } },
  //       ],
  //     } satisfies PrismaQuery<ProposalVisibility, Record<string, any>[]>;

  //     return requiredRolesByVisibility[visibility];
  //   }

  //   async getAllSpecificProposals(
  //     userId: string,
  //     proposalVisibility: ProposalVisibility,
  //     proposalStatus: ProposalStatus,
  //   ) {
  //     return this.prisma.proposal.findMany({
  //       where: {
  //         status: proposalStatus,
  //         visibility: proposalVisibility,
  //         OR: this.getRequiredRolesByVisibility(userId, proposalVisibility),
  //       },
  //       include: {
  //         owners: true,
  //         reviewers: true,
  //         resolutionValues: true,
  //         userVotes: true,
  //       },
  //     });
  //   }

  //   async getProposalsByVisibility(
  //     userId: string,
  //     proposalVisibility: ProposalVisibility,
  //   ) {
  //     const requiredRoles = this.getRequiredRolesByVisibility(
  //       userId,
  //       proposalVisibility,
  //     );
  //     const query: PrismaQuery = {
  //       where: {
  //         visibility: proposalVisibility,
  //       },
  //     };
  //     if (requiredRoles.length > 0) {
  //       query.where.OR = requiredRoles;
  //     }

  //     return this.prisma.proposal.findMany({
  //       where: query.where,
  //       include: {
  //         resolutionValues: true,
  //         userVotes: true,
  //       },
  //     });
  //   }
}
