import { User } from '@/lib/types';
import { HttpClient } from './http-client';
import URI from '../constants/uri-constants';

export class UserApi {
  private readonly httpClient = new HttpClient(`${URI.SERVER_URL}/user`);

  async getOne(id_token: string) {
    const user = (await this.httpClient.get('', { id_token })) as User;
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
