import { UserActions } from '@prisma/client';
import { z } from 'zod';

export const ActionFilterDtoSchema = z.object(
  Object.fromEntries(
    Object.values(UserActions).map((action) => [action, z.boolean()]),
  ),
);

export type ActionFilterDto = Record<UserActions, boolean>;
