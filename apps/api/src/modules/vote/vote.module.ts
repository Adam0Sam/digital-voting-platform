import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { NotificationModule } from 'src/modules/notification/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [VoteService],
  exports: [VoteService],
  controllers: [VoteController],
})
export class VoteModule {}
