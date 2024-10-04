import { Injectable } from '@nestjs/common';
import { Action } from '@ambassador/action-log';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LoggerService {
  constructor(private prisma: PrismaService) {}

  async logAction(
    action: Action,
    info: {
      userId?: string;
      userAgent: string;
      message?: string;
    },
  ) {
    return this.prisma.userActionLog.create({
      data: {
        action,
        userId: info?.userId,
        userAgent: info.userAgent,
        message: info?.message,
      },
    });
  }
}
