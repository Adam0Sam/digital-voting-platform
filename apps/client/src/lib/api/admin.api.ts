import constructActionFilter, { ActionFilter } from '../action-filter';
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

  async getUserInfo(userId: string) {
    return (await this.httpClient.get(`user/${userId}`)) as User;
  }

  async getUserLogs(
    userId: string,
    pageSize = 50,
    page = 1,
    actionFilter: ActionFilter = constructActionFilter(),
  ) {
    console.log('Getting user logs', userId, pageSize, page);
    return (await this.httpClient.get(
      `logs/${userId}?pageSize=${pageSize}&page=${page}&actionFilter=${JSON.stringify(actionFilter)}`,
    )) as UserActionLog[];
  }

  async getUserLogsCount(
    userId: string,
    actionFilter: ActionFilter = constructActionFilter(),
  ) {
    return (await this.httpClient.get(
      `logs/${userId}/count?actionFilter=${JSON.stringify(actionFilter)}`,
    )) as number;
  }
}
