import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard';
import { ManagerRoleService } from './manager-role.service';
import { ZodValidationPipe } from 'src/lib/pipes';

import { GetUser } from 'src/lib/decorator';
import {
  CreateManagerRoleDto,
  CreateManagerRoleDtoSchema,
  UpdateManagerRoleDto,
  UpdateManagerRoleDtoSchema,
  User,
} from '@ambassador';

@UseGuards(JwtAuthGuard)
@Controller('manager-role')
export class ManagerRoleController {
  constructor(private readonly managerRoleService: ManagerRoleService) {}

  @Post('')
  async createManagerRole(
    @Body(new ZodValidationPipe(CreateManagerRoleDtoSchema))
    roleDto: CreateManagerRoleDto,
    @GetUser() user: User,
  ) {
    return await this.managerRoleService.createRole(roleDto, user);
  }

  @Put(':roleId')
  async updateManagerRole(
    @Body(new ZodValidationPipe(UpdateManagerRoleDtoSchema))
    roleDto: UpdateManagerRoleDto,
    @GetUser() user: User,
    @Param(
      'roleId',
      new ValidationPipe({
        transform: true,
      }),
    )
    roleId: string,
  ) {
    return await this.managerRoleService.updateRole(roleId, roleDto, user);
  }

  @Delete(':roleId')
  async deleteManagerRole(
    @Param(
      'roleId',
      new ValidationPipe({
        transform: true,
      }),
    )
    roleId: string,
    @GetUser() user: User,
  ) {
    return await this.managerRoleService.deleteRole(roleId, user.id);
  }

  @Get('authored')
  async getAuthoredRoles(@GetUser() user: User) {
    return await this.managerRoleService.getAuthoredRoles(user);
  }
}
