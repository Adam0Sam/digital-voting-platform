import {
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Headers('authentication') auth: string) {
    // const publicKey = await this.authService.getPublicKey();
    return { auth };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Headers('authentication') auth: string) {
    console.log(auth);
    return auth;
  }
}
