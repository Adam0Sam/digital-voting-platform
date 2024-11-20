import { z } from 'zod';
import { Grade } from '@prisma/client';

export const UserEmailSchema = z.string().email();

export const UserQuerySchema = z.object({
  personalNames: z.array(z.string()).nonempty(),
  familyName: z.string().nonempty(),
  grade: z.nativeEnum(Grade),
});

export type UserQueryDto = z.infer<typeof UserQuerySchema>;
