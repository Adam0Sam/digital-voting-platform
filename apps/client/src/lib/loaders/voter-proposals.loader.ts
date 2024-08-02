import { json } from 'react-router-dom';
import { api } from '../api';
import { Vote } from '../types';
import { Proposal, ProposalAgentRoles } from '../types/proposal.type';

export async function voterProposalsLoader() {
  const data = await Promise.all([
    api.proposals.getProposalsByAgentRole(ProposalAgentRoles.VOTER),
    api.proposals.getAllUserVotes(),
  ]);

  return json(data, {
    status: 2000,
  });
}

export const LOADER_ID = 'vote';

export type ReturnType = [Proposal[], Vote[]];
