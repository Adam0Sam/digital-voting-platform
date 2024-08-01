import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard';
import { ProposalService } from './proposal.service';
import { ProposalAgentRole, ProposalAgentRoles } from 'src/lib/types';
import { ParseStringLiteral } from 'src/pipes';

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
}
