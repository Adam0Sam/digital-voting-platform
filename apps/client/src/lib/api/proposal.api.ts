import { HttpClient } from './http-client';
import URI from '../constants/uri-constants';
import { CreateProposalDto, Proposal, UpdateProposalDto } from '@ambassador';

export class ProposalApi {
  private readonly httpClient = new HttpClient(`${URI.SERVER_URL}/proposal`);

  async createOne(data: CreateProposalDto) {
    return (await this.httpClient.post('', { proposal: data })) as Proposal;
  }

  async updateOne(id: string, data: UpdateProposalDto) {
    return (await this.httpClient.put(`${id}`, {
      proposal: data,
    })) as Proposal;
  }

  async deleteOne(id: string) {
    return await this.httpClient.delete(`${id}`);
  }

  async getAllVoterProposals() {
    return (await this.httpClient.get('voter/all')) as Omit<
      Proposal,
      'managers'
    >[];
  }

  async getAllManagerProposals() {
    return (await this.httpClient.get('manager/all')) as Proposal[];
  }
}
