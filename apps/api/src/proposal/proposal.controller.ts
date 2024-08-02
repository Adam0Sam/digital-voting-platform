import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard';
import { ProposalService } from './proposal.service';
import { ProposalAgentRole, ProposalAgentRoles } from 'src/lib/types';
import { ParseStringLiteral, ZodValidationPipe } from 'src/pipes';
import { ProposalDto, ProposalDtoSchema } from './dto';
import { VoteService } from 'src/vote/vote.service';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('proposal')
export class ProposalController {
  constructor(
    private proposalService: ProposalService,
    private voteService: VoteService,
  ) {}

  @Get('votes/all')
  getAllUserVotes(@GetUser('id') userId: User['id']) {
    console.log('Getting All User Votes');
    return this.voteService.getAllUserVotes(userId);
  }

  @Get('votes/:id')
  getUserVote(
    @GetUser('id') userId: User['id'],
    @Param('id') proposalId: string,
  ) {
    return this.voteService.getOneUserVote(userId, proposalId);
  }

  @Get(':agentRole/all')
  getProposalsByAgentRole(
    @GetUser('id') userId: User['id'],
    @Param('agentRole', new ParseStringLiteral(ProposalAgentRoles))
    agentRole: ProposalAgentRole,
  ) {
    console.log('Getting Proposals by Agent Role');
    return this.proposalService.getProposalByAgent(userId, agentRole);
  }

  @Post('create')
  createOne(
    @Body('proposal', new ZodValidationPipe(ProposalDtoSchema))
    proposal: ProposalDto,
  ) {
    return this.proposalService.createProposal(proposal);
  }

  @Get(':id/choice-count')
  async getChoiceCount(@Param('id') proposalId: string) {
    const { choiceCount } = await this.proposalService.getOne(proposalId);
    return { choiceCount };
  }

  // @Post(':id/vote')
  // async voteForProposalChoice(
  //   @GetUser('id') userId: User['id'],
  //   @Param('id') proposalId: string,
  // ) {
  //   const { choiceCount } = await this.proposalService.getOne(proposalId);
  //   if (req.choices.length > choiceCount) {
  //     throw new ConflictException(
  //       `Sent a request with ${req.choices} choices, but the proposal only has ${choiceCount} choices`,
  //     );
  //   }
  //   return this.voteService.voteForProposal(
  //     req.user.id,
  //     proposalId,
  //     req.choices,
  //   );
  // }
}
