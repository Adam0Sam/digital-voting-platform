import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  ManagerPermissions,
  Prisma,
  ProposalChoice,
  VoteStatus,
} from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProposalDto, UpdateProposalDto } from './dto';
import { z } from 'zod';
import { ProposalManagerListDtoSchema } from 'src/manager-role/dto/manager-role.dto';

@Injectable()
export class ProposalService {
  constructor(private prisma: PrismaService) {}

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

  async createOne(proposal: CreateProposalDto) {
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

  private getProposalUpdateInput({
    proposalId,
    proposalDto,
    permissions,
    prevChoices,
  }: {
    proposalId?: string;
    proposalDto: UpdateProposalDto;
    permissions: ManagerPermissions;
    prevChoices: ProposalChoice[];
  }): Prisma.ProposalUpdateInput {
    const updateInput: Prisma.ProposalUpdateInput = {};
    let shouldResetVotes = false;
    for (const key in proposalDto) {
      switch (key) {
        case 'title':
          if (permissions.canEditTitle) {
            updateInput.title = proposalDto.title;
          }
          break;
        case 'description':
          if (permissions.canEditDescription) {
            updateInput.description = proposalDto.description;
          }
          break;
        case 'startDate':
          if (permissions.canEditDates) {
            updateInput.startDate = proposalDto.startDate;
          }
          break;
        case 'endDate':
          if (permissions.canEditDates) {
            updateInput.endDate = proposalDto.endDate;
          }
          break;
        case 'status':
          if (permissions.canEditStatus) {
            updateInput.status = proposalDto.status;
          }
          break;
        case 'visibility':
          if (permissions.canEditVisibility) {
            updateInput.visibility = proposalDto.visibility;
          }
          break;
        case 'choices':
          if (permissions.canEditAvailableChoices) {
            const choiceIdsForDeletion: string[] = prevChoices
              .filter(
                (prevChoice) =>
                  !proposalDto.choices.some(
                    (newChoice) => newChoice.id === prevChoice.id,
                  ),
              )
              .map((choice) => choice.id);

            updateInput.choices = {
              upsert: proposalDto.choices.map((choice) => ({
                where: {
                  id: choice.id ?? '',
                },
                update: {
                  value: choice.value,
                  description: choice.description,
                },
                create: {
                  value: choice.value,
                  description: choice.description,
                },
              })),
              deleteMany: {
                id: {
                  in: choiceIdsForDeletion,
                },
              },
            };

            shouldResetVotes = true;
          }
          break;
        case 'choiceCount':
          if (permissions.canEditChoiceCount) {
            updateInput.choiceCount = proposalDto.choiceCount;
            shouldResetVotes = true;
          }
          break;
      }
    }

    if (shouldResetVotes) {
      updateInput.votes = {
        updateMany: {
          where: {
            proposalId: proposalId ?? proposalDto.id,
          },
          data: {
            status: VoteStatus.PENDING,
          },
        },
      };
    }

    return updateInput;
  }

  async updateOne(
    proposalId: string,
    proposalDto: UpdateProposalDto,
    userId: string,
  ) {
    const { managers, choices } = await this.prisma.proposal.findUnique({
      where: {
        id: proposalId,
      },
      select: {
        choices: true,
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

    if (!managers.length) {
      throw new UnauthorizedException('User is not a manager of this proposal');
    }
    const permissions = managers[0].role.permissions;

    return this.prisma.proposal.update({
      where: {
        id: proposalId,
      },
      data: this.getProposalUpdateInput({
        proposalId,
        proposalDto,
        permissions,
        prevChoices: choices,
      }),
    });
  }
  async getAllVoterProposals(userId: string) {
    return this.prisma.proposal.findMany({
      where: {
        votes: {
          some: {
            userId,
          },
        },
      },
      include: {
        choices: true,
        votes: {
          where: {
            userId,
          },
          include: {
            choices: true,
          },
        },
      },
    });
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
            choices: true,
            user: true,
          },
        },
        choices: true,
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
  }
}
