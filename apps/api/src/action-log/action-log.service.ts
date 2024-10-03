import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActionFilterDto } from './dto';
import { UserActions } from '@prisma/client';

@Injectable()
export class ActionLogService {
  constructor(private prisma: PrismaService) {}

  private getsUserLogWhereClause(
    userId: string,
    actionFilter: ActionFilterDto,
  ) {
    const filteredActions = Object.keys(actionFilter).filter(
      (action) => actionFilter[action],
    ) as UserActions[];
    console.log(filteredActions);
    return {
      AND: [
        { userId },
        {
          action: { in: filteredActions },
        },
      ],
    };
  }

  async getUserLogsCount(userId: string, actionFilter: ActionFilterDto) {
    return await this.prisma.userActionLog.count({
      where: this.getsUserLogWhereClause(userId, actionFilter),
    });
  }

  async getUserLogs(
    userId: string,
    pageSize: number,
    page: number,
    actionFilter: ActionFilterDto,
  ) {
    return await this.prisma.userActionLog.findMany({
      where: this.getsUserLogWhereClause(userId, actionFilter),
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { time: 'desc' },
    });
  }
}
