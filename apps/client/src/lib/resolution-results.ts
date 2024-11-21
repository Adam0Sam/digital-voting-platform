import {
  BEST_RANK,
  Candidate,
  VoteSelection,
  VoteSelectionShallow,
} from '@ambassador';
import { VotingSystem } from '@ambassador/voting-system';

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
  const totalVotes = voteDistribution.reduce(
    (acc, curr) => acc + curr.voteCount,
    0,
  );
  const majority = totalVotes / 2;
  return voteDistribution.find(candidate => candidate.voteCount > majority);
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

    if (
      roundTallyMap.get(bestPerformingCandidate.candidateId)!.voteCount >
      votes.length / 2
    ) {
      winnerItem = {
        optionValue: candidates.find(
          candidate => candidate.id === bestPerformingCandidate.candidateId,
        )!.value,
        voteCount: roundTallyMap.get(bestPerformingCandidate.candidateId)!
          .voteCount,
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
      return getRankedChoiceWinner(candidates, votes);
  }
}

function getCurrentFavoriteCandidates(
  voteSelections: VoteSelection[],
  availableCandidateIds: Set<string>,
) {
  let favoriteCandidates: Candidate[] = [];
  let currentFavoriteRank = Infinity;

  for (const voteSelection of voteSelections) {
    const rank = voteSelection?.rank ?? BEST_RANK;
    if (
      rank === currentFavoriteRank &&
      availableCandidateIds.has(voteSelection.candidate.id)
    ) {
      favoriteCandidates.push(voteSelection.candidate);
    } else if (
      (voteSelection?.rank ?? BEST_RANK) < currentFavoriteRank &&
      availableCandidateIds.has(voteSelection.candidate.id)
    ) {
      favoriteCandidates = [voteSelection.candidate];
      currentFavoriteRank = rank;
    }
  }

  return favoriteCandidates;
}

function getRoundTally(
  candidates: Candidate[],
  votes: VoteSelection[][],
  availableCandidateIds: Set<string>,
) {
  const roundTallyMap = new Map<string, VoteDistributionItem>();

  for (const candidate of candidates) {
    roundTallyMap.set(candidate.id, {
      optionValue: candidate.value,
      voteCount: 0,
    });
  }

  const worstPerformingCandidate: {
    candidateId: string;
    voteCount: number;
  } = {
    candidateId: candidates[0].id,
    voteCount: Infinity,
  };

  const bestPerformingCandidate: {
    candidateId: string;
    voteCount: number;
  } = {
    candidateId: candidates[0].id,
    voteCount: -Infinity,
  };

  for (const voteSelections of votes) {
    const favoriteCandidates = getCurrentFavoriteCandidates(
      voteSelections,
      availableCandidateIds,
    );
    for (const favoriteCandidate of favoriteCandidates) {
      if (!roundTallyMap.has(favoriteCandidate.id)) {
        throw new Error(
          `Candidate ${favoriteCandidate.id} not found in tally map`,
        );
      }

      const newVoteCount =
        roundTallyMap.get(favoriteCandidate.id)!.voteCount + 1;

      if (newVoteCount < worstPerformingCandidate.voteCount) {
        worstPerformingCandidate.candidateId = favoriteCandidate.id;
        worstPerformingCandidate.voteCount = newVoteCount;
      }

      if (newVoteCount > bestPerformingCandidate.voteCount) {
        bestPerformingCandidate.candidateId = favoriteCandidate.id;
        bestPerformingCandidate.voteCount = newVoteCount;
      }

      roundTallyMap.set(favoriteCandidate.id, {
        optionValue: roundTallyMap.get(favoriteCandidate.id)!.optionValue,
        voteCount: newVoteCount,
      });
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

  return {
    voteDistribution: Array.from(roundTallyMap.values()),
    finalizedVoteCount,
  };
}
