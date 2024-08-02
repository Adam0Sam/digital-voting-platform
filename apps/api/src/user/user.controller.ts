import { Controller, Get, UseGuards } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt/guard';
import { Roles } from 'src/auth/rbac/decorator';
import { RolesGuard } from 'src/auth/rbac/guard';
import { UserService } from './user.service';
import { GetUser } from './decorator';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  getProfile(@GetUser() user: User) {
    console.log(user);
    return user;
  }

  @Get('all')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin')
  getAdmin() {
    return 'This is an admin route.';
  }
}
