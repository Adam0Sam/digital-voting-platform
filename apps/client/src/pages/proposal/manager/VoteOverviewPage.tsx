import { useState } from 'react';
import { SingularLabeledBarChart } from '@/components/bar-chart';
import { useManagerProposal } from './ProposalManagePage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import UserVoteItem from '@/components/UserVoteItem';
import { Candidate, VoteStatus, Vote } from '@ambassador';
import {
  BarChart2,
  Users,
  CheckCircle,
  Vote as VoteIcon,
  Lightbulb,
} from 'lucide-react';
import ResolutionDisplayCard from '@/components/ResolutionDisplayCard';
import { calculateVoteDistribution } from '@/lib/resolution-results';
import { cacheFunction } from '@/lib/cache';

const getCachedVoteDistribution = cacheFunction(calculateVoteDistribution);

function VoteDistributionChart({
  distribution,
  highlightedChoices,
  title,
}: {
  distribution: { optionValue: string; voteCount: number }[];
  highlightedChoices: string[];
  title: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart2 className="mr-2 h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SingularLabeledBarChart
          chartData={distribution}
          selectedCells={highlightedChoices}
          dataLabelKey="optionValue"
          dataValueKey="voteCount"
          className="h-[400px] w-full"
        />
      </CardContent>
    </Card>
  );
}

const TAB_NAME = {
  VOTES: 'votes',
  SUGGESTED: 'suggested',
  RESULTS: 'results',
} as const;

type TabName = (typeof TAB_NAME)[keyof typeof TAB_NAME];

export default function VoteOverviewPage() {
  const { proposal, permissions } = useManagerProposal();

  if (proposal.votes.some(vote => vote.suggestedCandidates === undefined)) {
    throw new Error(`Some votes do not have suggested candidates`);
  }

  const [currentTab, setCurrentTab] = useState<TabName>(TAB_NAME.VOTES);
  const [suggestedVotes, setSuggestedVotes] = useState<Vote[]>(
    proposal.votes.map(vote => ({
      ...vote,
      candidates: vote.suggestedCandidates!,
    })),
  );
  const [highlightedChoices, setHighlightedChoices] = useState<string[]>([]);

  const { voteDistribution, finalizedVoteCount } = getCachedVoteDistribution(
    proposal.candidates,
    proposal.votes,
  );
  const {
    voteDistribution: suggestedVoteDistribution,
    finalizedVoteCount: suggestedFinalizedVoteCount,
  } = getCachedVoteDistribution(proposal.candidates, suggestedVotes, false);

  const handleVoteSuggestionOffer = (
    voteId: string,
    candidates: Candidate[],
    status: VoteStatus,
  ) => {
    api.vote.suggestVote(proposal.id, voteId, candidates, status);
    setSuggestedVotes(prevVotes => {
      const a = prevVotes.map(prevVote => {
        if (prevVote.id === voteId) {
          return {
            ...prevVote,
            status: status,
            candidates: candidates,
          };
        }
        return prevVote;
      });
      return a;
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold">Vote Overview</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            Total Votes: {proposal.votes.length}
          </Badge>
          <Badge variant="secondary">
            Resolved Votes:{' '}
            {currentTab === TAB_NAME.SUGGESTED
              ? suggestedFinalizedVoteCount
              : finalizedVoteCount}
          </Badge>
        </div>
      </div>
      <Tabs
        defaultValue="votes"
        className="space-y-4"
        value={currentTab}
        onValueChange={(value: string) => {
          if (Object.values(TAB_NAME).includes(value)) {
            setCurrentTab(value as TabName);
          }
        }}
      >
        <TabsList>
          <TabsTrigger value="votes">
            <VoteIcon className="mr-2 h-4 w-4" />
            Real Votes
          </TabsTrigger>
          <TabsTrigger value="suggested">
            <Lightbulb className="mr-2 h-4 w-4" />
            Suggested Votes
          </TabsTrigger>
          <TabsTrigger value="results">
            <CheckCircle className="mr-2 h-4 w-4" />
            Results
          </TabsTrigger>
        </TabsList>
        <TabsContent value="votes">
          <div className="grid gap-8 md:grid-cols-2">
            <VoteDistributionChart
              distribution={voteDistribution}
              highlightedChoices={highlightedChoices}
              title="Vote Distribution"
            />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Voter List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {proposal.votes.map(vote => (
                    <UserVoteItem
                      key={vote.id}
                      vote={vote}
                      allChoices={proposal.candidates}
                      onFocus={vote => {
                        setHighlightedChoices(
                          vote.candidates.map(candidate => candidate.value),
                        );
                      }}
                      maxChoiceCount={proposal.choiceCount}
                      onBlur={() => setHighlightedChoices([])}
                      permissions={permissions}
                      saveVoteSuggestionOffer={(
                        voteId: string,
                        candidates: Candidate[],
                        status: VoteStatus,
                      ) => {
                        handleVoteSuggestionOffer(voteId, candidates, status);
                        setCurrentTab(TAB_NAME.SUGGESTED);
                      }}
                    />
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="suggested">
          <div className="grid gap-8 md:grid-cols-2">
            <VoteDistributionChart
              distribution={suggestedVoteDistribution}
              highlightedChoices={highlightedChoices}
              title="Suggested Vote Distribution"
            />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Suggested Voter List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {suggestedVotes.map(vote => (
                    <UserVoteItem
                      key={vote.id}
                      vote={vote}
                      allChoices={proposal.candidates}
                      onFocus={vote => {
                        setHighlightedChoices(
                          vote.candidates.map(candidate => candidate.value),
                        );
                      }}
                      maxChoiceCount={proposal.choiceCount}
                      onBlur={() => setHighlightedChoices([])}
                      permissions={permissions}
                      saveVoteSuggestionOffer={handleVoteSuggestionOffer}
                    />
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="results" className="flex justify-center">
          <ResolutionDisplayCard
            proposal={proposal}
            className="max-w-2xl flex-1 pt-5"
            showHeader={false}
            voteDistributionCallback={getCachedVoteDistribution}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
