import { ProposalStatus } from '@prisma/client';
import { UserSchema } from 'src/user/schema/user.schema';
import { z } from 'zod';

export const ProposalDtoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.nativeEnum(ProposalStatus).default(ProposalStatus.PENDING),
  owners: z.array(UserSchema).min(1),
  reviewers: z.array(UserSchema).optional(),
});

export type ProposalDto = z.infer<typeof ProposalDtoSchema>;
