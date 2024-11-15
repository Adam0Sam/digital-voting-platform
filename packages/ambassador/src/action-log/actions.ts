import { z } from "zod";

export const Actions = [
  "AUTH_ATTEMPT",
  "SIGNUP",
  "SIGNIN",
  "CREATE_PROPOSAL",
  "EDIT_START_END_DATES",
  "EDIT_RESOLUTION_DATE",
  "MANUALLY_RESOLVE_PROPOSAL",
] as const;

export const Action = {
  AUTH_ATTEMPT: "AUTH_ATTEMPT",
  SIGNUP: "SIGNUP",
  SIGNIN: "SIGNIN",
  CREATE_PROPOSAL: "CREATE_PROPOSAL",
  EDIT_START_END_DATES: "EDIT_START_END_DATES",
  EDIT_RESOLUTION_DATE: "EDIT_RESOLUTION_DATE",
  MANUALLY_RESOLVE_PROPOSAL: "MANUALLY_RESOLVE_PROPOSAL",
} as const;

export type Action = (typeof Actions)[number];

export const ActionFilterSchema = z.object(
  Object.fromEntries(Actions.map((action) => [action, z.boolean()]))
);

export type ActionFilter = Record<Action, boolean>;

export type ActionLogEntry = {
  id: string;
  action: Action;
  userAgent?: string;
  message?: string;
  userId: string;
  time: string;
};
