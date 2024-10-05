import { z } from "zod";
import { User, UserSchema } from "../user/user.js";
import { VoteStatus, VoteStatusOptions } from "./vote-status.js";
import { Candidate, CandidateSchema } from "../candidate/candidate.js";

export const VoteSchema = z.object({
  id: z.string(),
  status: z.enum(VoteStatusOptions),
  userId: z.string(),
  user: UserSchema,
  proposalId: z.string(),
  candidates: z.array(CandidateSchema),
});

export type Vote = z.infer<typeof VoteSchema>;
