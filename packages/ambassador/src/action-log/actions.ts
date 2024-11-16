import { z } from "zod";

export const Actions = [
  "SIGNUP",
  "SIGNIN",
  "CREATE_PROPOSAL",
  "EDIT_START_END_DATES",
  "EDIT_RESOLUTION_DATE",
  "MANUALLY_RESOLVE_PROPOSAL",
  "EDIT_TITLE",
  "EDIT_DESCRIPTION",
  "EDIT_STATUS",
  "EDIT_VISIBILITY",
  "REMOVE_CANDIDATE",
  "ADD_CANDIDATE",
  "EDIT_CHOICE_COUNT",
  "EDIT_USER_PATTERN",
] as const;

export const Action = {
  SIGNUP: "SIGNUP",
  SIGNIN: "SIGNIN",
  CREATE_PROPOSAL: "CREATE_PROPOSAL",
  EDIT_START_END_DATES: "EDIT_START_END_DATES",
  EDIT_RESOLUTION_DATE: "EDIT_RESOLUTION_DATE",
  MANUALLY_RESOLVE_PROPOSAL: "MANUALLY_RESOLVE_PROPOSAL",
  EDIT_TITLE: "EDIT_TITLE",
  EDIT_DESCRIPTION: "EDIT_DESCRIPTION",
  EDIT_STATUS: "EDIT_STATUS",
  EDIT_VISIBILITY: "EDIT_VISIBILITY",
  REMOVE_CANDIDATE: "REMOVE_CANDIDATE",
  ADD_CANDIDATE: "ADD_CANDIDATE",
  EDIT_CHOICE_COUNT: "EDIT_CHOICE_COUNT",
  EDIT_USER_PATTERN: "EDIT_USER_PATTERN",
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
  proposalId?: string;
  time: string;
};
