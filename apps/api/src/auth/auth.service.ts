import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserQueryDto } from './dto';
import { Grade, User, UserRole } from '@prisma/client';
import { JwtDto } from './jwt/dto';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(personalNames: string[], lastName: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        personalNames_lastName: {
          personalNames,
          lastName,
        },
      },
    });

    return user;
  }

  async findUser(query: UserQueryDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        personalNames_lastName: {
          personalNames: query.personalNames,
          lastName: query.lastName,
        },
      },
    });

    return user;
  }
  private mapGrade(gradeString: string): Grade {
    let grade: Grade | undefined;
    if (gradeString.toUpperCase().startsWith('TB')) {
      grade = Grade[gradeString.toUpperCase().slice(0, 3)];
    } else {
      grade = Grade[gradeString.toUpperCase()];
    }
    if (!grade) {
      throw new Error(`Invalid grade:${gradeString}`);
    }
    return grade;
  }

  private mapRoles(roles: string[]): UserRole[] {
    return roles.map((roleString) => {
      const role = UserRole[roleString.toUpperCase()];
      if (!role) {
        throw new Error(`Invalid role:${role}`);
      }
      return role;
    });
  }

  async createUser(userPayload: JwtDto & UserQueryDto) {
    const user: Omit<User, 'id'> = {
      personalNames: userPayload.personalNames,
      lastName: userPayload.lastName,
      grade: this.mapGrade(userPayload.grade),
      roles: this.mapRoles(userPayload.roles),
    };
    const createdUser = await this.prisma.user.create({
      data: user,
    });
    return createdUser;
  }
}
