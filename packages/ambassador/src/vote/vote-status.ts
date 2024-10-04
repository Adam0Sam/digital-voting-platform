export const VoteStatusOptions = ["PENDING", "RESOLVED"] as const;
export const VoteStatus = {
  PENDING: "PENDING",
  RESOLVED: "RESOLVED",
} as const;

export type VoteStatus = (typeof VoteStatusOptions)[number];
