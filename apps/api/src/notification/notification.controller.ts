import { Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard';

@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {
  @Get('')
  getNotifications() {
    return [];
  }

  @Put('read')
  markAsRead() {
    return [];
  }
}
