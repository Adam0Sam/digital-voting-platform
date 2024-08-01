import {
  ProposalManagerRole,
  ProposalStatus,
  ProposalVisibility,
} from '@prisma/client';
import { UserSchema } from 'src/user/schema/user.schema';
import { z } from 'zod';

export const ProposalResolutionSchema = z.object({
  value: z.string().min(1),
  description: z.string().optional(),
});

export type ProposalResolution = z.infer<typeof ProposalResolutionSchema>;

export const ProposalManagerDtoSchema = z.object({
  role: z.nativeEnum(ProposalManagerRole),
  user: UserSchema,
});

export const ProposalChoiceDtoSchema = z.object({
  value: z.string().min(1),
  description: z.string().optional(),
});

export const ProposalDtoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.nativeEnum(ProposalStatus).optional().default(ProposalStatus.DRAFT),
  visibility: z
    .nativeEnum(ProposalVisibility)
    .default(ProposalVisibility.AGENT_ONLY),

  managers: z.array(ProposalManagerDtoSchema).min(1),
  voters: z.array(UserSchema).min(1),

  choices: z.array(ProposalChoiceDtoSchema).min(1),
  choiceCount: z.number().int().min(1),
});

export type ProposalDto = z.infer<typeof ProposalDtoSchema>;
