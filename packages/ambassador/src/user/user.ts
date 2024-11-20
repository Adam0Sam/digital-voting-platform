import { z } from "zod";
import { Grades } from "./user-grade.js";
import { UserRoles } from "./user-role.js";
import { VoteStatus } from "../vote/vote-status.js";

export const UserSchema = z.object({
  id: z.string(),
  personalNames: z.array(z.string()).min(1),
  familyName: z.string().min(1),
  grade: z.enum(Grades),
  roles: z.array(z.enum(UserRoles)).min(1),
  email: z.string().nullable(),
  active: z.boolean(),
});
export type User = z.infer<typeof UserSchema>;
export const isUser = (value: unknown): value is User => {
  return UserSchema.safeParse(value).success;
};

export const CreateUserDtoSchema = UserSchema.omit({ id: true });
export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

export type UserRelations = {
  managedProposals: { id: string }[];
  votes: { id: string; status: VoteStatus }[];
  authoredPermissions: { id: string }[];
};

export type UserWithRelations = User & UserRelations;
