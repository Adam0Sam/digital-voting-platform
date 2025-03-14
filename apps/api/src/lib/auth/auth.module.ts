import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy } from './jwt/strategy';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    UserModule,
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [JwtAuthStrategy],
})
export class AuthModule {}
