import { Candidate, VoteSelection } from '@ambassador';

/**
 * Determines the winning candidate using the Smith set algorithm
 *
 * @param candidates - Array of candidate objects
 * @param allVoteSelections - Array of arrays where each inner array contains the vote selections for one user
 * @returns The winning candidate or null if no winner can be determined
 */
function determineWinner(
  candidates: Candidate[],
  allVoteSelections: VoteSelection[][],
): Candidate | null {
  // Convert vote selections to the format required by computeSmithSet
  const votes = convertVoteSelectionsToRankings(allVoteSelections);

  // Compute the Smith set
  const smithSet = computeSmithSet(candidates, votes);

  // If the Smith set has only one candidate, that's our winner
  if (smithSet.length === 1) {
    return smithSet[0];
  }

  // If multiple candidates are in the Smith set, we need a tiebreaker
  // Here we use a simple tiebreaker: candidate with the highest average rank
  return tiebreaker(smithSet, allVoteSelections);
}

/**
 * Converts the VoteSelection arrays to rankings required by the Smith set algorithm
 *
 * @param allVoteSelections - Array of arrays where each inner array contains the vote selections for one user
 * @returns Array of votes, where each vote is an ordered array of candidate IDs
 */
function convertVoteSelectionsToRankings(
  allVoteSelections: VoteSelection[][],
): string[][] {
  return allVoteSelections.map(userVoteSelections => {
    // Directly use all selections since they're guaranteed to have same voteId
    const sortedSelections = [...userVoteSelections].sort((a, b) => {
      if (a.rank === undefined || b.rank === undefined) {
        throw new Error('Rank is undefined');
      }
      return a.rank - b.rank;
    });

    return sortedSelections.map(selection => selection.candidateId);
  });
}

/**
 * Simple tiebreaker for when multiple candidates are in the Smith set
 * Uses average rank across all votes
 *
 * @param smithSet - Array of candidates in the Smith set
 * @param allVoteSelections - Array of all vote selections
 * @returns The candidate with the best average rank
 */
function tiebreaker(
  smithSet: Candidate[],
  allVoteSelections: VoteSelection[][],
): Candidate | null {
  if (smithSet.length === 0) return null;

  // Calculate average rank for each candidate in the Smith set
  const avgRanks = new Map<string, { total: number; count: number }>();

  // Initialize
  smithSet.forEach(candidate => {
    avgRanks.set(candidate.id, { total: 0, count: 0 });
  });

  // Sum up all ranks
  allVoteSelections.forEach(userVoteSelections => {
    userVoteSelections.forEach(selection => {
      if (
        selection.rank !== undefined &&
        smithSet.some(c => c.id === selection.candidateId)
      ) {
        const stats = avgRanks.get(selection.candidateId);
        if (stats) {
          stats.total += selection.rank;
          stats.count += 1;
        }
      }
    });
  });

  // Find candidate with lowest average rank (best)
  let bestCandidate: Candidate | null = null;
  let bestAvg = Infinity;

  smithSet.forEach(candidate => {
    const stats = avgRanks.get(candidate.id);
    if (stats && stats.count > 0) {
      const avg = stats.total / stats.count;
      if (avg < bestAvg) {
        bestAvg = avg;
        bestCandidate = candidate;
      }
    }
  });

  return bestCandidate;
}

/**
 * Computes the Smith set using Kosaraju's algorithm for finding SCCs.
 * The Smith set is the top tier of strongly connected components in the majority graph.
 *
 * @param candidates - Array of candidate objects with unique IDs
 * @param votes - Array of votes, where each vote is an ordered array of candidate IDs
 * @returns Array of candidates in the Smith set
 */
function computeSmithSet(
  candidates: Candidate[],
  votes: string[][],
): Candidate[] {
  // Build the majority graph and its transpose
  const { adj, transposeAdj } = buildMajorityGraphAndTranspose(
    candidates,
    votes,
  );

  // Find the SCCs using Kosaraju's algorithm
  const components = kosaraju(adj, transposeAdj, candidates);

  // The Smith set is the first SCC in the list (top SCC)
  const smithSetIds = components[0];

  // Return the candidates in the Smith set
  return candidates.filter(c => smithSetIds.includes(c.id));
}

/**
 * Builds the majority graph and its transpose from candidates and votes.
 *
 * @param candidates - Array of candidate objects
 * @param votes - Array of votes, where each vote is an ordered array of candidate IDs
 * @returns Object containing adjacency lists for the majority graph and its transpose
 */
function buildMajorityGraphAndTranspose(
  candidates: Candidate[],
  votes: string[][],
): {
  adj: Map<string, string[]>;
  transposeAdj: Map<string, string[]>;
} {
  // Calculate pairwise results
  const pairwiseResults = getPairwiseResults(candidates, votes);

  // Threshold for majority
  const threshold = votes.length / 2;

  // Initialize adjacency lists
  const adj = new Map<string, string[]>();
  const transposeAdj = new Map<string, string[]>();

  // Initialize empty adjacency lists for each candidate
  candidates.forEach(candidate => {
    adj.set(candidate.id, []);
    transposeAdj.set(candidate.id, []);
  });

  // Build the majority graph and its transpose
  candidates.forEach(a => {
    candidates.forEach(b => {
      // If a defeats b in a majority of votes
      if (a.id !== b.id && pairwiseResults.get(a.id)?.get(b.id) > threshold) {
        // Add edge a -> b in original graph
        adj.get(a.id)?.push(b.id);

        // Add edge b -> a in transpose graph
        transposeAdj.get(b.id)?.push(a.id);
      }
    });
  });

  return { adj, transposeAdj };
}

/**
 * Computes pairwise results between candidates.
 *
 * @param candidates - Array of candidate objects
 * @param votes - Array of votes, where each vote is an ordered array of candidate IDs
 * @returns Map of maps containing the number of times each candidate beats another
 */
function getPairwiseResults(
  candidates: Candidate[],
  votes: string[][],
): Map<string, Map<string, number>> {
  const results = new Map<string, Map<string, number>>();

  // Initialize the results map
  candidates.forEach(a => {
    const innerMap = new Map<string, number>();
    candidates.forEach(b => {
      if (a.id !== b.id) {
        innerMap.set(b.id, 0);
      }
    });
    results.set(a.id, innerMap);
  });

  // Count pairwise victories
  votes.forEach(vote => {
    // For each pair of candidates in the vote
    for (let i = 0; i < vote.length; i++) {
      for (let j = i + 1; j < vote.length; j++) {
        const winner = vote[i];
        const loser = vote[j];

        // Increment the count of winner beating loser
        const currentCount = results.get(winner)?.get(loser) ?? 0;
        results.get(winner)?.set(loser, currentCount + 1);
      }
    }
  });

  return results;
}

/**
 * Implements Kosaraju's algorithm to find strongly connected components.
 *
 * @param adj - Adjacency list of the original graph
 * @param transposeAdj - Adjacency list of the transpose graph
 * @param candidates - Array of candidate objects
 * @returns Array of arrays, where each inner array is a SCC
 */
function kosaraju(
  adj: Map<string, string[]>,
  transposeAdj: Map<string, string[]>,
  candidates: Candidate[],
): string[][] {
  const visited = new Set<string>();
  const order: string[] = [];
  const components: string[][] = [];

  // First pass: DFS on original graph and fill the order stack
  function dfs1(nodeId: string): void {
    if (!visited.has(nodeId)) {
      visited.add(nodeId);
      const neighbors = adj.get(nodeId) || [];

      // Visit all neighbors
      for (const neighbor of neighbors) {
        dfs1(neighbor);
      }

      // Push node to order after all neighbors are processed
      order.push(nodeId);
    }
  }

  // Run DFS on each unvisited node
  candidates.forEach(candidate => {
    if (!visited.has(candidate.id)) {
      dfs1(candidate.id);
    }
  });

  // Clear visited set for second pass
  visited.clear();

  // Second pass: DFS on transpose graph in reverse order
  function dfs2(nodeId: string, component: string[]): void {
    if (!visited.has(nodeId)) {
      visited.add(nodeId);
      component.push(nodeId);

      const neighbors = transposeAdj.get(nodeId) || [];
      // Visit all neighbors in transpose graph
      for (const neighbor of neighbors) {
        dfs2(neighbor, component);
      }
    }
  }

  // Process nodes in reverse order of finishing times
  while (order.length > 0) {
    const nodeId = order.pop()!;
    if (!visited.has(nodeId)) {
      const component: string[] = [];
      dfs2(nodeId, component);
      components.push(component);
    }
  }

  return components;
}

// Export the function to be used in your application
export { determineWinner };
