import { UserSchema } from 'src/user/schema/user.schema';
import { z } from 'zod';

export const ManagerPermissionsDtoSchema = z.object({
  canEditTitle: z.boolean(),
  canEditDescription: z.boolean(),
  canEditDates: z.boolean(),
  canEditStatus: z.boolean(),
  canEditVisibility: z.boolean(),
  canCreateVotes: z.boolean(),
  canDeleteVotes: z.boolean(),
  canEditManagers: z.boolean(),
  canEditVoteChoices: z.boolean(),
  canEditAvailableChoices: z.boolean(),
  canEditChoiceCount: z.boolean(),
  canEditUserPattern: z.boolean(),
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

export type ProposalManagerDto = z.infer<typeof ProposalManagerRoleDtoSchema>;
