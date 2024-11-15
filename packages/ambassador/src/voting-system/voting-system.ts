export const VotingSystems = [
  "FIRST_PAST_THE_POST",
  "RANKED_CHOICE",
  "ABSOLUTE_MAJORITY",
] as const;

export const VotingSystem = {
  FIRST_PAST_THE_POST: "FIRST_PAST_THE_POST",
  RANKED_CHOICE: "RANKED_CHOICE",
  ABSOLUTE_MAJORITY: "ABSOLUTE_MAJORITY",
} as const;

export type VotingSystem = (typeof VotingSystems)[number];
