import { api } from '../api';

export async function voterProposalsLoader() {
  const data = await api.proposals.getAllVoterProposals();
  return data;
}
