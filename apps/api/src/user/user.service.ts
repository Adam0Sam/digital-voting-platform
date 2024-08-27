import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserQueryDto } from './dto';
import { JwtDto } from 'src/auth/jwt/dto';
import { mapUserRoles } from './utils';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUser(query: UserQueryDto) {
    return await this.prisma.user.findUnique({
      where: {
        personalNames_familyName_grade: {
          personalNames: query.personalNames,
          familyName: query.familyName,
          grade: query.grade,
        },
      },
    });
  }

  async createUser(userPayload: JwtDto & UserQueryDto) {
    const user: Omit<User, 'id' | 'email' | 'active'> = {
      personalNames: userPayload.personalNames,
      familyName: userPayload.familyName,
      grade: userPayload.grade,
      roles: mapUserRoles(userPayload.roles),
    };
    return await this.prisma.user.create({
      data: user,
    });
  }

  async setUserEmail(userId: string, email: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { email },
    });
  }

  async setUserActiveStatus(userId: string, active: boolean) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { active },
    });
  }

  async getAllUserShallowInfo() {
    return await this.prisma.user.findMany();
  }

  async getAllUserDeepInfo() {
    return await this.prisma.user.findMany({
      include: {
        managedProposals: {
          include: {
            role: true,
          },
        },
        votes: {
          include: {
            choices: true,
          },
        },
      },
    });
  }
}
