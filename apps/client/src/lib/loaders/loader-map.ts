import {
  authLoader,
  managerProposalsLoader,
  managerRolesLoader,
  notificationsLoader,
  unreadNotificationCountLoader,
  userDeepInfoLoader,
  userLoader,
  voterProposalsLoader,
} from './loaders';

export const LOADER_IDS = {
  USER: 'USER',
  VOTER_PROPOSALS: 'VOTER_PROPOSALS',
  MANAGER_PROPOSALS: 'MANAGER_PROPOSALS',
  MANAGER_ROLES: 'MANAGER_ROLES',
  AUTH: 'AUTH',
  USER_DEEP_INFO: 'USER_DEEP_INFO',
  UNREAD_NOTIFICATION_COUNT: 'UNREAD_NOTIFICATION_COUNT',
  NOTIFICATIONS: 'NOTIFICATIONS',
} as const;

export const LOADER_ID_MAP = {
  [LOADER_IDS.USER]: userLoader,
  [LOADER_IDS.VOTER_PROPOSALS]: voterProposalsLoader,
  [LOADER_IDS.MANAGER_PROPOSALS]: managerProposalsLoader,
  [LOADER_IDS.MANAGER_ROLES]: managerRolesLoader,
  [LOADER_IDS.AUTH]: authLoader,
  [LOADER_IDS.USER_DEEP_INFO]: userDeepInfoLoader,
  [LOADER_IDS.UNREAD_NOTIFICATION_COUNT]: unreadNotificationCountLoader,
  [LOADER_IDS.NOTIFICATIONS]: notificationsLoader,
} as const;

export type LoaderReturnType<
  T extends (typeof LOADER_IDS)[keyof typeof LOADER_IDS],
> = Awaited<ReturnType<(typeof LOADER_ID_MAP)[T]>>;
