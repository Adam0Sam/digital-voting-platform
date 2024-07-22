import { ProposalStatus } from '@prisma/client';
import { z } from 'zod';

export const proposalSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  // TODO: Fix the type of startDate and endDate, they should be dates, but currently zod immediately evaluates the values of ISO dates, not the objects
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.nativeEnum(ProposalStatus).default(ProposalStatus.PENDING),
});
