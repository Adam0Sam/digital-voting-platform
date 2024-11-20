import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard';
import { NotificationService } from './notification.service';
import { GetUser } from 'src/lib/decorator';

@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('unread/count')
  getUnreadNotificationCount(@GetUser('id') userId: string) {
    return this.notificationService.getUnreadNotificationCount(userId);
  }

  @Get('')
  getNotifications(@GetUser('id') userId: string) {
    return this.notificationService.getNotifications(userId);
  }

  @Put('read/all')
  markAllAsRead(@GetUser('id') userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }

  @Put('read/:id')
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Put('unread/:id')
  markAsUnread(@Param('id') id: string) {
    return this.notificationService.markAsUnread(id);
  }
}
