import { ProposalDto } from '@/lib/types/proposal.type';
import { api } from '../auth/auth-fetch';
import { isProposalAgentRole, ProposalAgentRole } from '../types';

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

  static getProposalsByAgentRole(agentRole: ProposalAgentRole) {
    if (!isProposalAgentRole(agentRole)) {
      throw new Response(`Invalid agent role ${agentRole}`, { status: 400 });
    }
    return this.proposalFetch(`all/${agentRole}`);
  }
}
