import { StringifiedUser } from '@/lib/types';

export type TablifiedUser = Omit<StringifiedUser, 'active'> & {
  active: boolean;
};

export type TablifiedUserDeep = TablifiedUser & {
  managedProposals: number;
  votes: number;
  authoredPermissions: number;
};
