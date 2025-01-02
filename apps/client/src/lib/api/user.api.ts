import { HttpClient } from './http-client';
import URI from '../constants/uri-constants';
import { User } from '@ambassador';

export class UserApi {
  private readonly httpClient = new HttpClient(`${URI.SERVER_URL}/user`);

  async getOne() {
    const user = (await this.httpClient.get('')) as User;
    return user;
  }

  async setUserEmail(email: string) {
    return await this.httpClient.put(`email`, { email });
  }

  async deactivateUserAccount() {
    return await this.httpClient.put(`deactivate`);
  }

  async getAll() {
    const allUsers = (await this.httpClient.get('all')) as User[];
    return allUsers;
  }
}
