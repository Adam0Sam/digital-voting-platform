import { api } from '../api';
import { Proposal, ProposalAgentRoles } from '../types/proposal.type';

export async function voterProposalsLoader() {
  return await Promise.all([
    api.proposals.getProposalsByAgentRole(ProposalAgentRoles.VOTER),
    api.proposals.getAllUserVotes(),
  ]);
}

export const LOADER_ID = 'vote';

export type ReturnType = [Proposal[], any[]];
