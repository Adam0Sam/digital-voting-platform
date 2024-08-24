import { StringifiedUser } from '@/lib/types';

export type TablifiedUser = Omit<StringifiedUser, 'active'> & {
  active: boolean;
};
