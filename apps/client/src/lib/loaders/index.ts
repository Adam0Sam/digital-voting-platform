import { userLoader } from './user.loader';
import { voterProposalsLoader } from './voter-proposals.loader';
import { managerProposalsLoader } from './manager-proposals.loader';
import { authLoader } from './auth.loader';
import { managerRolesLoader } from './manager-roles.loader';
import { userLogsLoader } from './logs.loader';
import { useLoaderData, useRouteLoaderData } from 'react-router-dom';

export const enum LOADER_IDS {
  USER = 'USER',
  VOTER_PROPOSALS = 'VOTER_PROPOSALS',
  MANAGER_PROPOSALS = 'MANAGER_PROPOSALS',
  MANAGER_ROLES = 'MANAGER_ROLES',
  USER_LOGS = 'USER_LOGS',
  AUTH = 'AUTH',
}

export const LOADER_ID_MAP = {
  [LOADER_IDS.USER]: userLoader,
  [LOADER_IDS.VOTER_PROPOSALS]: voterProposalsLoader,
  [LOADER_IDS.MANAGER_PROPOSALS]: managerProposalsLoader,
  [LOADER_IDS.MANAGER_ROLES]: managerRolesLoader,
  [LOADER_IDS.USER_LOGS]: userLogsLoader,
  [LOADER_IDS.AUTH]: authLoader,
} as const;

type LoaderReturnType<T extends LOADER_IDS> = Awaited<
  ReturnType<(typeof LOADER_ID_MAP)[T]>
>;

export const useLoadedData = <T extends LOADER_IDS>(id: T) => {
  return useRouteLoaderData(id) as LoaderReturnType<T>;
};

export const useLoadedDataLocal = <T extends LOADER_IDS>() => {
  return useLoaderData as LoaderReturnType<T>;
};
