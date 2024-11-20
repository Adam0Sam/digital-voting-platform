import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserActionLog } from '@prisma/client';
import { LogMessage } from './type';

@Injectable()
export class LoggerService {
  constructor(private prisma: PrismaService) {}

  async logAction({ action, info }: LogMessage): Promise<UserActionLog> {
    return this.prisma.userActionLog.create({
      data: {
        action,
        userId: info?.userId,
        userAgent: info.userAgent,
        message: info?.message,
        proposalId: info?.proposalId,
      },
    });
  }
}
