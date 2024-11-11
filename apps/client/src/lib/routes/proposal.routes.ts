import { GENERIC_PATHS } from './util.routes';

export const PROPOSAL_OVERVIEW_PATHS = {
  VOTES: 'votes',
  CONTENT: 'content',
  CHOICES: 'choices',
  PATTERN: 'pattern',
  TIMELINE: 'timeline',
} as const;

export const PROPOSAL_PATHS = {
  BASE: 'proposals',
  VOTE: 'vote',
  MANAGE: 'manage',
  CREATE: 'create',
} as const;

export const PROPOSAL_HREFS = {
  BASE: `/${PROPOSAL_PATHS.BASE}`,
  VOTE: (proposalId: string) =>
    `/${PROPOSAL_PATHS.BASE}/${PROPOSAL_PATHS.VOTE}/${proposalId}`,
  VOTE_ALL: `/${PROPOSAL_PATHS.BASE}/${PROPOSAL_PATHS.VOTE}/${GENERIC_PATHS.ALL}`,
  MANAGE_ALL: `/${PROPOSAL_PATHS.BASE}/${PROPOSAL_PATHS.MANAGE}/${GENERIC_PATHS.ALL}`,
  CREATE: `/${PROPOSAL_PATHS.BASE}/${PROPOSAL_PATHS.CREATE}`,
  MANAGER_OVERVIEW: (
    overview_type: (typeof PROPOSAL_OVERVIEW_PATHS)[keyof typeof PROPOSAL_OVERVIEW_PATHS],
    proposalId: string,
  ) =>
    `/${PROPOSAL_PATHS.BASE}/${PROPOSAL_PATHS.MANAGE}/${proposalId}/${overview_type}`,
} as const;
