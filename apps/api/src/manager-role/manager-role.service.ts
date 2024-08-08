import { Injectable } from '@nestjs/common';
import { ManagerRoleDto } from './dto/manager-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class ManagerRoleService {
  constructor(private prisma: PrismaService) {}

  async getAuthoredRoles(user: User) {
    return await this.prisma.proposalManagerRole.findMany({
      where: {
        permissions: {
          authorId: user.id,
        },
      },
      include: {
        permissions: true,
      },
    });
  }

  async updateRole(roleId: string, roleDto: ManagerRoleDto, user: User) {
    return await this.prisma.proposalManagerRole.update({
      where: {
        id: roleId,
        permissions: {
          authorId: user.id,
        },
      },
      data: {
        roleName: roleDto.roleName,
        description: roleDto.description,
        permissions: {
          update: roleDto.permissions,
        },
      },
    });
  }

  async createRole(roleDto: ManagerRoleDto, user: User) {
    return await this.prisma.proposalManagerRole.create({
      data: {
        roleName: roleDto.roleName,
        description: roleDto.description,
        permissions: {
          create: { ...roleDto.permissions, authorId: user.id },
        },
      },
    });
  }

  async deleteRole(roleId: string, userId: string) {
    return await this.prisma.proposalManagerRole.delete({
      where: {
        id: roleId,
        permissions: {
          authorId: userId,
        },
      },
    });
  }
}
