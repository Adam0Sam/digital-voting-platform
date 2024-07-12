interface LinkItemProps {
  title: string;
  href: string;
  description: string;
}

export const componentLinkItems: LinkItemProps[] = [
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
];

export const proposalLinkItems: LinkItemProps[] = [
  {
    title: 'Active Proposals',
    href: '/proposals/active',
    description: 'Proposals that are currently being discussed.',
  },
  {
    title: 'Past Proposals',
    href: '/proposals/past',
    description: 'Proposals that have been accepted or rejected.',
  },
  {
    title: 'Create a Proposal',
    href: '/proposals/create',
    description: 'To put forward a change or elect a representative.',
  },
];

export const allLinkItems = [componentLinkItems, proposalLinkItems];
