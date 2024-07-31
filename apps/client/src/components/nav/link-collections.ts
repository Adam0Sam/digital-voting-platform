import { FC } from 'react';
import { LinkItem } from './types';
import { Clipboard } from 'lucide-react';

export type LinkCollection = {
  name: string;
  description?: string;
  icon?: FC<{ className?: string }>;
  items: LinkItem[];
};

export const testLinkCollection: LinkCollection = {
  name: 'Components',
  description: 'A collection of reusable components.',
  items: [
    {
      title: 'Alert Dialog',
      href: '/docs/primitives/alert-dialog',
      description:
        'A modal dialog that interrupts the user with important content and expects a response.',
    },
    {
      title: 'Hover Card',
      href: '/docs/primitives/hover-card',
      description:
        'For sighted users to preview content available behind a link.',
    },
    {
      title: 'Progress',
      href: '/docs/primitives/progress',
      description:
        'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
    },
    {
      title: 'Scroll-area',
      href: '/docs/primitives/scroll-area',
      description: 'Visually or semantically separates content.',
    },
    {
      title: 'Tabs',
      href: '/docs/primitives/tabs',
      description:
        'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
    },
  ],
};

export const proposalLinkCollection: LinkCollection = {
  name: 'Proposals',
  description:
    'Proposals are a way to suggest changes to a project, to elect a representative and more. Here you can view, vote, comment on proposals and even create your own!.',
  icon: Clipboard,
  items: [
    {
      title: 'Vote Proposals',
      href: 'proposals/vote',
      description: 'These proposals are open for you to vote on',
    },
    {
      title: 'Managed Proposals',
      href: 'proposals/manage',
      description: 'Proposals that you have created or are managing/reviewing',
    },
    // {
    //   title: 'Manager Proposals',
    //   href: 'proposals/manager_only',
    //   description:
    //     'Proposals that are still being drafted or have been abandoned, only managers can view these proposals',
    // },
    {
      title: 'Create a Proposal',
      href: 'proposals/create',
      description: 'Create a new proposal',
    },
  ],
};
