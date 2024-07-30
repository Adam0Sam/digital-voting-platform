import URI from '../constants/uri-constants';
import JWTController from './jwt-controller';
// TODO: Consider making these non-static for tree shaking support

export class APIError extends Error {
  constructor(
    public message: string,
    public status?: number,
  ) {
    super(message);
    this.status = status ?? 500;
    this.name = 'APIError';
  }
}

export class api {
  static getEndpoint(url: string) {
    if (url.startsWith('/')) {
      return `${URI.API}${url}`;
    } else {
      return `${URI.API}/${url}`;
    }
  }
  static async fetchWithAuth(
    url: string,
    options?: RequestInit,
    id_token?: string,
  ) {
    const response = await fetch(this.getEndpoint(url), {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${id_token ?? JWTController.getItem()}`,
      },
    });
    if (!response.ok) {
      throw new APIError(response.statusText, response.status);
    }
    return await response.json();
  }
  static async fetch(url: string, options?: RequestInit) {
    const response = await fetch(this.getEndpoint(url), options);
    if (!response.ok) {
      throw new APIError(response.statusText);
    }
    return await response.json();
  }
}
