import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard';
import { VoteService } from './vote.service';
import { GetUser } from 'src/user/decorator';
import { LoggerService } from 'src/logger/logger.service';
import { ParseStringLiteral } from 'src/pipes';
import { Candidate } from '@ambassador/candidate';
import { User } from '@ambassador/user';
import { VoteStatus } from '@ambassador/vote';

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
    @Body('candidates') candidates: Candidate[],
    @Headers('user-agent') userAgent: string,
    @GetUser('id') userId: User['id'],
  ) {
    return this.voteService.voteForProposal(userId, proposalId, candidates);
  }

  @Put(':proposalId/suggestion/:voteId')
  async suggestVote(
    @Param('proposalId') proposalId: string,
    @Param('voteId') voteId: string,
    @Body('candidates') candidates: Candidate[],
    @Body('status', new ParseStringLiteral(Object.values(VoteStatus)))
    voteStatus: VoteStatus,
    @Headers('user-agent') userAgent: string,
    @GetUser('id') userId: User['id'],
  ) {
    return this.voteService.suggestVote(userId, proposalId, voteId, candidates);
  }

  @Get('anon/:proposalId')
  async getAnonVotes(
    @Param('proposalId') proposalId: string,
    @GetUser('id') userId: User['id'],
  ) {
    return this.voteService.getAnonVotes(proposalId, userId);
  }
}
