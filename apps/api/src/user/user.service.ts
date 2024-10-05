import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserQueryDto } from './dto';
import { CreateUserDto } from '@ambassador';

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

  async createUser(userDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: userDto,
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

  async getAllUsers() {
    return await this.prisma.user.findMany();
  }

  async getAllUsersDeep() {
    return await this.prisma.user.findMany({
      include: {
        authoredPermissions: true,
        votes: true,
        managedProposals: true,
      },
    });
  }
}
