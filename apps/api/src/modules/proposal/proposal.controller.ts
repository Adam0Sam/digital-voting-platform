import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/lib/auth/jwt/guard';
import { ProposalService } from './proposal.service';
import { ZodValidationPipe } from 'src/lib/pipes';
import { GetUser } from 'src/lib/decorator';
import {
  CreateProposalDto,
  CreateProposalDtoSchema,
  UpdateProposalDto,
  UpdateProposalDtoSchema,
} from '@ambassador/proposal';
import { User } from '@ambassador/user';

@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard)
@Controller('proposal')
export class ProposalController {
  constructor(private proposalService: ProposalService) {}

  @Post('')
  createOne(
    @Body('proposal', new ZodValidationPipe(CreateProposalDtoSchema))
    proposal: CreateProposalDto,
    @Headers('user-agent')
    userAgent: string,
    @GetUser('id')
    userId: User['id'],
  ) {
    return this.proposalService.createOne(proposal, { userId, userAgent });
  }

  @Put(':id')
  async updateOne(
    @Param('id') proposalId: string,
    @Body('proposal', new ZodValidationPipe(UpdateProposalDtoSchema))
    proposalDto: UpdateProposalDto,
    @GetUser('id') userId: User['id'],
  ) {
    return this.proposalService.updateOne(proposalId, proposalDto, userId);
  }

  @Get('voter/all')
  async getAllVoterProposals(@GetUser() user: User) {
    return this.proposalService.getAllVoterProposals(user);
  }

  @Get('manager/all')
  async getAllManagerProposals(@GetUser('id') userId: User['id']) {
    return this.proposalService.getAllManagerProposals(userId);
  }
}
