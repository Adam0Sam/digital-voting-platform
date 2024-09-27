export const ADMIN_PATHS = {
  BASE: 'admin',
  USERS: 'users',
  USER: 'user',
  PROPOSALS: 'proposals',
  LOGS: 'logs',
};

export const ADMIN_HREFS = {
  BASE: `/${ADMIN_PATHS.BASE}`,
  USERS: `/${ADMIN_PATHS.BASE}/${ADMIN_PATHS.USERS}`,
  PROPOSALS: `/${ADMIN_PATHS.BASE}/${ADMIN_PATHS.PROPOSALS}`,
  LOGS: (id: string) =>
    `/${ADMIN_PATHS.BASE}/${ADMIN_PATHS.USER}/${id}/${ADMIN_PATHS.LOGS}`,
};
