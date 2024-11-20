import { z } from "zod";

export const UserRoles = ["STUDENT", "TEACHER", "PARENT", "ADMIN"] as const;

export const UserRole = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  PARENT: "PARENT",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRoles)[number];

const UserRoleSchema = z.enum(UserRoles);

export const isUserRole = (value: unknown): value is UserRole => {
  if (typeof value !== "string") {
    return false;
  }
  return UserRoleSchema.safeParse(value).success;
};

export const toUserRole = (value: string): UserRole => {
  const upperValue = value.toUpperCase();
  if (isUserRole(upperValue)) {
    return upperValue;
  }
  throw new Error(`Invalid user role: ${value}`);
};
