import { Candidate } from '@ambassador/candidate';
import {
  ManagerListDto,
  ManagerPermissions,
  CreateProposalDto,
  UpdateProposalDto,
  User,
} from '@ambassador';
import { VoteStatus } from '@ambassador/vote';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProposalService {
  constructor(private prisma: PrismaService) {}

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

  async createOne(proposal: CreateProposalDto) {
    const voteUserIds =
      proposal.voters?.map((voter) => ({ userId: voter.id })) ?? [];
    const candidates = proposal.candidates.map((choice) => ({
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
        candidates: {
          create: candidates,
        },
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
  }

  private getProposalUpdateInput({
    proposalId,
    proposalDto,
    permissions,
    prevCandidates,
  }: {
    proposalId?: string;
    proposalDto: UpdateProposalDto;
    permissions: ManagerPermissions;
    prevCandidates: Candidate[];
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
          if (permissions.canEditCandidates) {
            const candidateIdsForDeletion: string[] = prevCandidates
              .filter(
                (prevChoice) =>
                  !proposalDto.candidates.some(
                    (newChoice) => newChoice.id === prevChoice.id,
                  ),
              )
              .map((choice) => choice.id);

            updateInput.candidates = {
              upsert: proposalDto.candidates.map((choice) => ({
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
                  in: candidateIdsForDeletion,
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
        case 'userPattern':
          console.log(
            'userPattern',
            permissions.canEditUserPattern,
            proposalDto.userPattern,
          );
          if (permissions.canEditUserPattern) {
            updateInput.userPattern = {
              update: proposalDto.userPattern,
            };
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
    const { managers, candidates } = await this.prisma.proposal.findUnique({
      where: {
        id: proposalId,
      },
      select: {
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
        prevCandidates: candidates,
      }),
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
