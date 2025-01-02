import {
  CreateVoteSuggestionDto,
  VoteSelection,
  VoteStatus,
} from '@ambassador';
import URI from '../constants/uri-constants';
import { HttpClient } from './http-client';

export class VoteApi {
  private readonly httpClient = new HttpClient(`${URI.SERVER_URL}/vote`);

  async voteForProposal(proposalId: string, voteSelections: VoteSelection[]) {
    return await this.httpClient.post(`${proposalId}`, { voteSelections });
  }

  async suggestVote(
    proposalId: string,
    voteId: string,
    voteSuggestions: CreateVoteSuggestionDto[],
  ) {
    return await this.httpClient.put(`${proposalId}/suggestion/${voteId}`, {
      voteSuggestions,
    });
  }

  async disableUserVote(proposalId: string, voteId: string) {
    return await this.httpClient.put(`${proposalId}/disable/${voteId}`);
  }

  async mutateUserVoteStatus(
    proposalId: string,
    voteId: string,
    status: VoteStatus,
  ) {
    if (status === VoteStatus.DISABLED) {
      return await this.disableUserVote(proposalId, voteId);
    }
    return await this.enableUserVote(proposalId, voteId);
  }

  async enableUserVote(proposalId: string, voteId: string) {
    return await this.httpClient.put(`${proposalId}/enable/${voteId}`);
  }

  async getAnonVoteResults(proposalId: string) {
    return (await this.httpClient.get(
      `anon/${proposalId}`,
    )) as VoteSelection[][];
  }

  async acceptVoteSuggestion(proposalId: string) {
    return await this.httpClient.put(`${proposalId}/suggestion/accept`);
  }

  async rejectVoteSuggestion(proposalId: string) {
    return await this.httpClient.put(`${proposalId}/suggestion/reject`);
  }
}
