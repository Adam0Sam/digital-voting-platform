import { USER_PROFILE_HREFS, USER_TEMPLATES_HREFS } from '@/lib/routes';
import { LinkCollection } from './link.type';

export const USER_PROFILE_LINK_COLLECTION = {
  name: 'User Profile',
  description:
    'Manage your profile settings, view your history and manage your templates',
  basePath: USER_PROFILE_HREFS.BASE,
  items: [
    {
      href: USER_PROFILE_HREFS.BASE,
      title: 'Profile',
      description: 'Manage your profile settings',
    },
    {
      href: USER_TEMPLATES_HREFS.BASE,
      title: 'Templates',
      description: 'Manage your templates',
      hasChildren: true,
    },
    {
      href: USER_PROFILE_HREFS.NOTIFICATIONS,
      title: 'Notifications',
      description: 'View your notifications',
    },
  ],
} satisfies LinkCollection;
