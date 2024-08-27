export const ADMIN_PATHS = {
  BASE: 'admin',
  USERS: 'users',
  PROPOSALS: 'proposals',
};

export const ADMIN_HREFS = {
  BASE: `/${ADMIN_PATHS.BASE}`,
  USERS: `/${ADMIN_PATHS.BASE}/${ADMIN_PATHS.USERS}`,
  PROPOSALS: `/${ADMIN_PATHS.BASE}/${ADMIN_PATHS.PROPOSALS}`,
};
