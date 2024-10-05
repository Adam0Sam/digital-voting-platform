import { z } from "zod";

export const Actions = [
  "AUTH_ATTEMPT",
  "SIGNUP",
  "SIGNIN",
  "CREATE_PROPOSAL",
  "EDIT_PROPOSAL",
  "DELETE_PROPOSAL",
  "VOTE",
  "EDIT_VOTE",
  "DELETE_VOTE",
] as const;

export const Action = {
  AUTH_ATTEMPT: "AUTH_ATTEMPT",
  SIGNUP: "SIGNUP",
  SIGNIN: "SIGNIN",
  CREATE_PROPOSAL: "CREATE_PROPOSAL",
  EDIT_PROPOSAL: "EDIT_PROPOSAL",
  DELETE_PROPOSAL: "DELETE_PROPOSAL",
  VOTE: "VOTE",
  EDIT_VOTE: "EDIT_VOTE",
  DELETE_VOTE: "DELETE_VOTE",
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
