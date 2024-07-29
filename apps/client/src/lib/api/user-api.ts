import { api } from '../auth/auth-fetch';

export class UserApi {
  static getOne(id_token: string) {
    return api.fetchWithAuth('/user', undefined, id_token);
  }
  static getAll() {
    return api.fetch('/user/all');
  }
}
