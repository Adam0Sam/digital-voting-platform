import { ProposalChoice } from './proposal.type';
import { User } from './user.type';

export const VoteStatusOptions = {
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
} as const;

export type VoteStatus = keyof typeof VoteStatusOptions;

export type Vote = {
  id: string;
  status: VoteStatus;
  userId: string;
  user: User;
  proposalId: string;
  choices: ProposalChoice[];
};
