import URI from '../constants/uri-constants';
import { User, UserDeep } from '../types';
import { UserActionLog } from '../types/log.type';
import { HttpClient } from './http-client';

export class AdminApi {
  private readonly httpClient = new HttpClient(URI.SERVER_URL);

  async getAllUsersDeep() {
    const allUsers = (await this.httpClient.get(
      'user/admin/all',
    )) as UserDeep[];
    return allUsers;
  }

  async deactivateUser(userId: string) {
    return await this.httpClient.put('user/admin/deactivate', { userId });
  }

  async getUserLogs(userId: string) {
    return (await this.httpClient.get(`user/logs/${userId}`)) as Promise<
      User & { actionLogs: UserActionLog[] }
    >;
  }
}
