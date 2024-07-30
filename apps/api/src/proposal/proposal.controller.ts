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

export const ProposalEndpointVisibilityMap: Record<string, ProposalVisibility> =
  {
    public: ProposalVisibility.PUBLIC,
    restricted: ProposalVisibility.RESTRICTED,
    manager_only: ProposalVisibility.MANAGER_ONLY,
  };

export const ProposalEndpointStatusMap: Record<string, ProposalStatus> = {
  draft: ProposalStatus.DRAFT,
  active: ProposalStatus.ACTIVE,
  resolved: ProposalStatus.RESOLVED,
  aborted: ProposalStatus.ABORTED,
};

@UseGuards(JwtAuthGuard)
@Controller('proposal')
export class ProposalController {
  constructor(private proposalService: ProposalService) {}

  // @Get('all')
  // getAllProposalsDemo() {
  //   return this.proposalService.getAllProposalsDemo();
  // }

  @Get(':visibility/:status/all')
  getAllSpecificProposals(
    @Req() req: any,
    @Param('visibility', new ParseObjectKeyPipe(ProposalEndpointVisibilityMap))
    visibility: ProposalVisibility,
    @Param('status', new ParseObjectKeyPipe(ProposalEndpointStatusMap))
    status: ProposalStatus,
  ) {
    console.log('Request', visibility, status);
    return this.proposalService.getAllSpecificProposals(
      req.user.id,
      visibility,
      status,
    );
  }

  @Get(':visibility/categories')
  getProposalCategories(
    @Req() req: any,
    @Param('visibility', new ParseObjectKeyPipe(ProposalEndpointVisibilityMap))
    visibility: ProposalVisibility,
  ) {
    return this.proposalService.getProposalCategories(req.user.id, visibility);
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
