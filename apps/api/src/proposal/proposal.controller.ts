import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/guard';
import { ParseObjectKeyPipe, ZodValidationPipe } from 'src/pipes';
import { ProposalService } from './proposal.service';
import { ProposalDto, ProposalDtoSchema } from './dto';
import { ProposalStatus, ProposalVisibility } from '@prisma/client';

export const proposalVisibilityValueMap: Record<string, ProposalVisibility> = {
  public: ProposalVisibility.PUBLIC,
  restricted: ProposalVisibility.RESTRICTED,
  manager_only: ProposalVisibility.MANAGER_ONLY,
};

export const proposalStatusValueMap: Record<string, ProposalStatus> = {
  draft: ProposalStatus.DRAFT,
  active: ProposalStatus.ACTIVE,
  resolved: ProposalStatus.RESOLVED,
  aborted: ProposalStatus.ABORTED,
};

@UseGuards(JwtAuthGuard)
@Controller('proposal')
export class ProposalController {
  constructor(private proposalService: ProposalService) {}

  @Get('all')
  getAllProposalsDemo() {
    return this.proposalService.getAllProposalsDemo();
  }

  @Get('voter/all')
  getVoterProposals(@Req() req: any) {
    return this.proposalService.getVoterProposals(req.user.id);
  }

  @Get('owner/all')
  getManagedProposals(@Req() req: any) {
    return this.proposalService.getOwnerProposals(req.user.id);
  }

  @Get('reviewer/all')
  getReviewProposals(@Req() req: any) {
    return this.proposalService.getReviewerProposals(req.user.id);
  }

  @Get(':visibility')
  getProposalsByVisibility(
    @Req() req: any,
    @Param('visibility', new ParseObjectKeyPipe(proposalVisibilityValueMap))
    visibility: ProposalVisibility,
  ) {
    console.log('Request', visibility);
    console.log('User', req.user);
    return this.proposalService.getProposalsByVisibility(
      req.user.id,
      visibility,
    );
  }

  @Get(':visibility/:status/all')
  getAllSpecificProposals(
    @Req() req: any,
    @Param('visibility', new ParseObjectKeyPipe(proposalVisibilityValueMap))
    visibility: ProposalVisibility,
    @Param('status', new ParseObjectKeyPipe(proposalStatusValueMap))
    status: ProposalStatus,
  ) {
    console.log('Request', visibility, status);
    return this.proposalService.getAllSpecificProposals(
      req.user.id,
      visibility,
      status,
    );
  }

  @UsePipes(new ZodValidationPipe(ProposalDtoSchema))
  @Post('create')
  createProposal(@Body('proposal') proposal: ProposalDto) {
    return this.proposalService.createProposal(proposal);
  }

  @Delete('delete/:id')
  deleteProposal(@Param('id') id: string) {
    return this.proposalService.deleteProposal(id);
  }
}
