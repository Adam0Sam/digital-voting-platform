import { z } from "zod";
import { UserRoles, Grades } from "../user/index.js";

export const UserPatternSchema = z.object({
  grades: z.array(z.enum(Grades)).optional().default([]),
  roles: z.array(z.enum(UserRoles)).optional().default([]),
});

export type UserPattern = z.infer<typeof UserPatternSchema>;
