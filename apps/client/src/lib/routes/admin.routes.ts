export const ADMIN_PATHS = {
  BASE: 'admin',
  USERS: 'users',
  USER: 'user',
  PROPOSALS: 'proposals',
  LOGS: 'logs',
  manage: 'manage',
};

export const ADMIN_HREFS = {
  BASE: `/${ADMIN_PATHS.BASE}`,
  USERS: `/${ADMIN_PATHS.BASE}/${ADMIN_PATHS.USERS}`,
  PROPOSALS: `/${ADMIN_PATHS.BASE}/${ADMIN_PATHS.PROPOSALS}`,
  LOGS: (id: string) =>
    `/${ADMIN_PATHS.BASE}/${ADMIN_PATHS.USER}/${id}/${ADMIN_PATHS.LOGS}`,
  MANAGE: (id: string) =>
    `/${ADMIN_PATHS.BASE}/${ADMIN_PATHS.USER}/${id}/${ADMIN_PATHS.manage}`,
};

export function getUserQueryId(url: URL) {
  const pathname = url.pathname.split('/');
  return pathname[pathname.length - 2];
}
