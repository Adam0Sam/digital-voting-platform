export {
  userLoader,
  type ReturnType as UserLoaderResolved,
  LOADER_ID as USER_LOADER_ID,
} from './user.loader';

export {
  voterProposalsLoader,
  type ReturnType as VoterProposalsLoaderResolved,
  LOADER_ID as VOTER_PROPOSALS_LOADER_ID,
} from './voter-proposals.loader';

export {
  managerProposalsLoader,
  type ReturnType as ManagerProposalsLoaderResolved,
  LOADER_ID as MANAGER_PROPOSALS_LOADER_ID,
} from './manager-proposals.loader';

export {
  authLoader,
  type ReturnType as AuthLoaderResolved,
  LOADER_ID as AUTH_LOADER_ID,
} from './auth.loader';

export {
  managerRolesLoader,
  type ReturnType as ManagerRolesLoaderResolved,
  LOADER_ID as MANAGER_ROLES_LOADER_ID,
} from './manager-roles.loader';

export * from './admin';
