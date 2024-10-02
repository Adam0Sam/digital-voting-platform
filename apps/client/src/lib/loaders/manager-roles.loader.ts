import { api } from '../api';

export async function managerRolesLoader() {
  const data = await api.managerRole.getAuthoredRoles();
  return data;
}
