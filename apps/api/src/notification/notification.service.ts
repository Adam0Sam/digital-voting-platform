import { CreateUserNotificationDto } from '@ambassador';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async notifyUsers(notification: CreateUserNotificationDto) {
    const isDedicatedToSingleUser = notification.userId !== undefined;
    console.log('notification', notification);
    console.log('isDedicatedToSingleUser', isDedicatedToSingleUser);
    const notificationPackage =
      await this.prisma.userNotificationPackage.create({
        data: {
          type: notification.package.type,
          content: notification.package.content,
        },
      });

    if (isDedicatedToSingleUser) {
      return this.prisma.userNotification.create({
        data: {
          userId: notification.userId,
          proposalId: notification.proposalId,
          userNotificationPackageId: notificationPackage.id,
        },
      });
    } else {
      const voters = await this.prisma.vote.findMany({
        where: { proposalId: notification.proposalId },
        select: { userId: true },
      });

      const notifications = voters.map((voter) => ({
        userId: voter.userId,
        proposalId: notification.proposalId,
        userNotificationPackageId: notificationPackage.id,
      }));

      return this.prisma.userNotification.createMany({
        data: notifications,
      });
    }
  }

  async markAsRead(id: string) {
    return this.prisma.userNotification.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAsUnread(id: string) {
    return this.prisma.userNotification.update({
      where: { id },
      data: { read: false },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.userNotification.updateMany({
      where: { userId },
      data: { read: true },
    });
  }

  async getNotifications(userId: string) {
    return this.prisma.userNotification.findMany({
      where: { userId },
      include: {
        package: true,
        proposal: true,
      },
    });
  }

  async getUnreadNotificationCount(userId: string) {
    return this.prisma.userNotification.count({
      where: { userId, read: false },
    });
  }
}
