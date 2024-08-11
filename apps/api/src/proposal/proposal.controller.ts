import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard';
import { ProposalService } from './proposal.service';

import { ZodValidationPipe } from 'src/pipes';
import {
  CreateProposalDto,
  CreateProposalDtoSchema,
  UpdateProposalDto,
} from './dto';
import { VoteService } from 'src/vote/vote.service';

import { ProposalChoice, User } from '@prisma/client';
import { GetUser } from 'src/user/decorator';

@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard)
@Controller('proposal')
export class ProposalController {
  constructor(
    private proposalService: ProposalService,
    private voteService: VoteService,
  ) {}

  // @Get('managed/all')
  // getAllManaged(@GetUser('id') userId: User['id']) {
  //   console.log('Getting All Managed Proposals', userId);
  //   return this.proposalService.getAllManaged(userId);
  // }

  // @Post('votes/:id')
  // castUserVote(
  //   @GetUser('id') userId: User['id'],
  //   @Param('id') proposalId: string,
  //   @Body('choices') choices: ProposalChoice[],
  // ) {
  //   return this.voteService.voteForProposal(userId, proposalId, choices);
  // }

  // @Get(':agentRole/all')
  // getProposalsByAgentRole(
  //   @GetUser('id') userId: User['id'],
  //   @Param('agentRole', new ParseStringLiteral(ProposalAgentRoles))
  //   agentRole: ProposalAgentRole,
  // ) {
  //   return this.proposalService.getProposalByAgent(userId, agentRole);
  // }

  @Post('')
  createOne(
    @Body('proposal', new ZodValidationPipe(CreateProposalDtoSchema))
    proposal: CreateProposalDto,
  ) {
    return this.proposalService.createOne(proposal);
  }

  @Put(':id')
  async updateOne(
    @Param('id') proposalId: string,
    @Body('proposal')
    proposalDto: UpdateProposalDto,
    @GetUser('id') userId: User['id'],
  ) {
    return this.proposalService.updateOne(proposalId, proposalDto, userId);
  }

  @Delete(':id')
  async deleteOne(@Param('id') proposalId: string) {
    console.log('Deleting Proposal', proposalId);
    return 'deleted';
  }

  @Get('voter/all')
  async getAllVoterProposals(@GetUser('id') userId: User['id']) {
    return this.proposalService.getAllVoterProposals(userId);
  }

  @Get('manager/all')
  async getAllManagerProposals(@GetUser('id') userId: User['id']) {
    return this.proposalService.getAllManagerProposals(userId);
  }

  // @Get(':id/choice-count')
  // async getChoiceCount(@Param('id') proposalId: string) {
  //   const { choiceCount } = await this.proposalService.getOne(proposalId);
  //   return { choiceCount };
  // }
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
