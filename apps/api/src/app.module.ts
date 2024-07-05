import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import { JwtAuthModule } from './auth/jwt/jwt-auth.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/api/.env'],
      // load: [appConfig],
    }),
    PrismaModule,
    AuthModule,
    JwtAuthModule,
    UserModule,
  ],
  providers: [AppService],
})
export class AppModule {}
