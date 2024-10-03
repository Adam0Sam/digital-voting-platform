import { userLoader } from '../user.loader';
import { voterProposalsLoader } from '../voter-proposals.loader';
import { managerProposalsLoader } from '../manager-proposals.loader';
import { authLoader } from '../auth.loader';
import { managerRolesLoader } from '../manager-roles.loader';
import { userDeepInfoLoader } from '../user-deep-info.loader';

export const LOADER_IDS = {
  USER: 'USER',
  VOTER_PROPOSALS: 'VOTER_PROPOSALS',
  MANAGER_PROPOSALS: 'MANAGER_PROPOSALS',
  MANAGER_ROLES: 'MANAGER_ROLES',
  AUTH: 'AUTH',
  USER_DEEP_INFO: 'USER_DEEP_INFO',
} as const;

export const LOADER_ID_MAP = {
  [LOADER_IDS.USER]: userLoader,
  [LOADER_IDS.VOTER_PROPOSALS]: voterProposalsLoader,
  [LOADER_IDS.MANAGER_PROPOSALS]: managerProposalsLoader,
  [LOADER_IDS.MANAGER_ROLES]: managerRolesLoader,
  [LOADER_IDS.AUTH]: authLoader,
  [LOADER_IDS.USER_DEEP_INFO]: userDeepInfoLoader,
} as const;

export type LoaderReturnType<
  T extends (typeof LOADER_IDS)[keyof typeof LOADER_IDS],
> = Awaited<ReturnType<(typeof LOADER_ID_MAP)[T]>>;
