import {
  isProposalAgentRole,
  Proposal,
  ProposalAgentRole,
  ProposalChoice,
  ProposalDto,
} from '@/lib/types/proposal.type';
import { HttpClient } from './http-client';
import URI from '../constants/uri-constants';
import { Vote } from '../types';

export class ProposalApi {
  private readonly httpClient = new HttpClient(`${URI.SERVER_URL}/proposal`);

  async createOne(data: ProposalDto) {
    return (await this.httpClient.fetchWithAuth('create', {
      method: 'POST',
      body: JSON.stringify({ proposal: data }),
      headers: {
        'Content-Type': 'application/json',
      },
    })) as Proposal;
  }

  async deleteOne(id: string) {
    return await this.httpClient.fetchWithAuth(`delete/${id}`, {
      method: 'DELETE',
    });
  }

  async getProposalsByAgentRole(agentRole: ProposalAgentRole) {
    if (!isProposalAgentRole(agentRole)) {
      throw new Response(`Invalid agent role ${agentRole}`, { status: 400 });
    }
    return (await this.httpClient.fetchWithAuth(
      `${agentRole}/all`,
    )) as Proposal[];
  }

  async getAllManaged() {
    return (await this.httpClient.fetchWithAuth('managed/all')) as Proposal[];
  }

  async getUserVote(id: string) {
    return await this.httpClient.fetchWithAuth(`votes/${id}`);
  }

  async getAllUserVotes() {
    return (await this.httpClient.fetchWithAuth('votes/all')) as Vote[];
  }

  async castUserVote(id: string, choices: ProposalChoice[]) {
    return (await this.httpClient.fetchWithAuth(`votes/${id}`, {
      method: 'POST',
      body: JSON.stringify({ choices }),
      headers: {
        'Content-Type': 'application/json',
      },
    })) as Proposal;
  }
}
