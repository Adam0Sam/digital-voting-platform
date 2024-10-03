import URI from '../constants/uri-constants';
import {
  ProposalManagerRole,
  ProposalManagerRoleDto,
} from '../types/proposal-manager.type';
import { HttpClient } from './http-client';

export class ManagerRoleApi {
  private readonly httpClient = new HttpClient(
    `${URI.SERVER_URL}/manager-role`,
  );

  async getAuthoredRoles() {
    return this.httpClient.get('authored') as Promise<ProposalManagerRole[]>;
  }

  async createRole(managerRole: ProposalManagerRoleDto) {
    return this.httpClient.post<ProposalManagerRoleDto>(
      '',
      managerRole,
    ) as Promise<Omit<ProposalManagerRole, 'permissions'>>;
  }

  async deleteOneRole(roleId: string) {
    return this.httpClient.delete(roleId);
  }

  async deleteManyRoles(roleIds: string[]) {
    return await Promise.all(roleIds.map(roleId => this.deleteOneRole(roleId)));
  }

  async updateRole(role: ProposalManagerRole) {
    return this.httpClient.put<ProposalManagerRoleDto>(role.id, role);
  }
}
