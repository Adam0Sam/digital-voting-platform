import {
  ProposalChoice,
  ProposalStatus,
  ProposalVisibility,
} from '@prisma/client';
import { ProposalManagerListDtoSchema } from 'src/manager-role/dto/manager-role.dto';
import { UserSchema } from 'src/user/schema/user.schema';
import { z } from 'zod';

export const ProposalChoiceDtoSchema = z.object({
  value: z.string().min(1),
  description: z.string().optional(),
});

export const ProposalChoicesDtoSchema = z.array(ProposalChoiceDtoSchema).min(1);

export const ProposalChoiceSchema = ProposalChoiceDtoSchema.extend({
  id: z.string(),
});

export const ProposalChoicesSchema = ProposalChoiceSchema.array().min(1);

export const CreateProposalDtoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.nativeEnum(ProposalStatus).default(ProposalStatus.DRAFT),
  visibility: z
    .nativeEnum(ProposalVisibility)
    .default(ProposalVisibility.AGENT_ONLY),

  managers: z.array(ProposalManagerListDtoSchema).min(1),
  voters: z.array(UserSchema).min(1),

  choices: ProposalChoicesDtoSchema,
  choiceCount: z.number().int().min(1),
});

export type CreateProposalDto = z.infer<typeof CreateProposalDtoSchema>;
export type UpdateProposalDto = Partial<
  Omit<CreateProposalDto, 'choices'> & {
    choices: (Omit<ProposalChoice, 'id'> & {
      id?: ProposalChoice['id'] | undefined;
    })[];
  } & { id: string }
>;
