import { z } from "zod";

export const ProposalVisibilityOptions = [
  "PUBLIC",
  "AGENT_ONLY",
  "MANAGER_ONLY",
] as const;
export const ProposalVisibility = {
  PUBLIC: "PUBLIC",
  AGENT_ONLY: "AGENT_ONLY",
  MANAGER_ONLY: "MANAGER_ONLY",
} as const;
export type ProposalVisibility = (typeof ProposalVisibilityOptions)[number];
const ProposalVisibilitySchema = z.enum(ProposalVisibilityOptions);
export const isProposalVisibility = (
  value: unknown
): value is ProposalVisibility => {
  return ProposalVisibilitySchema.safeParse(value).success;
};
