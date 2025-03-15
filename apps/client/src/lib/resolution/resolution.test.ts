import { Candidate, VoteSelection } from '@ambassador';
import {
  getPairwiseResults,
  getMajorityGraph,
  computeSmithSet,
  getCondorcetWinnerFromGraph,
  getRankedChoiceWinner,
} from './majority-graph';

const createVote = (rankings: Array<[string, number]>): VoteSelection[] =>
  rankings.map(([id, rank]) => ({
    candidateId: id,
    rank,
    voteId: crypto.randomUUID(),
  }));

const candidates: Candidate[] = [
  { id: 'A', value: 'Alice' },
  { id: 'B', value: 'Bob' },
  { id: 'C', value: 'Charlie' },
  { id: 'D', value: 'Dave' },
];

describe.skip('deepseek', () => {
  describe('getPairwiseResults', () => {
    test('handles basic majority', () => {
      const votes = [
        createVote([
          ['A', 1],
          ['B', 2],
          ['C', 3],
        ]),
        createVote([
          ['A', 1],
          ['B', 2],
          ['C', 3],
        ]),
        createVote([
          ['B', 1],
          ['A', 2],
          ['C', 3],
        ]),
      ];

      const results = getPairwiseResults(candidates, votes);
      expect(results.get('A')?.get('B')).toBe(2); // A beats B in 2/3 votes
      expect(results.get('B')?.get('A')).toBe(1); // B beats A in 1/3 votes
      expect(results.get('A')?.get('C')).toBe(3); // A always beats C
    });

    test('handles complete tie', () => {
      const votes = [
        createVote([
          ['A', 1],
          ['B', 2],
        ]),
        createVote([
          ['B', 1],
          ['A', 2],
        ]),
      ];

      const results = getPairwiseResults(candidates, votes);
      expect(results.get('A')?.get('B')).toBe(1);
      expect(results.get('B')?.get('A')).toBe(1);
    });

    test('handles partial rankings', () => {
      const votes = [
        createVote([
          ['A', 1],
          ['B', 2],
        ]), // C/D not ranked
        createVote([
          ['C', 1],
          ['D', 2],
        ]), // A/B not ranked
      ];

      const results = getPairwiseResults(candidates, votes);
      // A vs C: A ranked higher in 1 vote, C in 1 vote
      expect(results.get('A')?.get('C')).toBe(1);
      expect(results.get('C')?.get('A')).toBe(1);
    });
  });

  describe('getMajorityGraph', () => {
    test('identifies clear Condorcet winner', () => {
      const votes = [
        ...Array(3).fill(
          createVote([
            ['A', 1],
            ['B', 2],
            ['C', 3],
            ['D', 4],
          ]),
        ),
        ...Array(2).fill(
          createVote([
            ['A', 1],
            ['C', 2],
            ['B', 3],
            ['D', 4],
          ]),
        ),
      ];

      const { graph } = getMajorityGraph(candidates, votes);
      expect(graph.get('A')).toEqual(['B', 'C', 'D']);
      expect(graph.get('B')?.length).toBeLessThan(3);
    });

    test('detects cycle in rock-paper-scissors scenario', () => {
      const votes = [
        createVote([
          ['A', 1],
          ['B', 2],
          ['C', 3],
        ]),
        createVote([
          ['B', 1],
          ['C', 2],
          ['A', 3],
        ]),
        createVote([
          ['C', 1],
          ['A', 2],
          ['B', 3],
        ]),
      ];

      const { graph } = getMajorityGraph(candidates, votes);
      expect(graph.get('A')).toContain('B'); // A > B
      expect(graph.get('B')).toContain('C'); // B > C
      expect(graph.get('C')).toContain('A'); // C > A
    });
  });

  describe.skip('computeSmithSet', () => {
    test('returns single Condorcet winner', () => {
      const votes = [
        ...Array(4).fill(
          createVote([
            ['A', 1],
            ['B', 2],
            ['C', 3],
          ]),
        ),
        ...Array(3).fill(
          createVote([
            ['A', 1],
            ['C', 2],
            ['B', 3],
          ]),
        ),
      ];

      const pr = getPairwiseResults(candidates, votes);
      const smithSet = computeSmithSet(candidates, pr);
      expect(smithSet.map(c => c.id)).toEqual(['A']);
    });

    test('identifies full Smith set in cycle', () => {
      const votes = [
        createVote([
          ['A', 1],
          ['B', 2],
          ['C', 3],
        ]),
        createVote([
          ['B', 1],
          ['C', 2],
          ['A', 3],
        ]),
        createVote([
          ['C', 1],
          ['A', 2],
          ['B', 3],
        ]),
      ];

      const pr = getPairwiseResults(candidates, votes);
      const smithSet = computeSmithSet(candidates, pr);
      expect(new Set(smithSet.map(c => c.id))).toEqual(
        new Set(['A', 'B', 'C']),
      );
    });

    test('handles multi-level dominance', () => {
      // A > B > C > D, A < C (creating Smith set {A, B, C})
      const votes = [
        ...Array(3).fill(
          createVote([
            ['A', 1],
            ['B', 2],
            ['C', 3],
            ['D', 4],
          ]),
        ),
        ...Array(2).fill(
          createVote([
            ['C', 1],
            ['A', 2],
            ['B', 3],
            ['D', 4],
          ]),
        ),
      ];

      const pr = getPairwiseResults(candidates, votes);
      const smithSet = computeSmithSet(candidates, pr);
      expect(new Set(smithSet.map(c => c.id))).toEqual(
        new Set(['A', 'B', 'C']),
      );
    });
  });

  describe.skip('getCondorcetWinnerFromGraph', () => {
    test('identifies clear winner', () => {
      const graph = new Map([
        ['A', ['B', 'C', 'D']],
        ['B', []],
        ['C', []],
        ['D', []],
      ]);
      expect(getCondorcetWinnerFromGraph(candidates, graph)).toBe('A');
    });

    test('returns null for cyclic graph', () => {
      const graph = new Map([
        ['A', ['B']],
        ['B', ['C']],
        ['C', ['A']],
        ['D', []],
      ]);
      expect(getCondorcetWinnerFromGraph(candidates, graph)).toBeNull();
    });
  });

  describe.skip('getRankedChoiceWinner', () => {
    test('returns Condorcet winner directly', () => {
      const votes = [
        ...Array(5).fill(
          createVote([
            ['A', 1],
            ['B', 2],
            ['C', 3],
          ]),
        ),
        ...Array(4).fill(
          createVote([
            ['A', 1],
            ['C', 2],
            ['B', 3],
          ]),
        ),
      ];

      const result = getRankedChoiceWinner(candidates, votes);
      expect(result?.optionValue).toBe('Alice');
    });

    test('resolves Smith set with IRV', () => {
      const votes = [
        ...Array(3).fill(
          createVote([
            ['A', 1],
            ['B', 2],
            ['C', 3],
          ]),
        ),
        ...Array(3).fill(
          createVote([
            ['B', 1],
            ['C', 2],
            ['A', 3],
          ]),
        ),
        ...Array(2).fill(
          createVote([
            ['C', 1],
            ['A', 2],
            ['B', 3],
          ]),
        ),
      ];

      const result = getRankedChoiceWinner(candidates, votes);
      // IRV eliminates C first, then A vs B
      expect(['Alice', 'Bob']).toContain(result?.optionValue);
    });

    test('returns null for complete cycle', () => {
      const votes = [
        createVote([
          ['A', 1],
          ['B', 2],
          ['C', 3],
        ]),
        createVote([
          ['B', 1],
          ['C', 2],
          ['A', 3],
        ]),
        createVote([
          ['C', 1],
          ['A', 2],
          ['B', 3],
        ]),
      ];

      const result = getRankedChoiceWinner(candidates, votes);
      expect(result).toBeNull();
    });

    test('handles single-candidate election', () => {
      const result = getRankedChoiceWinner(
        [candidates[0]],
        [createVote([['A', 1]])],
      );
      expect(result?.optionValue).toBe('Alice');
    });
  });
});
