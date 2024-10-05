import { z } from "zod";
import { ManagerRoleSchema } from "./manager-role.js";

export const ManagerSchema = z.object({
  id: z.string(),
  role: ManagerRoleSchema,
  userId: z.string(),
});

export type Manager = z.infer<typeof ManagerSchema>;
