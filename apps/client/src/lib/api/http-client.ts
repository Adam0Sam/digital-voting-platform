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

  async fetch(path: string, options?: RequestInit) {
    console.log('Fetching', this.getUrl(path));
    const response = await fetch(this.getUrl(path), options);
    if (!response.ok) {
      throw new APIError(response.statusText);
    }
    return await response.json();
  }

  async fetchWithAuth(path: string, options?: RequestInit, id_token?: string) {
    return await this.fetch(path, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${id_token ?? JWTController.getItem()}`,
      },
    });
  }

  async get(path: string, options?: RequestInit) {
    return await this.fetchWithAuth(path, options);
  }

  async post<T>(path: string, data: T, options?: RequestInit) {
    return await this.fetchWithAuth(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async put<T>(path: string, data: T, options?: RequestInit) {
    return await this.fetchWithAuth(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async delete(path: string, options?: RequestInit) {
    return await this.fetchWithAuth(path, {
      ...options,
      method: 'DELETE',
    });
  }
}
