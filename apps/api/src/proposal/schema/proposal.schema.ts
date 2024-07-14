import { ProposalStatus } from '@prisma/client';
import { z } from 'zod';

export const proposalSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.nativeEnum(ProposalStatus).default(ProposalStatus.PENDING),
});
