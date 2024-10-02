import { Module } from '@nestjs/common';
import { ActionLogService } from './action-log.service';
import { ActionLogController } from './action-log.controller';

@Module({
  providers: [ActionLogService],
  controllers: [ActionLogController],
})
export class ActionLogModule {}
