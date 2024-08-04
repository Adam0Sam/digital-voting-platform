import { FC } from 'react';
import { Clipboard } from 'lucide-react';

export type LinkItem = {
  title: string;
  href: string;
  description: string;
};

export type LinkCollection = {
  name: string;
  description?: string;
  basePath: string;
  icon?: FC<{ className?: string }>;
  items: LinkItem[];
};

export const GENERIC_PATHS = {
  ALL: 'all',
  ONE: ':id',
};

export const PROPOSAL_PATHS = {
  BASE: 'proposals',
  VOTE: 'vote',
  MANAGE: 'manage',
  CREATE: 'create',
};

export const PROPOSAL_HREFS = {
  VOTE_ALL: `${PROPOSAL_PATHS.BASE}/${PROPOSAL_PATHS.VOTE}/${GENERIC_PATHS.ALL}`,
  VOTE_ONE: `${PROPOSAL_PATHS.BASE}/${PROPOSAL_PATHS.VOTE}/${GENERIC_PATHS.ONE}`,
  MANAGE_ALL: `${PROPOSAL_PATHS.BASE}/${PROPOSAL_PATHS.MANAGE}/${GENERIC_PATHS.ALL}`,
  MANAGE_ONE: `${PROPOSAL_PATHS.BASE}/${PROPOSAL_PATHS.MANAGE}/${GENERIC_PATHS.ONE}`,
  CREATE: `${PROPOSAL_PATHS.BASE}/${PROPOSAL_PATHS.CREATE}`,
} as const;

export const proposalLinkCollection: LinkCollection = {
  name: 'Proposals',
  description:
    'Proposals are a way to suggest changes to a project, to elect a representative and more. Here you can view, vote, comment on proposals and even create your own!.',
  icon: Clipboard,
  basePath: PROPOSAL_PATHS.BASE,
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
};
