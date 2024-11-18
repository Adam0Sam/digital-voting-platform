import { UserNotification } from '@ambassador';
import URI from '../constants/uri-constants';
import { HttpClient } from './http-client';

export class NotificationApi {
  private readonly httpClient = new HttpClient(
    `${URI.SERVER_URL}/notification`,
  );

  async getUnreadNotificationCount() {
    return (await this.httpClient.get('notification/unread/count')) as number;
  }

  async getNotifications() {
    return (await this.httpClient.get('')) as UserNotification[];
  }

  async markAsRead(id: string) {
    return await this.httpClient.put(`read/${id}`);
  }

  async markAsUnread(id: string) {
    return await this.httpClient.put(`unread/${id}`);
  }
}
