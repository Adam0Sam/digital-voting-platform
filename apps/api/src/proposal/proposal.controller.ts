import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Proposal } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt/guard';
import { ZodValidationPipe } from 'src/validation';
import { proposalSchema } from './schema';
import { ProposalService } from './proposal.service';

@Controller('proposal')
export class ProposalController {
  constructor(private proposalService: ProposalService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(proposalSchema))
  @Post('create')
  createProposal(@Body('proposal') proposal: Proposal) {
    return this.proposalService.createProposal(proposal);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  deleteProposal(@Param('id') id: string, @Req() req: any) {
    console.log('req.user', req.user);
    return this.proposalService.deleteProposal(id);
  }
}
