import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfig } from 'src/config/interfaces';
import { JwtAuthStrategy } from './jwt-auth.strategy';
import { JwtAuthService } from './jwt-auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [JwtAuthStrategy, JwtAuthService],
  exports: [JwtAuthService],
})
export class JwtAuthModule {}
