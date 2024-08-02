import { ProposalChoice } from './proposal.type';

export const VoteStatusOptions = {
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
} as const;

export type VoteStatus = keyof typeof VoteStatusOptions;

export type Vote = {
  id: string;
  status: VoteStatus;

  userId: string;
  proposalId: string;
  choices: ProposalChoice[];
};
