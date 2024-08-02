import { User } from '@/lib/types';
import { HttpClient } from './http-client';
import URI from '../constants/uri-constants';

export class UserApi {
  private readonly httpClient = new HttpClient(`${URI.SERVER_URL}/user`);

  async getOne(id_token: string) {
    const user = (await this.httpClient.fetchWithAuth(
      '',
      undefined,
      id_token,
    )) as User;
    return user;
  }

  async getAll() {
    const allUsers = (await this.httpClient.fetchWithAuth('all')) as User[];
    return allUsers;
  }
}
