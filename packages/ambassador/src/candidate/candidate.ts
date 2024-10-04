import { z } from "zod";

export const CreateCandidateDtoSchema = z.object({
  value: z.string().min(1),
  description: z.string().optional(),
});
export type CreateCandidateDto = z.infer<typeof CreateCandidateDtoSchema>;

export const CandidateSchema = CreateCandidateDtoSchema.extend({
  id: z.string(),
});
export type Candidate = z.infer<typeof CandidateSchema>;
