import { z } from 'zod';

export const ManagerRoleDtoSchema = z.object({
  roleName: z.string().min(1),
  description: z.string().optional(),
  permissions: z.object({
    canEditTitle: z.boolean(),
    canEditDescription: z.boolean(),
    canEditDates: z.boolean(),
    canEditStatus: z.boolean(),
    canEditVisibility: z.boolean(),
    canEditVotes: z.boolean(),
    canEditManagers: z.boolean(),
    canEditChoices: z.boolean(),
    canEditChoiceCount: z.boolean(),
  }),
});

export type ManagerRoleDto = z.infer<typeof ManagerRoleDtoSchema>;
