import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard';
import { ProposalService } from './proposal.service';
import { ProposalAgentRole, ProposalAgentRoles } from 'src/lib/types';
import { ParseStringLiteral, ZodValidationPipe } from 'src/pipes';
import { ProposalDto, ProposalDtoSchema } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('proposal')
export class ProposalController {
  constructor(private proposalService: ProposalService) {}

  @Get('all/:agentRole')
  getProposalsByAgentRole(
    @Req() req: any,
    @Param('agentRole', new ParseStringLiteral(ProposalAgentRoles))
    agentRole: ProposalAgentRole,
  ) {
    return this.proposalService.getProposalByAgent(req.user.id, agentRole);
  }

  @Post('create')
  createOne(
    @Body('proposal', new ZodValidationPipe(ProposalDtoSchema))
    proposal: ProposalDto,
  ) {
    return this.proposalService.createProposal(proposal);
  }
}
