import { ProposalDto } from '@/lib/types/proposal.type';
import { api } from '../auth/auth-fetch';

export class ProposalApi {
  private static getProposalUrl(partialUrl: string) {
    if (partialUrl.startsWith('/')) {
      return `proposal${partialUrl}`;
    } else {
      return `proposal/${partialUrl}`;
    }
  }

  /**
   * Proposals is always an auth protected route, thus the need for this abstraction
   */
  private static proposalFetch(partialUrl: string, options?: RequestInit) {
    return api.fetchWithAuth(this.getProposalUrl(partialUrl), options);
  }

  static async createOne(data: ProposalDto) {
    const createdProposal = await this.proposalFetch('create', {
      method: 'POST',
      body: JSON.stringify({ proposal: data }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return createdProposal;
  }

  static async deleteOne(id: string) {
    return await this.proposalFetch(`delete/${id}`, {
      method: 'DELETE',
    });
  }

  static getAllProposals(url: string) {
    return this.proposalFetch(`all/${url}`);
  }
  static async getVoterProposals() {
    return await this.getAllProposals('voter');
  }

  static async getOwnerProposals() {
    return await this.getAllProposals('owner');
  }

  static async getReviewerProposals() {
    return await this.getAllProposals('reviewer');
  }
}
