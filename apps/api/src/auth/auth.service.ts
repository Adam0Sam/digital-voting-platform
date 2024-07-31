import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserQueryDto } from './dto';
import { Grade, User, UserRole } from '@prisma/client';
import { JwtDto } from './jwt/dto';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // async validateUser(
  //   personalNames: string[],
  //   familyName: string,
  //   grade: string,
  // ) {
  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       personalNames_familyName_grade: {
  //         personalNames,
  //         familyName,
  //         grade,
  //       },
  //     },
  //   });

  //   return user;
  // }

  async findUser(query: UserQueryDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        personalNames_familyName_grade: {
          personalNames: query.personalNames,
          familyName: query.familyName,
          grade: query.grade,
        },
      },
    });

    return user;
  }

  /**
   * TODO
   * single responsibility principle: probably the service should be responsible for these mappings
   * this method is necessary because, OAuth2 may return different first_name prop depending on whether Tamo or MSTeams was used for authentication
   */
  splitNames(name: string) {
    if (name.includes(' ')) {
      return name.split(' ');
    } else {
      return name.match(/[A-Z][a-z]*/g);
    }
  }

  mapGrade(gradeString: string): Grade {
    let grade: Grade | undefined;
    if (gradeString.toUpperCase().startsWith('TB')) {
      grade = Grade[gradeString.toUpperCase().slice(0, 3)];
    } else {
      grade = Grade[gradeString.toUpperCase()];
    }
    if (!grade) {
      return Grade.NONE;
    }
    return grade;
  }

  mapRoles(roles: string[]): UserRole[] {
    return roles.map((roleString) => {
      const role: UserRole | undefined = UserRole[roleString.toUpperCase()];
      if (!role) {
        throw new Error(`Invalid role:${role}`);
      }
      return role;
    });
  }

  async createUser(userPayload: JwtDto & UserQueryDto) {
    const user: Omit<User, 'id'> = {
      personalNames: userPayload.personalNames,
      familyName: userPayload.familyName,
      grade: userPayload.grade,
      roles: this.mapRoles(userPayload.roles),
    };
    const createdUser = await this.prisma.user.create({
      data: user,
    });
    return createdUser;
  }
}
