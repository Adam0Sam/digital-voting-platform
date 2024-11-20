import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ActionFilter, Action } from '@ambassador/action-log';

@Injectable()
export class ActionLogService {
  constructor(private prisma: PrismaService) {}

  private getsUserLogWhereClause(userId: string, actionFilter: ActionFilter) {
    const filteredActions = Object.keys(actionFilter).filter(
      (action) => actionFilter[action],
    ) as Action[];

    return {
      AND: [
        { userId },
        {
          action: { in: filteredActions },
        },
      ],
    };
  }

  async getUserLogsCount(userId: string, actionFilter: ActionFilter) {
    return await this.prisma.userActionLog.count({
      where: this.getsUserLogWhereClause(userId, actionFilter),
    });
  }

  async getUserLogs(
    userId: string,
    pageSize: number,
    page: number,
    actionFilter: ActionFilter,
  ) {
    return await this.prisma.userActionLog.findMany({
      where: this.getsUserLogWhereClause(userId, actionFilter),
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { time: 'desc' },
    });
  }
}
