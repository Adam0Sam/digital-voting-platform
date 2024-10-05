import { z } from "zod";

export const ProposalStatusOptions = [
  "DRAFT",
  "RESOLVED",
  "ABORTED",
  "ACTIVE",
] as const;
export const ProposalStatus = {
  DRAFT: "DRAFT",
  RESOLVED: "RESOLVED",
  ABORTED: "ABORTED",
  ACTIVE: "ACTIVE",
} as const;
export type ProposalStatus = (typeof ProposalStatusOptions)[number];
const ProposalStatusSchema = z.enum(ProposalStatusOptions);
export const isProposalStatus = (value: unknown): value is ProposalStatus => {
  return ProposalStatusSchema.safeParse(value).success;
};
