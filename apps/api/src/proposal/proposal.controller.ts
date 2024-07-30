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
import { ZodValidationPipe } from 'src/validation';
import { ProposalService } from './proposal.service';
import { ProposalDto, ProposalDtoSchema } from './dto';

@Controller('proposal')
export class ProposalController {
  constructor(private proposalService: ProposalService) {}

  @Get('all')
  getAllProposals() {
    return this.proposalService.getAllProposals();
  }

  @UseGuards(JwtAuthGuard)
  @Get('restricted/active')
  getAllRestrictedActiveProposals(@Req() req: any) {
    return this.proposalService.getAllRestrictedProposals(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(ProposalDtoSchema))
  @Post('create')
  createProposal(@Body('proposal') proposal: ProposalDto) {
    return this.proposalService.createProposal(proposal);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  deleteProposal(@Param('id') id: string) {
    return this.proposalService.deleteProposal(id);
  }
}
