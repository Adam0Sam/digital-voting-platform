import { z } from "zod";
import { ManagerPermissionsSchema } from "./manager-permissions.js";
import { UserSchema } from "../user/user.js";

export const CreateManagerRoleDtoSchema = z.object({
  roleName: z.string().min(1),
  description: z.string().optional(),
  permissions: ManagerPermissionsSchema,
});

export type CreateManagerRoleDto = z.infer<typeof CreateManagerRoleDtoSchema>;

export const UpdateManagerRoleDtoSchema =
  CreateManagerRoleDtoSchema.partial().extend({
    id: z.string(),
  });

export type UpdateManagerRoleDto = z.infer<typeof UpdateManagerRoleDtoSchema>;

export const ManagerRoleSchema = CreateManagerRoleDtoSchema.extend({
  id: z.string(),
});

export type ManagerRole = z.infer<typeof ManagerRoleSchema>;

export const ManagerListDtoSchema = z.object({
  users: z.array(UserSchema).min(1),
  role: ManagerRoleSchema,
});

export type ManagerListDto = z.infer<typeof ManagerListDtoSchema>;
