import { LinkCollection } from './link.type';

export const USER_PROFILE_PATHS = {
  BASE: 'profile',
  PROFILE: '',
  HISTORY: 'history',
  TEMPLATES: 'templates',
};

export const USER_PROFILE_HREFS = {
  USER_PROFILE: `/${USER_PROFILE_PATHS.BASE}`,
  HISTORY: `/${USER_PROFILE_PATHS.BASE}/${USER_PROFILE_PATHS.HISTORY}`,
  TEMPLATES: `/${USER_PROFILE_PATHS.BASE}/${USER_PROFILE_PATHS.TEMPLATES}`,
};

export const USER_PROFILE_LINK_COLLECTION = {
  name: 'User Profile',
  description:
    'Manage your profile settings, view your history and manage your templates',
  basePath: USER_PROFILE_PATHS.BASE,
  items: [
    {
      href: USER_PROFILE_HREFS.USER_PROFILE,
      title: 'Profile',
      description: 'Manage your profile settings',
    },
    {
      href: USER_PROFILE_HREFS.HISTORY,
      title: 'History',
      description: 'View your history',
    },
    {
      href: USER_PROFILE_HREFS.TEMPLATES,
      title: 'Templates',
      description: 'Manage your templates',
    },
  ],
} satisfies LinkCollection;
