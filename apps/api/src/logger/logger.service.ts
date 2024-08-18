import { Injectable } from '@nestjs/common';
import { UserActions } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LoggerService {
  constructor(private prisma: PrismaService) {}

  async logAction(
    action: UserActions,
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
