import {
  CreateManagerRoleDto,
  ManagerRole,
  UpdateManagerRoleDto,
} from '@ambassador';
import URI from '../constants/uri-constants';
import { HttpClient } from './http-client';

export class ManagerRoleApi {
  private readonly httpClient = new HttpClient(
    `${URI.SERVER_URL}/manager-role`,
  );

  async getAuthoredRoles() {
    return this.httpClient.get('authored') as Promise<ManagerRole[]>;
  }

  async createRole(managerRole: CreateManagerRoleDto) {
    return this.httpClient.post<CreateManagerRoleDto>(
      '',
      managerRole,
    ) as Promise<Omit<ManagerRole, 'permissions'>>;
  }

  async deleteOneRole(roleId: string) {
    return this.httpClient.delete(roleId);
  }

  async deleteManyRoles(roleIds: string[]) {
    return await Promise.all(roleIds.map(roleId => this.deleteOneRole(roleId)));
  }

  async updateRole(role: UpdateManagerRoleDto) {
    return this.httpClient.put<UpdateManagerRoleDto>(role.id, role);
  }
}
