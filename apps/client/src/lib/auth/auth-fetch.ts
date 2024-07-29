import URI from '../constants/uri-constants';
import JWTController from './jwt-controller';
// TODO: Consider making these non-static for tree shaking support
export class api {
  static getEndpoint(url: string) {
    if (url.startsWith('/')) {
      return `${URI.API}${url}`;
    } else {
      return `${URI.API}/${url}`;
    }
  }
  static fetchWithAuth(url: string, options?: RequestInit, id_token?: string) {
    return fetch(this.getEndpoint(url), {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${id_token ?? JWTController.getItem()}`,
      },
    });
  }
  static fetch(url: string, options?: RequestInit) {
    return fetch(this.getEndpoint(url), options);
  }
}
