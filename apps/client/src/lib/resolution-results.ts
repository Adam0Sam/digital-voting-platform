import { Candidate, VoteStatus, Vote, isVote } from '@ambassador';
import { VotingSystem } from '@ambassador/voting-system';

export type VoteDistributionItem = {
  optionValue: string;
  voteCount: number;
};

function updateVoteCounts(
  candidates: Candidate[],
  tallyMap: Map<string, VoteDistributionItem>,
) {
  for (const candidate of candidates) {
    if (!tallyMap.has(candidate.id)) continue;
    tallyMap.set(candidate.id, {
      ...tallyMap.get(candidate.id)!,
      voteCount: tallyMap.get(candidate.id)!.voteCount + 1,
    });
  }
}

export function calculateWinningCandidate(
  voteDistribution: VoteDistributionItem[],
  votingSystem: VotingSystem,
) {
  function firstPastThePost() {
    return voteDistribution.reduce((prev, current) =>
      current.voteCount > prev.voteCount ? current : prev,
    );
  }

  function absoluteMajority() {
    const totalVotes = voteDistribution.reduce(
      (acc, curr) => acc + curr.voteCount,
      0,
    );
    const majority = totalVotes / 2;
    return voteDistribution.find(candidate => candidate.voteCount > majority);
  }

  switch (votingSystem) {
    case VotingSystem.FIRST_PAST_THE_POST:
      return firstPastThePost();
    case VotingSystem.ABSOLUTE_MAJORITY:
      return absoluteMajority();
    case VotingSystem.RANKED_CHOICE:
      throw new Error('Ranked choice voting not supported');
  }
}

export function calculateVoteDistribution(
  candidates: Candidate[],
  votes: Vote[] | Candidate[][],
) {
  const voteTallyMap = new Map<string, VoteDistributionItem>();
  let finalizedVoteCount = 0;
  for (const candidate of candidates) {
    voteTallyMap.set(candidate.id, {
      optionValue: candidate.value,
      voteCount: 0,
    });
  }

  for (const vote of votes) {
    if (isVote(vote)) {
      if (vote.status !== VoteStatus.RESOLVED) continue;
      updateVoteCounts(vote.candidates, voteTallyMap);
    } else {
      updateVoteCounts(vote, voteTallyMap);
    }
    finalizedVoteCount++;
  }

  const voteDistribution = Array.from(voteTallyMap.values());

  return {
    voteDistribution,
    finalizedVoteCount,
  };
}
