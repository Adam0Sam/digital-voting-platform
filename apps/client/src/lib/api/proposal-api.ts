import {
  ProposalDto,
  ProposalStatus,
  ProposalVisibility,
} from '@/lib/types/proposal.type';
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

  static async getAllSpecificProposals(
    visibility: ProposalVisibility,
    status: ProposalStatus,
  ) {
    const proposals = await this.proposalFetch(`${visibility}/${status}/all`);
    return proposals;
  }

  static async getProposalsByVisibility(visibility: ProposalVisibility) {
    const categories = await this.proposalFetch(`${visibility}`);
    return categories;
  }

  /**
   * Similarly as with visibility,
   * the following three methods are nearly identical
   * so is the implementation in `proposal.controller.ts` and `proposal.service.ts`
   *
   * TODO: Consider refactoring to a single method
   */
  static async getVoterProposals() {
    return await this.proposalFetch('voter/all');
  }

  static async getOwnerProposals() {
    return await this.proposalFetch('owner/all');
  }

  static async getReviewerProposals() {
    return await this.proposalFetch('reviewer/all');
  }
}
