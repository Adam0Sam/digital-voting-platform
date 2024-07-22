import { api } from '../auth/auth-fetch';

export class userApi {
  static getOne(id_token: string) {
    return api.fetchWithAuth('/user', undefined, id_token);
  }
}
