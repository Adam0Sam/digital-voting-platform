import {
  CreateUserDto,
  CreateUserDtoSchema,
  User,
  UserRole,
} from '@ambassador';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard';
import { Roles } from 'src/auth/rbac/decorator';
import { UserRolesGuard } from 'src/auth/rbac/guard';
import { ZodValidationPipe } from 'src/pipes';
import { UserService } from 'src/user/user.service';

@UseGuards(JwtAuthGuard, UserRolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private userService: UserService) {}

  @Get('all')
  getAllUsersDeep() {
    return this.userService.getAllUsersDeep();
  }

  @Put(':userId/edit')
  editUser(
    @Param('userId') userId: string,
    @Body('user', new ZodValidationPipe(CreateUserDtoSchema))
    user: CreateUserDto,
  ) {
    return this.userService.editUser(userId, user);
  }

  @Put(':userId/deactivate')
  deactivateUser(@Param('userId') userId: User['id']) {
    return this.userService.setUserActiveStatus(userId, false);
  }

  @Put(':userId/activate')
  activateUser(@Param('userId') userId: User['id']) {
    return this.userService.setUserActiveStatus(userId, true);
  }

  @Delete(':userId')
  deleteUser(@Param('userId') userId: User['id']) {
    return this.userService.deleteUser(userId);
  }
}
