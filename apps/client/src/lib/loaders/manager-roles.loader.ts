import { api } from '../api';
import { ProposalManagerRole } from '../types/proposal-manager.type';

export async function managerRolesLoader() {
  console.log('managerRolesLoader');
  const data = await api.managerRole.getAuthoredRoles();
  return data;
}

export const LOADER_ID = 'manager-roles';

export type ReturnType = ProposalManagerRole[];
