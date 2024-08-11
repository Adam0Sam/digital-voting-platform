import { api } from '../api';
import { Proposal } from '../types';

export async function managerProposalsLoader() {
  const data = await api.proposals.getAllManagerProposals();
  return data;
}

export const LOADER_ID = 'manage';

export type ReturnType = Proposal[];
