import { DIRTY } from "zod";

export const VoteStatusOptions = ["PENDING", "RESOLVED", "DISABLED"] as const;
export const VoteStatus = {
  PENDING: "PENDING",
  RESOLVED: "RESOLVED",
  DISABLED: "DISABLED",
} as const;

export type VoteStatus = (typeof VoteStatusOptions)[number];
