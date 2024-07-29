import { Grade } from '@prisma/client';
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  personalNames: z.array(z.string()).min(1),
  familyName: z.string().min(1),
  grade: z.nativeEnum(Grade),
  roles: z.array(z.string()).min(1),
});

export { UserSchema };
