import { GENERIC_PATHS } from './util.routes';

export const PROPOSAL_PATHS = {
  BASE: 'proposals',
  VOTE: 'vote',
  MANAGE: 'manage',
  CREATE: 'create',
  VOTES_OVERVIEW: 'votes-overview',
  CONTENT_OVERVIEW: 'content-overview',
  CHOICES_OVERVIEW: 'choices-overview',
  PATTERN_OVERVIEW: 'pattern-overview',
};

export const PROPOSAL_HREFS = {
  BASE: `/${PROPOSAL_PATHS.BASE}`,
  VOTE: `/${PROPOSAL_PATHS.BASE}/${PROPOSAL_PATHS.VOTE}`,
  VOTE_ALL: `/${PROPOSAL_PATHS.BASE}/${PROPOSAL_PATHS.VOTE}/${GENERIC_PATHS.ALL}`,
  VOTE_ONE: `/${PROPOSAL_PATHS.BASE}/${PROPOSAL_PATHS.VOTE}/${GENERIC_PATHS.ONE}`,
  MANAGE: `/${PROPOSAL_PATHS.BASE}/${PROPOSAL_PATHS.MANAGE}`,
  MANAGE_ALL: `/${PROPOSAL_PATHS.BASE}/${PROPOSAL_PATHS.MANAGE}/${GENERIC_PATHS.ALL}`,
  MANAGE_ONE: `/${PROPOSAL_PATHS.BASE}/${PROPOSAL_PATHS.MANAGE}/${GENERIC_PATHS.ONE}`,
  CREATE: `/${PROPOSAL_PATHS.BASE}/${PROPOSAL_PATHS.CREATE}`,
} as const;
