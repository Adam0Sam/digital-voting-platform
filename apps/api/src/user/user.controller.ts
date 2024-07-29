import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt/guard';
import { Roles } from 'src/auth/rbac/decorator';
import { RolesGuard } from 'src/auth/rbac/guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  getProfile(@Req() req: any) {
    return req.user;
  }

  @Get('all')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin')
  getAdmin() {
    return 'This is an admin route.';
  }
}
