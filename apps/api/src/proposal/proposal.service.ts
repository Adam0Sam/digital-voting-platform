import {
  ManagerListDto,
  CreateProposalDto,
  UpdateProposalDto,
  User,
  Action,
  withDatesAsStrings,
} from '@ambassador';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/logger/logger.service';
import { getProposalUpdateInput } from './update-utils/update-input';
import { getProposalUpdateLogMessages } from './update-utils/update-log';

@Injectable()
export class ProposalService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
  ) {}

  private getCreateManagersInput(
    managerLists: ManagerListDto[],
  ): Prisma.ManagerUncheckedCreateNestedManyWithoutProposalInput {
    const createManagersInput: Prisma.ManagerCreateManyProposalInput[] = [];

    for (const managerList of managerLists) {
      const roleId = managerList.role.id;
      for (const user of managerList.users) {
        createManagersInput.push({
          userId: user.id,
          managerRoleId: roleId,
        });
      }
    }

    return {
      createMany: { data: createManagersInput },
    };
  }

  async createOne(
    proposal: CreateProposalDto,
    meta: { userId: string; userAgent: string },
  ) {
    const voteUserIds =
      proposal.voters?.map((voter) => ({ userId: voter.id })) ?? [];
    const candidates = proposal.candidates.map((choice) => ({
      value: choice.value,
      description: choice.description,
    }));

    const newProposal = await this.prisma.proposal.create({
      data: {
        title: proposal.title,
        description: proposal.description,
        startDate: proposal.startDate,
        endDate: proposal.endDate,
        resolutionDate: proposal.resolutionDate ?? proposal.endDate,
        status: proposal.status,
        visibility: proposal.visibility,
        candidates: {
          create: candidates,
        },
        votingSystem: proposal.votingSystem,
        userPattern: {
          create: proposal.userPattern,
        },
        choiceCount: proposal.choiceCount,
        votes: {
          create: voteUserIds,
        },
        managers: this.getCreateManagersInput(proposal.managers),
      },
    });
    this.logger.logAction({
      action: Action.CREATE_PROPOSAL,
      info: {
        userId: meta.userId,
        userAgent: meta.userAgent,
        proposalId: newProposal.id,
      },
    });
    return newProposal;
  }

  private getUserPatternWhereClause(
    userGrade: User['grade'],
    userRoles: User['roles'],
  ): Prisma.UserPatternWhereInput {
    return {
      OR: [
        {
          grades: {
            has: userGrade,
          },
        },
        {
          roles: {
            hasSome: userRoles,
          },
        },
      ],
    };
  }

  async updateOne(
    proposalId: string,
    proposalDto: UpdateProposalDto,
    userId: string,
  ) {
    const prevProposal = await this.prisma.proposal.findUnique({
      where: {
        id: proposalId,
      },
      include: {
        userPattern: true,
        candidates: true,
        managers: {
          where: {
            userId,
          },
          select: {
            role: {
              select: {
                permissions: true,
              },
            },
          },
        },
      },
    });

    if (!prevProposal.managers.length) {
      throw new UnauthorizedException('User is not a manager of this proposal');
    }
    const permissions = prevProposal.managers[0].role.permissions;
    const updateInput = getProposalUpdateInput({
      proposalId,
      proposalDto,
      permissions,
      prevProposal: withDatesAsStrings(prevProposal),
    });

    const logMessages = getProposalUpdateLogMessages(
      updateInput,
      withDatesAsStrings(prevProposal),
      userId,
    );

    for (const logMessage of logMessages) {
      this.logger.logAction(logMessage);
    }

    return this.prisma.proposal.update({
      where: {
        id: proposalId,
      },
      data: updateInput,
    });
  }

  async getAllVoterProposals(user: User) {
    const findManyProposalsInput = {
      where: {
        OR: [
          {
            votes: {
              some: {
                userId: user.id,
              },
            },
          },
          {
            userPattern: this.getUserPatternWhereClause(user.grade, user.roles),
          },
        ],
      },
      include: {
        candidates: true,
        votes: {
          where: {
            userId: user.id,
          },
          include: {
            candidates: true,
          },
        },
      },
    };
    const proposals = await this.prisma.proposal.findMany(
      findManyProposalsInput,
    );

    const proposalsWithoutVote = proposals.filter(
      (proposal) => !proposal.votes.some((vote) => vote.userId === user.id),
    );

    if (proposalsWithoutVote.length > 0) {
      await this.prisma.$transaction(
        proposalsWithoutVote.map((proposal) =>
          this.prisma.vote.create({
            data: {
              userId: user.id,
              proposalId: proposal.id,
            },
          }),
        ),
      );
      return this.prisma.proposal.findMany(findManyProposalsInput);
    }

    return proposals;
  }

  async getAllManagerProposals(userId: string) {
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
            candidates: true,
            suggestedCandidates: true,
            user: true,
          },
        },
        candidates: true,
        managers: {
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
        userPattern: true,
      },
    });
  }
}
