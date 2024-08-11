import { api } from '../api';
import { Proposal } from '../types/proposal.type';

export async function voterProposalsLoader() {
  const data: ReturnType = await api.proposals.getAllVoterProposals();
  return data;
}

export const LOADER_ID = 'vote';

export type ReturnType = Omit<Proposal, 'managers'>[];
