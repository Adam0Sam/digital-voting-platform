import { ProposalData } from '@/types/proposal.type';
import { api } from '../auth/auth-fetch';

export class proposalApi {
  static async createOne(data: ProposalData) {
    return await api.fetchWithAuth('/proposal/create', {
      method: 'POST',
      body: JSON.stringify({ proposal: data }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  static async deleteOne(id: string) {
    return await api.fetchWithAuth(`/proposal/delete/${id}`, {
      method: 'DELETE',
    });
  }
  static getAll() {
    return api.fetchWithAuth('/proposals');
  }
}
