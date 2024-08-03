import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { VoteModule } from 'src/vote/vote.module';

@Module({
  imports: [VoteModule],
  providers: [ProposalService],
  controllers: [ProposalController],
})
export class ProposalModule {}
