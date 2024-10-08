export const VotingSystems = [
  "FIRST_PAST_THE_POST",
  "INSTANT_RUNOFF",
  "ABSOLUTE_MAJORITY",
] as const;

export const VotingSystem = {
  FIRST_PAST_THE_POST: "FIRST_PAST_THE_POST",
  INSTANT_RUNOFF: "INSTANT_RUNOFF",
  ABSOLUTE_MAJORITY: "ABSOLUTE_MAJORITY",
} as const;

export type VotingSystem = (typeof VotingSystems)[number];
