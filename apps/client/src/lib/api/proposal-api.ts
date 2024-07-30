import { ProposalDto } from '@/types/proposal.type';
import { api } from '../auth/auth-fetch';

export class ProposalApi {
  static async createOne(data: ProposalDto) {
    const createdProposal = await api.fetchWithAuth('/proposal/create', {
      method: 'POST',
      body: JSON.stringify({ proposal: data }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return createdProposal;
  }

  static async deleteOne(id: string) {
    return await api.fetchWithAuth(`/proposal/delete/${id}`, {
      method: 'DELETE',
    });
  }

  static async getAllRestrictedActive() {
    const proposals = await api.fetchWithAuth('/proposal/restricted/active');
    return proposals;
  }
}
