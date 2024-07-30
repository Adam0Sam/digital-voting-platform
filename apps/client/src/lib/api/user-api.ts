import { User } from '@/lib/types';
import { api } from '../auth/auth-fetch';

export class UserApi {
  static async getOne(id_token: string) {
    const user = (await api.fetchWithAuth(
      '/user',
      undefined,
      id_token,
    )) as User;
    return user;
  }
  static async getAll() {
    const allUsers = (await api.fetch('/user/all')) as User[];
    return allUsers;
  }
}
