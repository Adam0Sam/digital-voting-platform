import { api } from '../api';

export async function managerProposalsLoader() {
  const data = await api.proposals.getAllManagerProposals();
  return data;
}
