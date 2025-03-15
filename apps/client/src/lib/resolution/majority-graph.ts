import { Candidate, VoteSelection } from '@ambassador';
import {
  getRoundTally,
  getVoteDistribution,
  VoteDistributionItem,
} from './resolution-results';

export function getPairwiseResults(
  candidates: Candidate[],
  votes: VoteSelection[][],
) {
  const pairwiseResults = new Map<string, Map<string, number>>();

  candidates.forEach(a => {
    pairwiseResults.set(a.id, new Map<string, number>());
    candidates.forEach(b => {
      if (a.id !== b.id) pairwiseResults.get(a.id)!.set(b.id, 0);
    });
  });

  votes.forEach(vote => {
    const rankings = new Map<string, number>();
    vote.forEach(selection =>
      rankings.set(selection.candidateId, selection.rank ?? 1),
    );

    candidates.forEach(a => {
      candidates.forEach(b => {
        if (a.id === b.id) return;
        const rankA = rankings.get(a.id) ?? Infinity;
        const rankB = rankings.get(b.id) ?? Infinity;

        if (rankA < rankB) {
          pairwiseResults
            .get(a.id)!
            .set(b.id, pairwiseResults.get(a.id)!.get(b.id)! + 1);
        }
      });
    });
  });

  return pairwiseResults;
}

export function getCondorcetWinnerFromGraph(
  candidates: Candidate[],
  majorityGraph: Map<string, string[]>,
): string | null {
  for (const candidate of candidates) {
    if (majorityGraph.get(candidate.id)?.length === candidates.length - 1) {
      return candidate.id;
    }
  }
  return null;
}

export function getMajorityGraph(
  candidates: Candidate[],
  votes: VoteSelection[][],
): {
  graph: Map<string, string[]>;
  pairwiseResults: Map<string, Map<string, number>>;
} {
  const pairwiseResults = getPairwiseResults(candidates, votes);
  const graph = new Map<string, string[]>();
  const voteThreshold = votes.length / 2;

  for (const [aId, aRow] of pairwiseResults) {
    const edges: string[] = [];
    for (const [bId, count] of aRow) {
      if (count > voteThreshold) edges.push(bId);
    }
    graph.set(aId, edges);
  }

  return { graph, pairwiseResults };
}

// Optimized Smith set computation using precomputed pairwise results
export function computeSmithSet(
  candidates: Candidate[],
  pairwiseResults: Map<string, Map<string, number>>,
) {
  const candidateIds = candidates.map(c => c.id);
  const copelandScores = new Map<string, number>();

  // Calculate Copeland scores using precomputed results
  for (const aId of candidateIds) {
    let score = 0;
    for (const bId of candidateIds) {
      if (aId === bId) continue;
      const aWins = pairwiseResults.get(aId)!.get(bId)!;
      const bWins = pairwiseResults.get(bId)!.get(aId)!;
      score += aWins > bWins ? 1 : aWins === bWins ? 0.5 : 0;
    }
    copelandScores.set(aId, score);
  }

  // Sort candidates by descending Copeland score
  const sorted = [...candidates].sort(
    (a, b) => copelandScores.get(b.id)! - copelandScores.get(a.id)!,
  );

  // Find minimal dominating set using early exit
  for (let i = 1; i <= sorted.length; i++) {
    const currentSet = sorted.slice(0, i);
    const currentIds = new Set(currentSet.map(c => c.id));
    let isDominating = true;

    outer: for (const candidate of candidates) {
      if (currentIds.has(candidate.id)) continue;
      for (const member of currentSet) {
        const memberWins = pairwiseResults.get(member.id)!.get(candidate.id)!;
        const candidateWins = pairwiseResults
          .get(candidate.id)!
          .get(member.id)!;
        if (memberWins <= candidateWins) {
          isDominating = false;
          break outer;
        }
      }
    }

    if (isDominating) return currentSet;
  }

  return candidates; // Fallback (should never trigger)
}

// Updated ranked choice winner with Smith set resolution
// Updated IRV implementation
export function getRankedChoiceWinner(
  candidates: Candidate[],
  votes: VoteSelection[][],
): VoteDistributionItem | null {
  // Single computation of majority data
  const { graph, pairwiseResults } = getMajorityGraph(candidates, votes);

  // Check for Condorcet winner
  const condorcetId = getCondorcetWinnerFromGraph(candidates, graph);
  if (condorcetId) {
    const voteDist = getVoteDistribution(candidates, votes).voteDistribution;
    return (
      voteDist.find(
        item =>
          candidates.find(c => c.id === condorcetId)?.value ===
          item.optionValue,
      ) || null
    );
  }

  // Compute Smith set using precomputed results
  const smithSet = computeSmithSet(candidates, pairwiseResults);
  if (smithSet.length === 1) {
    return {
      optionValue: smithSet[0].value,
      voteCount: getVoteDistribution(candidates, votes).voteDistribution.find(
        item => item.optionValue === smithSet[0].value,
      )!.voteCount,
    };
  }

  // Optimized IRV on Smith set
  const remaining = new Set(smithSet.map(c => c.id));
  const smithCandidates = smithSet;
  let winner: VoteDistributionItem | null = null;

  while (!winner) {
    const { roundTallyMap, worstPerformingCandidate, bestPerformingCandidate } =
      getRoundTally(smithCandidates, votes, remaining);

    if (remaining.size <= 1) {
      const lastId = Array.from(remaining)[0];
      winner = {
        optionValue: smithCandidates.find(c => c.id === lastId)!.value,
        voteCount: roundTallyMap.get(lastId) || 0,
      };
      break;
    }

    const bestCount = roundTallyMap.get(bestPerformingCandidate.candidateId)!;
    if (bestCount > votes.length / 2) {
      winner = {
        optionValue: smithCandidates.find(
          c => c.id === bestPerformingCandidate.candidateId,
        )!.value,
        voteCount: bestCount,
      };
    } else {
      remaining.delete(worstPerformingCandidate.candidateId);
    }
  }

  return winner;
}
