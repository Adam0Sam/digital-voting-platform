import { Proposal, VoteStatusOptions } from '../types';

export type choiceChartItem = {
  choiceValue: string;
  choiceVotes: number;
};

export function getChoiceData(proposalData: Proposal) {
  const choiceChartDataMap = new Map<string, choiceChartItem>();
  let resolvedVoteCount = 0;

  for (const availableChoice of proposalData.choices) {
    choiceChartDataMap.set(availableChoice.id, {
      choiceValue: availableChoice.value,
      choiceVotes: 0,
    });
  }

  for (const vote of proposalData.votes) {
    if (vote.status !== VoteStatusOptions.RESOLVED) continue;
    resolvedVoteCount++;
    for (const voteChoice of vote.choices) {
      if (!choiceChartDataMap.has(voteChoice.id)) continue;
      choiceChartDataMap.set(voteChoice.id, {
        ...choiceChartDataMap.get(voteChoice.id)!,
        choiceVotes: choiceChartDataMap.get(voteChoice.id)!.choiceVotes + 1,
      });
    }
  }

  const choiceChartData = Array.from(choiceChartDataMap.values());

  return {
    choiceChartData,
    resolvedVoteCount,
  };
}
