import { WithValuesAsStrings, User } from '@ambassador';

export type TablifiedUser = Omit<WithValuesAsStrings<User>, 'active'> & {
  active: boolean;
};

export type TablifiedUserDeep = TablifiedUser & {
  managedProposals: number;
  votes: number;
  authoredPermissions: number;
};
