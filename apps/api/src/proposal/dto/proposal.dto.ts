import {
  ProposalChoice,
  ProposalStatus,
  ProposalVisibility,
} from '@prisma/client';
import { UserSchema } from 'src/user/schema/user.schema';
import { z } from 'zod';

export const ProposalChoiceDtoSchema = z.object({
  value: z.string().min(1),
  description: z.string().optional(),
});

export const ManagerPermissionsDtoSchema = z.object({
  canEditTitle: z.boolean(),
  canEditDescription: z.boolean(),
  canEditDates: z.boolean(),
  canEditStatus: z.boolean(),
  canEditVisibility: z.boolean(),
  canCreateVotes: z.boolean(),
  canDeleteVotes: z.boolean(),
  canEditManagers: z.boolean(),
  canEditChoices: z.boolean(),
  canEditChoiceCount: z.boolean(),
});

export const ProposalManagerRoleSchema = z.object({
  id: z.string(),
  roleName: z.string().min(1),
  description: z.string().optional(),
  permissions: ManagerPermissionsDtoSchema,
});

export const ProposalManagerRoleDtoSchema = z.object({
  roleName: z.string().min(1),
  description: z.string().optional(),
  permissions: ManagerPermissionsDtoSchema,
});

export const ProposalManagerListDtoSchema = z.object({
  users: z.array(UserSchema).min(1),
  role: ProposalManagerRoleSchema,
});

export const CreateProposalDtoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.nativeEnum(ProposalStatus).default(ProposalStatus.DRAFT),
  visibility: z
    .nativeEnum(ProposalVisibility)
    .default(ProposalVisibility.AGENT_ONLY),

  managers: z.array(ProposalManagerListDtoSchema).min(1),
  voters: z.array(UserSchema).min(1),

  choices: z.array(ProposalChoiceDtoSchema).min(1),
  choiceCount: z.number().int().min(1),
});

export type CreateProposalDto = z.infer<typeof CreateProposalDtoSchema>;
export type UpdateProposalDto = Partial<
  Omit<CreateProposalDto, 'choices'> & {
    choices: ProposalChoice[];
  }
>;
