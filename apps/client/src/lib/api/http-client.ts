import JWTController from '../auth/jwt-controller';
import { APIError } from './error';

export class HttpClient {
  constructor(protected readonly authority: string) {}
  protected getUrl(path: string) {
    if (path.startsWith('/')) {
      return `${this.authority}${path}`;
    } else {
      return `${this.authority}/${path}`;
    }
  }

  async fetchWithAuth(path: string, options?: RequestInit, id_token?: string) {
    const response = await fetch(this.getUrl(path), {
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

  async fetch(path: string, options?: RequestInit) {
    const response = await fetch(this.getUrl(path), options);
    if (!response.ok) {
      throw new APIError(response.statusText);
    }
    return await response.json();
  }
}
