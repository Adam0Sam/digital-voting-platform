import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { ProposalModule } from './proposal/proposal.module';

import { VoteModule } from './vote/vote.module';
import { ManagerRoleModule } from './manager-role/manager-role.module';
import appConfig from './config/app.config';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ProposalModule,
    VoteModule,
    ManagerRoleModule,
    LoggerModule,
  ],
  providers: [
    AppService,
    // should I register JwtAuthGuard here globally before the RolesGuard?
    // {
    //   provide: 'APP_GUARD',
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
