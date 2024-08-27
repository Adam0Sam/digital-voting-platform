import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
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

  @Get('all/shallow')
  getAllUserShallowInfo() {
    return this.userService.getAllUserShallowInfo();
  }

  @Get('all/deep')
  @Roles(UserRole.ADMIN)
  @UseGuards(UserRolesGuard)
  getAllUserDeepInfo() {
    return this.userService.getAllUserDeepInfo();
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
    console.log('Deactivating user account');
    return this.userService.setUserActiveStatus(userId, false);
  }

  @UseGuards(UserRolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin')
  getAdmin() {
    return 'This is an admin route.';
  }
}
