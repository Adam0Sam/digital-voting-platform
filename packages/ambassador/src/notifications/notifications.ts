import { z } from "zod";
import { Candidate, CandidateSchema } from "../candidate/index.js";
import {
  IntrinsicProposalProps,
  mutableProposalKeys,
  ProposalSchema,
} from "../proposal/index.js";
import { atLeastTwo } from "../utils/index.js";

export const UserNotificationType = {
  VOTE_SUGGESTION: "VOTE_SUGGESTION",
  PROPOSAL_RESOLUTION: "PROPOSAL_RESOLUTION",
  PROPOSAL_ABORTION: "PROPOSAL_ABORTION",
  PROPOSAL_ACTIVATION: "PROPOSAL_ACTIVATION",
  PROPOSAL_UPDATE: "PROPOSAL_UPDATE",
  VOTE_DISABLED: "VOTE_DISABLED",
  VOTE_ENABLED: "VOTE_ENABLED",
} as const;

export type UserNotificationType =
  (typeof UserNotificationType)[keyof typeof UserNotificationType];

export const BaseUserNotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().optional(),
  proposalId: z.string().uuid(),
  createdAt: z.date(),
  read: z.boolean(),
  proposal: IntrinsicProposalProps,
});

export const CreateBaseUserNotificationDtoSchema =
  BaseUserNotificationSchema.omit({
    id: true,
    read: true,
    createdAt: true,
    proposal: true,
  });

const ProposalResolvedNotificationContentSchema = z.object({
  type: z.literal(UserNotificationType.PROPOSAL_RESOLUTION),
  content: z.object({
    winningCandidate: z.array(CandidateSchema),
    votesCount: z.number().int().positive(),
  }),
});

const CreateProposalResolvedNotificationContentDtoSchema = z.object({
  type: z.literal(UserNotificationType.PROPOSAL_RESOLUTION),
  content: z.null(),
});

const genericNotificationContentSchemas = [
  z.object({
    type: z.literal(UserNotificationType.VOTE_SUGGESTION),
    content: z.object({
      suggestedBy: z.string().uuid(),
      candidates: z.array(CandidateSchema),
    }),
  }),
  z.object({
    type: z.literal(UserNotificationType.PROPOSAL_ABORTION),
    content: z.object({
      reason: z.string().optional(),
    }),
  }),
  z.object({
    type: z.literal(UserNotificationType.PROPOSAL_ACTIVATION),
    content: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
  }),
  z.object({
    type: z.literal(UserNotificationType.PROPOSAL_UPDATE),
    content: z.object({
      updatedFields: z.array(z.enum(mutableProposalKeys)),
      updatedValues: z.array(z.any()),
    }),
  }),
  z.object({
    type: z.literal(UserNotificationType.VOTE_DISABLED),
    content: z.object({
      reason: z.string().optional(),
    }),
  }),
  z.object({
    type: z.literal(UserNotificationType.VOTE_ENABLED),
    content: z.null(),
  }),
];

const UserNotificationContentSchema = z.discriminatedUnion("type", [
  ...atLeastTwo([
    ...genericNotificationContentSchemas,
    ProposalResolvedNotificationContentSchema,
  ]),
]);

export const UserNotificationSchema = BaseUserNotificationSchema.extend({
  package: UserNotificationContentSchema,
});

const CreateUserNotificationContentDtoSchema = z.discriminatedUnion("type", [
  ...atLeastTwo([
    ...genericNotificationContentSchemas,
    CreateProposalResolvedNotificationContentDtoSchema,
  ]),
]);
export const CreateUserNotificationDtoSchema =
  CreateBaseUserNotificationDtoSchema.extend({
    package: CreateUserNotificationContentDtoSchema,
  });

export type UserNotification = z.infer<typeof UserNotificationSchema>;
export type CreateUserNotificationDto = z.infer<
  typeof CreateUserNotificationDtoSchema
>;
export type CreateBaseUserNotificationDto = z.infer<
  typeof CreateBaseUserNotificationDtoSchema
>;

type a = z.infer<typeof CreateBaseUserNotificationDtoSchema>;
