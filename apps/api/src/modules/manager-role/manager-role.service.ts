import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/modules/prisma/prisma.service';
import { User } from '@ambassador/user';
import {
  CreateManagerRoleDto,
  UpdateManagerRoleDto,
} from '@ambassador/manager';

@Injectable()
export class ManagerRoleService {
  constructor(private prisma: PrismaService) {}

  async getAuthoredRoles(user: User) {
    return await this.prisma.managerRole.findMany({
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

  async updateRole(roleId: string, roleDto: UpdateManagerRoleDto, user: User) {
    return await this.prisma.managerRole.update({
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

  async createRole(roleDto: CreateManagerRoleDto, user: User) {
    return await this.prisma.managerRole.create({
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
    return await this.prisma.managerRole.delete({
      where: {
        id: roleId,
        permissions: {
          authorId: userId,
        },
      },
    });
  }
}
