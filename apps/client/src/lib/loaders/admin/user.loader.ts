import { api } from '@/lib/api';
import { UserDeep } from '@/lib/types';

export async function adminUsersLoader() {
  return await api.users.getAllDeep();
}

export const LOADER_ID = 'admin-users';
export type ReturnType = UserDeep[];
