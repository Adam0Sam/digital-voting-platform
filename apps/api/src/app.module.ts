import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './lib/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AppService } from './app.service';
import { ProposalModule } from './modules/proposal/proposal.module';

import { VoteModule } from './modules/vote/vote.module';
import { ManagerRoleModule } from './modules/manager-role/manager-role.module';
import appConfig from './lib/config/app.config';
import { LoggerModule } from './modules/logger/logger.module';
import { ActionLogModule } from './modules/action-log/action-log.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    ConfigModule.forRoot({
      expandVariables: true,
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
    ActionLogModule,
    NotificationModule,
    AdminModule,
  ],
  providers: [AppService],
})
export class AppModule {}
