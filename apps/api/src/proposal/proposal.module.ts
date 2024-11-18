import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { VoteModule } from 'src/vote/vote.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [VoteModule, NotificationModule],
  providers: [ProposalService],
  controllers: [ProposalController],
})
export class ProposalModule {}
