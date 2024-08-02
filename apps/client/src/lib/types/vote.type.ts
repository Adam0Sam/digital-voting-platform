import { ProposalChoiceDto } from './proposal.type';

const VoteStatuses = {
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
} as const;

export type VoteStatus = keyof typeof VoteStatuses;

export type Vote = {
  id: string;
  status: VoteStatus;

  userId: string;
  proposalId: string;
  choice: ProposalChoiceDto;
};
