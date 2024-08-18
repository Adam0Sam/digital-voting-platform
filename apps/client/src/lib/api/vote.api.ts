import URI from '../constants/uri-constants';
import { ProposalChoice } from '../types';
import { HttpClient } from './http-client';

export class VoteApi {
  private readonly httpClient = new HttpClient(`${URI.SERVER_URL}/vote`);

  async voteForProposal(proposalId: string, choices: ProposalChoice[]) {
    return await this.httpClient.post(`${proposalId}`, { choices });
  }

  async editVote(
    proposalId: string,
    voteId: string,
    choices: ProposalChoice[],
  ) {
    return await this.httpClient.put(`${proposalId}/${voteId}`, { choices });
  }
}
