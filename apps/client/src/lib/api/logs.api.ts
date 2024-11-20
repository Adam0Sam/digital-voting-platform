import { ActionFilter, ActionLogEntry } from '@ambassador';
import URI from '../constants/uri-constants';
import { HttpClient } from './http-client';
import constructActionFilter from '../action-filter';

export class LogsApi {
  private readonly httpClient = new HttpClient(`${URI.SERVER_URL}/logs`);

  async getUserLogs(
    userId: string,
    pageSize = 50,
    page = 1,
    actionFilter: ActionFilter = constructActionFilter(),
  ) {
    return (await this.httpClient.get(
      `${userId}?pageSize=${pageSize}&page=${page}&actionFilter=${JSON.stringify(actionFilter)}`,
    )) as ActionLogEntry[];
  }

  async getUserLogsCount(
    userId: string,
    actionFilter: ActionFilter = constructActionFilter(),
  ) {
    return (await this.httpClient.get(
      `${userId}/count?actionFilter=${JSON.stringify(actionFilter)}`,
    )) as number;
  }
}
