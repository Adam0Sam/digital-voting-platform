import {
  ProposalDto,
  ProposalStatus,
  ProposalVisibility,
} from '@/lib/types/proposal.type';
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

  static async getAllSpecificProposals(
    visibility: ProposalVisibility,
    status: ProposalStatus,
  ) {
    const proposals = await api.fetchWithAuth(
      `/proposal/${visibility}/${status}/all`,
    );
    return proposals;
  }

  static async getProposalCategories(visibility: ProposalVisibility) {
    const categories = await api.fetchWithAuth(
      `/proposal/${visibility}/categories`,
    );
    return categories;
  }
}
