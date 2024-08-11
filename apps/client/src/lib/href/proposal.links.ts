import { Clipboard } from 'lucide-react';
import { LinkCollection } from './link.type';
import { PROPOSAL_HREFS } from '@/lib/routes';

export const PROPOSAL_LINK_COLLECTION = {
  name: 'Proposals',
  description:
    'Proposals are a way to suggest changes to a project, to elect a representative and more. Here you can view, vote, comment on proposals and even create your own!.',
  icon: Clipboard,
  basePath: PROPOSAL_HREFS.BASE,
  items: [
    {
      href: PROPOSAL_HREFS.VOTE_ALL,
      title: 'Vote Proposals',
      description: 'These proposals are open for you to vote on',
    },
    {
      href: PROPOSAL_HREFS.MANAGE_ALL,
      title: 'Managed Proposals',
      description: 'Proposals that you have created or are managing/reviewing',
    },
    {
      href: PROPOSAL_HREFS.CREATE,
      title: 'Create a Proposal',
      description: 'Create a new proposal',
    },
  ],
} satisfies LinkCollection;
