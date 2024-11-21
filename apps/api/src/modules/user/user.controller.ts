import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { User } from '@ambassador/user';
import { JwtAuthGuard } from 'src/lib/auth/jwt/guard';
import { UserService } from './user.service';
import { GetUser } from '../../lib/decorator';
import { ZodValidationPipe } from 'src/lib/pipes';
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
}
