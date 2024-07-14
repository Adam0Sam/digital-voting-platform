import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { Proposal } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt/guard';
import { ZodValidationPipe } from 'src/validation';
import { proposalSchema } from './schema';

@Controller('proposal')
export class ProposalController {
  constructor() {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(proposalSchema))
  @Post('create')
  createProposal(@Body('proposal') proposal: Proposal) {
    return { msg: 'proposal created', proposal };
  }
}
