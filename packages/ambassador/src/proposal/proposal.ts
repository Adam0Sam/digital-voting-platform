import { z } from "zod";
import { ProposalStatus, ProposalStatusOptions } from "./proposal-status.js";
import {
  ProposalVisibility,
  ProposalVisibilityOptions,
} from "./proposal-visibility.js";
import { UserSchema } from "../user/index.js";
import { ManagerListDtoSchema } from "../manager/manager-role.js";
import {
  CandidateSchema,
  CreateCandidateDtoSchema,
} from "../candidate/candidate.js";
import { UserPatternSchema } from "./user-pattern.js";
import { WithDatesAsStrings } from "../utils/util-types.js";
import { VoteSchema } from "../vote/vote.js";
import { ManagerSchema } from "../manager/manager.js";

export const CreateProposalDtoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.enum(ProposalStatusOptions).default(ProposalStatus.DRAFT),
  visibility: z
    .enum(ProposalVisibilityOptions)
    .default(ProposalVisibility.AGENT_ONLY),
  userPattern: UserPatternSchema,
  managers: z.array(ManagerListDtoSchema).min(1),
  voters: z.array(UserSchema),

  candidates: z.array(CreateCandidateDtoSchema).min(1),
  choiceCount: z.number().int().min(1),
});
export type CreateProposalDto = WithDatesAsStrings<
  z.infer<typeof CreateProposalDtoSchema>
>;

export const ProposalSchema = CreateProposalDtoSchema.omit({
  candidates: true,
  endDate: true,
  startDate: true,
  voters: true,
  managers: true,
}).extend({
  id: z.string(),
  candidates: z.array(CandidateSchema).min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  votes: z.array(VoteSchema),
  managers: z.array(ManagerSchema),
});
export type Proposal = WithDatesAsStrings<z.infer<typeof ProposalSchema>>;

export const UpdateProposalDtoSchema = ProposalSchema.partial();
export type UpdateProposalDto = WithDatesAsStrings<
  z.infer<typeof UpdateProposalDtoSchema>
>;
