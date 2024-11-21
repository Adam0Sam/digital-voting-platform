import { z } from "zod";
import { UserSchema } from "../user/user.js";
import { VoteStatusOptions } from "./vote-status.js";
import { Candidate, CandidateSchema } from "../candidate/candidate.js";

export const VoteSelectionSchema = z.object({
  voteId: z.string().uuid(),
  candidateId: z.string().uuid(),
  candidate: CandidateSchema,
  rank: z.number().optional(),
});

export const VoteSelectionShallowSchema = VoteSelectionSchema.omit({
  candidate: true,
}).extend({
  candidateId: z.string().uuid(),
});

export type VoteSelectionShallow = z.infer<typeof VoteSelectionShallowSchema>;
export type VoteSelection = z.infer<typeof VoteSelectionSchema>;

export const VoteSuggestionSchema = VoteSelectionSchema.extend({
  suggestedByManagerId: z.string().uuid(),
});

export const VoteSuggestionShallowSchema = VoteSelectionShallowSchema.extend({
  suggestedByManagerId: z.string().uuid(),
});

export type VoteSuggestionShallow = z.infer<typeof VoteSuggestionShallowSchema>;
export type VoteSuggestion = z.infer<typeof VoteSuggestionSchema>;

export const CreateVoteSuggestionsDtoSchema = VoteSuggestionSchema.omit({
  suggestedByManagerId: true,
});
export type CreateVoteSuggestionsDto = z.infer<
  typeof CreateVoteSuggestionsDtoSchema
>;

export const VoteSchema = z.object({
  id: z.string(),
  status: z.enum(VoteStatusOptions),
  userId: z.string(),
  user: UserSchema,
  proposalId: z.string(),
  voteSelections: z.array(VoteSelectionShallowSchema).min(1),
  suggestedVotes: z.array(VoteSuggestionShallowSchema).optional(),
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

export function bindCandidatesToVote<
  T extends VoteSelectionShallow | VoteSuggestionShallow,
>(
  candidates: Candidate[],
  shallowVotes: T[],
  votes: Array<VoteSelection | VoteSuggestion>
): Array<VoteSelection | VoteSuggestion> {
  for (const shallowVote of shallowVotes) {
    const candidate = candidates.find(
      (candidate) => candidate.id === shallowVote.candidateId
    );

    if (!candidate) {
      throw new Error(
        `Candidate ${shallowVote.candidateId} not found in candidates`
      );
    }

    votes.push({
      ...shallowVote,
      candidate,
    });
  }
  return votes;
}

export function pairCandidatesWithVoteSelections(
  candidates: Candidate[],
  voteSelections: VoteSelectionShallow[]
): VoteSelection[] {
  return bindCandidatesToVote(candidates, voteSelections, []);
}

export function pairCandidatesWithVoteSuggestions(
  candidates: Candidate[],
  voteSuggestions: VoteSuggestionShallow[]
): VoteSuggestion[] {
  return bindCandidatesToVote(
    candidates,
    voteSuggestions,
    []
  ) as VoteSuggestion[];
}
