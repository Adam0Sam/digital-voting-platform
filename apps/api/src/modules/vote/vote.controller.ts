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
import { JwtAuthGuard } from 'src/lib/auth/jwt/guard';
import { VoteService } from './vote.service';
import { GetUser } from 'src/lib/decorator';
import { ZodValidationPipe } from 'src/lib/pipes';
import { User } from '@ambassador/user';
import { z } from 'zod';
import {
  CreateVoteSuggestionsDto,
  CreateVoteSuggestionsDtoSchema,
  VoteSelection,
  VoteSelectionSchema,
  VoteStatus,
} from '@ambassador';

@UseGuards(JwtAuthGuard)
@Controller('vote')
export class VoteController {
  constructor(private voteService: VoteService) {}

  @Post(':id')
  async castUserVote(
    @Param('id') proposalId: string,
    @Body('voteSelections', new ZodValidationPipe(z.array(VoteSelectionSchema)))
    voteSelections: VoteSelection[],
    @GetUser('id') userId: User['id'],
  ) {
    console.log('voteSelections', voteSelections);

    return this.voteService.voteForProposal(userId, proposalId, voteSelections);
  }

  @Put(':proposalId/suggestion/accept')
  async acceptVoteSuggestion(
    @Param('proposalId') proposalId: string,
    @GetUser('id') userId: User['id'],
  ) {
    return this.voteService.acceptVoteSuggestion(userId, proposalId);
  }

  @Put(':proposalId/suggestion/reject')
  async rejectVoteSuggestion(
    @Param('proposalId') proposalId: string,
    @GetUser('id') userId: User['id'],
  ) {
    return this.voteService.rejectVoteSuggestion(userId, proposalId);
  }

  @Put(':proposalId/suggestion/:voteId')
  async suggestVote(
    @Param('proposalId') proposalId: string,
    @Param('voteId') voteId: string,
    @Body(
      'voteSuggestions',
      new ZodValidationPipe(z.array(CreateVoteSuggestionsDtoSchema)),
    )
    voteSuggestions: CreateVoteSuggestionsDto[],
    @Headers('user-agent') userAgent: string,
    @GetUser('id') userId: User['id'],
  ) {
    return this.voteService.suggestVote(
      userId,
      proposalId,
      voteId,
      voteSuggestions,
    );
  }

  @Put(':proposalId/disable/:voteId')
  async disableUserVote(
    @Param('proposalId') proposalId,
    @Param('voteId') voteId: string,
    @GetUser('id') userId: User['id'],
  ) {
    return this.voteService.mutateUserVoteStatus({
      userId,
      proposalId,
      voteId,
      status: VoteStatus.DISABLED,
    });
  }

  @Put(':proposalId/enable/:voteId')
  async enableUserVote(
    @Param('proposalId') proposalId,
    @Param('voteId') voteId: string,
    @GetUser('id') userId: User['id'],
  ) {
    return this.voteService.mutateUserVoteStatus({
      userId,
      proposalId,
      voteId,
      status: VoteStatus.PENDING,
    });
  }

  @Get('anon/:proposalId')
  async getAnonVotes(
    @Param('proposalId') proposalId: string,
    @GetUser('id') userId: User['id'],
  ) {
    return this.voteService.getAnonVotes(proposalId, userId);
  }
}
