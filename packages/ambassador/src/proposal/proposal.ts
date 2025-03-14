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
import { VotingSystems } from "../voting-system/voting-system.js";

export const CreateProposalDtoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  resolutionDate: z.coerce.date().optional(),
  status: z.enum(ProposalStatusOptions).default(ProposalStatus.DRAFT),
  visibility: z
    .enum(ProposalVisibilityOptions)
    .default(ProposalVisibility.AGENT_ONLY),
  userPattern: UserPatternSchema,
  managers: z.array(ManagerListDtoSchema).min(1),
  voters: z.array(UserSchema),
  votingSystem: z.enum(VotingSystems),
  candidates: z.array(CreateCandidateDtoSchema).min(1),
  choiceCount: z.number().int().min(1),
});
export type CreateProposalDto = WithDatesAsStrings<
  z.infer<typeof CreateProposalDtoSchema>
>;

export const ProposalSchema = CreateProposalDtoSchema.omit({
  candidates: true,
  voters: true,
  managers: true,
  resolutionDate: true,
}).extend({
  id: z.string(),
  candidates: z.array(CandidateSchema).min(1),
  votes: z.array(VoteSchema),
  managers: z.array(ManagerSchema),
  resolutionDate: z.coerce.date(),
});
export type Proposal = WithDatesAsStrings<z.infer<typeof ProposalSchema>>;

export const IntrinsicProposalProps = ProposalSchema.omit({
  managers: true,
  candidates: true,
  votes: true,
  userPattern: true,
  choiceCount: true,
});

export type IntrinsicProposalProp = z.infer<typeof IntrinsicProposalProps>;

export const UpdateProposalDtoSchema = ProposalSchema.omit({
  candidates: true,
})
  .extend({
    candidates: z
      .array(
        CandidateSchema.omit({
          id: true,
        }).extend({
          id: z.string().optional(),
        })
      )
      .min(1),
  })
  .partial();
export type UpdateProposalDto = WithDatesAsStrings<
  z.infer<typeof UpdateProposalDtoSchema>
>;

export const mutableProposalKeys = [
  "title",
  "description",
  "startDate",
  "endDate",
  "resolutionDate",
  "status",
  "visibility",
  "userPattern",
  "candidates",
  "choiceCount",
] as const satisfies readonly (keyof UpdateProposalDto)[];

export type MutableProposalKey = (typeof mutableProposalKeys)[number];
export type MutableIntrinsicProposalKey = Exclude<
  MutableProposalKey,
  "userPattern" | "candidates" | "choiceCount"
>;

export function isMutableProposalKey(val: unknown): val is MutableProposalKey {
  return mutableProposalKeys.includes(val as MutableProposalKey);
}

export const intrinsicProposalProps: MutableIntrinsicProposalKey[] = [
  "title",
  "description",
  "startDate",
  "endDate",
  "status",
  "visibility",
];

export function isMutableIntrinsicProposalProp(
  val: unknown
): val is MutableIntrinsicProposalKey {
  return intrinsicProposalProps.includes(val as MutableIntrinsicProposalKey);
}
