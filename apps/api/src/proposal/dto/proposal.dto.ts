import { ProposalStatus } from '@prisma/client';
import { UserSchema } from 'src/user/schema/user.schema';
import { z } from 'zod';

export const ProposalResolutionSchema = z.object({
  value: z.string().min(1),
  description: z.string().optional(),
});

export type ProposalResolution = z.infer<typeof ProposalResolutionSchema>;

export const ProposalDtoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.nativeEnum(ProposalStatus).default(ProposalStatus.DRAFT),
  owners: z.array(UserSchema).min(1),
  reviewers: z.array(UserSchema).optional(),
  resolutionValues: z.array(ProposalResolutionSchema).min(1),
  voters: z.array(UserSchema).min(1),
});

export type ProposalDto = z.infer<typeof ProposalDtoSchema>;
