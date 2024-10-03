import { api } from '../api';

export async function userDeepInfoLoader() {
  return api.admin.getAllUsersDeep();
}
