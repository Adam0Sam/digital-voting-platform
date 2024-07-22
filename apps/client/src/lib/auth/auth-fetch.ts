import URI from '../constants/uri-constants';
import { JWTController } from './jwt-controller';
export class api {
  static fetchWithAuth(url: string, options?: RequestInit, id_token?: string) {
    let endpoint: string;
    if (url.startsWith('/')) {
      endpoint = `${URI.API}${url}`;
    } else {
      endpoint = `${URI.API}/${url}`;
    }
    return fetch(endpoint, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${id_token ?? JWTController.getToken()}`,
      },
    });
  }
}
