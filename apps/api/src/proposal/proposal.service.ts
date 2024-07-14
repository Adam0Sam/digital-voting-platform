import { Injectable } from '@nestjs/common';
import { Proposal } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProposalService {
  constructor(private prisma: PrismaService) {}

  async createProposal(proposalData: Proposal) {
    return this.prisma.proposal.create({ data: proposalData });
  }
}
