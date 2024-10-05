import { Proposal, Candidate, VoteStatus } from '@ambassador';

export type choiceChartItem = {
  choiceValue: string;
  choiceVotes: number;
};

export function getChoiceData(
  candidates: Candidate[],
  proposalVotes: Proposal['votes'],
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
    if (vote.status !== VoteStatus.RESOLVED) continue;
    resolvedVoteCount++;
    for (const voteCandidate of vote.candidates) {
      if (!choiceChartDataMap.has(voteCandidate.id)) continue;
      choiceChartDataMap.set(voteCandidate.id, {
        ...choiceChartDataMap.get(voteCandidate.id)!,
        choiceVotes: choiceChartDataMap.get(voteCandidate.id)!.choiceVotes + 1,
      });
    }
  }

  const choiceChartData = Array.from(choiceChartDataMap.values());

  return {
    choiceChartData,
    resolvedVoteCount,
  };
}
