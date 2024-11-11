import { Candidate, VoteStatus, Vote, isVote } from '@ambassador';

export type choiceChartItem = {
  choiceValue: string;
  choiceVotes: number;
};

function accumulateCandidateVotes(
  candidates: Candidate[],
  acc: Map<string, choiceChartItem>,
) {
  for (const candidate of candidates) {
    if (!acc.has(candidate.id)) continue;
    acc.set(candidate.id, {
      ...acc.get(candidate.id)!,
      choiceVotes: acc.get(candidate.id)!.choiceVotes + 1,
    });
  }
}

export function getChoiceData(
  candidates: Candidate[],
  proposalVotes: Vote[] | Candidate[][],
) {
  const choiceChartDataMap = new Map<string, choiceChartItem>();
  let resolvedVoteCount = 0;

  for (const availableCandidate of candidates) {
    choiceChartDataMap.set(availableCandidate.id, {
      choiceValue: availableCandidate.value,
      choiceVotes: 0,
    });
  }

  for (const vote of proposalVotes) {
    if (isVote(vote)) {
      if (vote.status !== VoteStatus.RESOLVED) continue;
      accumulateCandidateVotes(vote.candidates, choiceChartDataMap);
    } else {
      accumulateCandidateVotes(vote, choiceChartDataMap);
    }
    resolvedVoteCount++;
  }

  const choiceChartData = Array.from(choiceChartDataMap.values());

  return {
    choiceChartData,
    resolvedVoteCount,
  };
}
