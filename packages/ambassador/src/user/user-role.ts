import { z } from "zod";

export const UserRoles = [
  "STUDENT",
  "TEACHER",
  "PARENT",
  "ADMIN",
  "SUPER_ADMIN",
  "GUEST",
] as const;

export const UserRole = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  PARENT: "PARENT",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  GUEST: "GUEST",
} as const;

export type UserRole = (typeof UserRoles)[number];

const UserRoleSchema = z.enum(UserRoles);

export const isUserRole = (value: unknown): value is UserRole => {
  return UserRoleSchema.safeParse(value).success;
};

export const toUserRole = (value: string): UserRole => {
  if (isUserRole(value)) {
    return value;
  }
  throw new Error(`Invalid user role: ${value}`);
};
