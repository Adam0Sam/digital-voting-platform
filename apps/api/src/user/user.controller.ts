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

  @Get('all')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Put(':id/email')
  setUserEmail(
    @Param('id') userId: string,
    @Body('email', new ZodValidationPipe(UserEmailSchema)) email: string,
  ) {
    return this.userService.setUserEmail(userId, email);
  }

  @UseGuards(UserRolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin')
  getAdmin() {
    return 'This is an admin route.';
  }
}
