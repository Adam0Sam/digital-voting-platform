import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard';
import { VoteService } from './vote.service';
import { ProposalChoice, User } from '@prisma/client';
import { GetUser } from 'src/user/decorator';

@UseGuards(JwtAuthGuard)
@Controller('vote')
export class VoteController {
  constructor(private voteService: VoteService) {}

  @Post(':id')
  async castUserVote(
    @Param('id') proposalId: string,
    @Body('choices') choices: ProposalChoice[],
    @GetUser('id') userId: User['id'],
  ) {
    return this.voteService.voteForProposal(userId, proposalId, choices);
  }
}
