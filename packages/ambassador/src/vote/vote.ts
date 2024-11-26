import { z } from "zod";
import { UserSchema } from "../user/user.js";
import { VoteStatusOptions } from "./vote-status.js";

export const VoteSelectionSchema = z.object({
  voteId: z.string().uuid(),
  candidateId: z.string().uuid(),
  rank: z.number().optional(),
});

export type VoteSelection = z.infer<typeof VoteSelectionSchema>;

export const VoteSuggestionSchema = VoteSelectionSchema.extend({
  suggestedByManagerId: z.string().uuid(),
});

export type VoteSuggestion = z.infer<typeof VoteSuggestionSchema>;

export const CreateVoteSuggestionDtoSchema = VoteSuggestionSchema.omit({
  suggestedByManagerId: true,
});

export type CreateVoteSuggestionDto = z.infer<
  typeof CreateVoteSuggestionDtoSchema
>;

export const VoteSchema = z.object({
  id: z.string(),
  status: z.enum(VoteStatusOptions),
  userId: z.string(),
  user: UserSchema,
  proposalId: z.string(),
  voteSelections: z.array(VoteSelectionSchema).min(1),
  suggestedVotes: z.array(VoteSuggestionSchema).optional(),
});

export const BindedVoteSchema = VoteSchema.omit({
  voteSelections: true,
  suggestedVotes: true,
}).extend({
  voteSelections: z.array(VoteSelectionSchema).min(1),
  suggestedVotes: z.array(VoteSuggestionSchema).optional(),
});

export type BindedVote = z.infer<typeof BindedVoteSchema>;

export function isVoteSelection(v: unknown): v is VoteSelection {
  return VoteSchema.safeParse(v).success;
}

export type Vote = z.infer<typeof VoteSchema>;

export const BEST_RANK = 1;
