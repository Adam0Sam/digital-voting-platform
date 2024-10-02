import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt/guard';
import { Roles } from 'src/auth/rbac/decorator';
import { UserRolesGuard } from 'src/auth/rbac/guard';
import { UserService } from './user.service';
import { GetUser } from './decorator';
import { ZodValidationPipe } from 'src/pipes';
import { UserEmailSchema } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  getProfile(@GetUser() user: User) {
    return user;
  }

  @UseGuards(UserRolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  getExternalUserInfo(@Param('id') userId: User['id']) {
    return this.userService.getExternalUserInfo(userId);
  }

  @Get('all')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Put('email')
  setUserEmail(
    @GetUser('id') userId: User['id'],
    @Body('email', new ZodValidationPipe(UserEmailSchema)) email: string,
  ) {
    return this.userService.setUserEmail(userId, email);
  }

  @Put('deactivate')
  setUserActiveStatus(@GetUser('id') userId: User['id']) {
    return this.userService.setUserActiveStatus(userId, false);
  }

  @UseGuards(UserRolesGuard)
  @Roles(UserRole.ADMIN)
  @UseGuards(UserRolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('admin/deactivate')
  deactivateUser(@Body('userId') userId: User['id']) {
    return this.userService.setUserActiveStatus(userId, false);
  }

  @UseGuards(UserRolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/all')
  getAllUsersDeep() {
    return this.userService.getAllUsersDeep();
  }
}
