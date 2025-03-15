import { VotingSystem, BEST_RANK, Candidate, VoteSelection } from '@ambassador';

export type VoteDistributionItem = {
  optionValue: string;
  voteCount: number;
};

export function getFPTPWinner(voteDistribution: VoteDistributionItem[]) {
  return voteDistribution.reduce((prev, current) =>
    current.voteCount > prev.voteCount ? current : prev,
  );
}

export function getAbsoluteMajorityWinner(
  voteDistribution: VoteDistributionItem[],
) {
  let totalVotes = 0;
  let bestItem: VoteDistributionItem = {
    optionValue: '',
    voteCount: -Infinity,
  };
  for (const item of voteDistribution) {
    totalVotes += item.voteCount;
    if (item.voteCount > bestItem.voteCount) {
      bestItem = item;
    }
  }

  if (bestItem.voteCount > totalVotes / 2) {
    return bestItem;
  } else {
    return null;
  }
}

export function getRankedChoiceWinner(
  candidates: Candidate[],
  votes: VoteSelection[][],
) {
  const remainingCandidates = new Set(
    candidates.map(candidate => candidate.id),
  );
  let winnerItem: VoteDistributionItem | null = null;

  while (winnerItem === null) {
    const { roundTallyMap, worstPerformingCandidate, bestPerformingCandidate } =
      getRoundTally(candidates, votes, remainingCandidates);
    console.log('roundTallyMap', roundTallyMap);
    console.log('worstPerformingCandidate', worstPerformingCandidate);
    console.log('bestPerformingCandidate', bestPerformingCandidate);
    console.log('remainingCandidates', remainingCandidates);
    if (remainingCandidates.size <= 1) {
      const lastCandidateId = Array.from(remainingCandidates)[0];
      winnerItem = {
        optionValue: candidates.find(
          candidate => candidate.id === lastCandidateId,
        )!.value,
        voteCount: roundTallyMap.get(lastCandidateId) || 0,
      };
      break;
    }

    if (
      roundTallyMap.get(bestPerformingCandidate.candidateId)! >
      votes.length / 2
    ) {
      winnerItem = {
        optionValue: candidates.find(
          candidate => candidate.id === bestPerformingCandidate.candidateId,
        )!.value,
        voteCount: roundTallyMap.get(bestPerformingCandidate.candidateId)!,
      };
    }

    remainingCandidates.delete(worstPerformingCandidate.candidateId);
  }

  return winnerItem;
}

export function getWinningCandidate(
  candidates: Candidate[],
  votes: VoteSelection[][],
  type: VotingSystem,
) {
  switch (type) {
    case VotingSystem.FIRST_PAST_THE_POST:
      return getFPTPWinner(
        getVoteDistribution(candidates, votes).voteDistribution,
      );
    case VotingSystem.ABSOLUTE_MAJORITY:
      return getAbsoluteMajorityWinner(
        getVoteDistribution(candidates, votes).voteDistribution,
      );
    case VotingSystem.RANKED_CHOICE:
      console.log('candidates', candidates);
      console.log('votes', votes);
    // return getRankedChoiceWinner(candidates, votes);
  }
}

function getCurrentFavoriteCandidates(
  voteSelections: VoteSelection[],
  availableCandidateIds: Set<string>,
) {
  let favoriteCandidates: string[] = [];
  let currentFavoriteRank = Infinity;

  for (const voteSelection of voteSelections) {
    const rank = voteSelection?.rank ?? BEST_RANK;
    if (
      rank === currentFavoriteRank &&
      availableCandidateIds.has(voteSelection.candidateId)
    ) {
      favoriteCandidates.push(voteSelection.candidateId);
    } else if (
      (voteSelection?.rank ?? BEST_RANK) < currentFavoriteRank &&
      availableCandidateIds.has(voteSelection.candidateId)
    ) {
      favoriteCandidates = [voteSelection.candidateId];
      currentFavoriteRank = rank;
    }
  }

  return favoriteCandidates;
}

export function getRoundTally(
  candidates: Candidate[],
  votes: VoteSelection[][],
  availableCandidateIds: Set<string>,
) {
  const roundTallyMap = new Map<string, number>();

  for (const candidate of candidates) {
    roundTallyMap.set(candidate.id, 0);
  }

  const worstPerformingCandidate: {
    candidateId: string;
    voteCount: number;
  } = {
    candidateId: '',
    voteCount: Infinity,
  };

  const bestPerformingCandidate: {
    candidateId: string;
    voteCount: number;
  } = {
    candidateId: '',
    voteCount: -Infinity,
  };

  for (const voteSelections of votes) {
    const favoriteCandidateIds = getCurrentFavoriteCandidates(
      voteSelections,
      availableCandidateIds,
    );

    for (const favoriteCandidateId of favoriteCandidateIds) {
      if (!roundTallyMap.has(favoriteCandidateId)) {
        throw new Error(
          `Candidate ${favoriteCandidateId} not found in tally map`,
        );
      }

      const newVoteCount = roundTallyMap.get(favoriteCandidateId)! + 1;

      if (newVoteCount < worstPerformingCandidate.voteCount) {
        worstPerformingCandidate.candidateId = favoriteCandidateId;
        worstPerformingCandidate.voteCount = newVoteCount;
      }

      if (newVoteCount > bestPerformingCandidate.voteCount) {
        bestPerformingCandidate.candidateId = favoriteCandidateId;
        bestPerformingCandidate.voteCount = newVoteCount;
      }

      roundTallyMap.set(favoriteCandidateId, newVoteCount);
    }
  }

  return {
    roundTallyMap,
    worstPerformingCandidate,
    bestPerformingCandidate,
  };
}

export function getVoteDistribution(
  candidates: Candidate[],
  votes: VoteSelection[][],
): {
  voteDistribution: VoteDistributionItem[];
  finalizedVoteCount: number;
} {
  const finalizedVoteCount = votes.reduce((acc, voteSelections) => {
    if (voteSelections.length === 0) {
      return acc;
    }
    return acc + 1;
  }, 0);

  const { roundTallyMap } = getRoundTally(
    candidates,
    votes,
    new Set(candidates.map(candidate => candidate.id)),
  );

  const voteDistribution: VoteDistributionItem[] = [];
  for (const candidate of candidates) {
    if (!roundTallyMap.has(candidate.id)) {
      throw new Error(`Candidate ${candidate.id} not found in tally map`);
    }

    voteDistribution.push({
      optionValue: candidate.value,
      voteCount: roundTallyMap.get(candidate.id)!,
    });
  }

  return {
    voteDistribution,
    finalizedVoteCount,
  };
}
