import { ProposalData } from '@/types/proposal.type';
import URI from '../constants/uri-constants';
import { JWTController } from './jwt-controller';
export class api {
  private static fetchWithAuth(
    url: string,
    options?: RequestInit,
    id_token?: string,
  ) {
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

  static getUser(id_token: string) {
    return this.fetchWithAuth('/user', undefined, id_token);
  }

  static getProposals() {
    return this.fetchWithAuth('/proposals');
  }

  static async createProposal(data: ProposalData) {
    return await this.fetchWithAuth('/proposal/create', {
      method: 'POST',
      body: JSON.stringify({ proposal: data }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
