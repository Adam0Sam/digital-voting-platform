import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor() {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile() {
    return 'This is your profile. You are logged in.';
  }
}
