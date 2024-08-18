import {
  Body,
  Controller,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard';
import { VoteService } from './vote.service';
import { ProposalChoice, User, UserActions } from '@prisma/client';
import { GetUser } from 'src/user/decorator';
import { LoggerService } from 'src/logger/logger.service';

@UseGuards(JwtAuthGuard)
@Controller('vote')
export class VoteController {
  constructor(
    private voteService: VoteService,
    private logger: LoggerService,
  ) {}

  @Post(':id')
  async castUserVote(
    @Param('id') proposalId: string,
    @Body('choices') choices: ProposalChoice[],
    @Headers('user-agent') userAgent: string,
    @GetUser('id') userId: User['id'],
  ) {
    this.logger.logAction(UserActions.VOTE, { userId, userAgent });
    return this.voteService.voteForProposal(userId, proposalId, choices);
  }
}
