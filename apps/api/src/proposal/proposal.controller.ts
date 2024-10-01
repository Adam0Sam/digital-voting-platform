import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Req,
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

import { User, UserActions } from '@prisma/client';
import { GetUser } from 'src/user/decorator';
import { LoggerService } from 'src/logger/logger.service';

@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard)
@Controller('proposal')
export class ProposalController {
  constructor(
    private proposalService: ProposalService,
    private logger: LoggerService,
  ) {}

  @Post('')
  createOne(
    @Body('proposal', new ZodValidationPipe(CreateProposalDtoSchema))
    proposal: CreateProposalDto,
    @Headers('user-agent')
    userAgent: string,
    @Req() req,
    @GetUser('id')
    userId: User['id'],
  ) {
    this.logger.logAction(UserActions.CREATE_PROPOSAL, {
      userId,
      userAgent,
    });
    return this.proposalService.createOne(proposal);
  }

  @Put(':id')
  async updateOne(
    @Param('id') proposalId: string,
    @Headers('user-agent') userAgent: string,
    @Body('proposal')
    proposalDto: UpdateProposalDto,
    @GetUser('id') userId: User['id'],
  ) {
    this.logger.logAction(UserActions.EDIT_PROPOSAL, {
      userId,
      userAgent,
      message: JSON.stringify(proposalDto),
    });
    return this.proposalService.updateOne(proposalId, proposalDto, userId);
  }

  @Delete(':id')
  async deleteOne(
    @Param('id') proposalId: string,
    @Headers('user-agent') userAgent: string,
    @GetUser('id') userId: User['id'],
  ) {
    this.logger.logAction(UserActions.DELETE_PROPOSAL, {
      userId,
      userAgent,
    });
    return 'deleted';
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
