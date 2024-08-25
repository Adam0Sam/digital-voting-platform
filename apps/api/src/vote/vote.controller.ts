import {
  Body,
  Controller,
  Headers,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard';
import { VoteService } from './vote.service';
import { ProposalChoice, User, UserActions, VoteStatus } from '@prisma/client';
import { GetUser } from 'src/user/decorator';
import { LoggerService } from 'src/logger/logger.service';
import { ParseStringLiteral } from 'src/pipes';

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

  @Put(':proposalId/:voteId')
  async editVote(
    @Param('proposalId') proposalId: string,
    @Param('voteId') voteId: string,
    @Body('choices') choices: ProposalChoice[],
    @Body('status', new ParseStringLiteral(Object.values(VoteStatus)))
    voteStatus: VoteStatus,
    @Headers('user-agent') userAgent: string,
    @GetUser('id') userId: User['id'],
  ) {
    this.logger.logAction(UserActions.EDIT_VOTE, { userId, userAgent });

    return this.voteService.editVote(
      userId,
      proposalId,
      voteId,
      choices,
      voteStatus,
    );
  }
}
