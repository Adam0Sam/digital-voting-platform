import { Candidate, VoteStatus } from '@ambassador';
import URI from '../constants/uri-constants';
import { HttpClient } from './http-client';

export class VoteApi {
  private readonly httpClient = new HttpClient(`${URI.SERVER_URL}/vote`);

  async voteForProposal(proposalId: string, candidates: Candidate[]) {
    return await this.httpClient.post(`${proposalId}`, { candidates });
  }

  async editVote(
    proposalId: string,
    voteId: string,
    candidates: Candidate[],
    status: VoteStatus,
  ) {
    return await this.httpClient.put(`${proposalId}/${voteId}`, {
      candidates,
      status,
    });
  }
}
