import { Injectable } from '@nestjs/common';
import { Action } from '@ambassador/action-log';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserActionLog } from '@prisma/client';

export type LogActionParams = {
  action: Action;
  info: {
    userId: string;
    proposalId?: string;
    userAgent?: string;
    message?: string;
  };
};

@Injectable()
export class LoggerService {
  constructor(private prisma: PrismaService) {}

  async logAction({ action, info }: LogActionParams): Promise<UserActionLog> {
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
