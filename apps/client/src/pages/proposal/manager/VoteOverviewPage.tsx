import { useState } from 'react';
import { SingularLabeledBarChart } from '@/components/bar-chart';
import { useManagerProposal } from './ProposalManagePage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import UserVoteItem from '@/components/UserVoteItem';
import {
  BindedVote,
  Candidate,
  CreateVoteSuggestionDto,
  ProposalStatus,
  Vote,
  VoteStatus,
} from '@ambassador';
import {
  BarChart2,
  Users,
  CheckCircle,
  Vote as VoteIcon,
  Lightbulb,
} from 'lucide-react';
import ResolutionDisplayCard from '@/components/ResolutionDisplayCard';
import { getVoteDistribution } from '@/lib/resolution-results';
import { cacheFunction } from '@/lib/cache';
import { useRevalidator } from 'react-router-dom';

const getCachedVoteDistribution = cacheFunction(getVoteDistribution);

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
  const revalidator = useRevalidator();
  console.log('proposal.votes', proposal.votes);
  const [currentTab, setCurrentTab] = useState<TabName>(TAB_NAME.VOTES);
  const [suggestedVotes, setSuggestedVotes] = useState<BindedVote[]>(
    proposal.votes.map(vote => ({
      ...vote,
      voteSelections: vote.voteSuggestions ?? [],
    })),
  );
  const [highlightedChoices, setHighlightedChoices] = useState<string[]>([]);

  const { voteDistribution, finalizedVoteCount } = getCachedVoteDistribution(
    proposal.candidates,
    proposal.votes
      .filter(vote => vote.status === VoteStatus.RESOLVED)
      .map(vote => vote.voteSelections),
  );

  const {
    voteDistribution: suggestedVoteDistribution,
    finalizedVoteCount: suggestedFinalizedVoteCount,
  } = getCachedVoteDistribution(
    proposal.candidates,
    suggestedVotes.map(vote => vote.voteSelections),
  );

  const handleVoteSuggestionOffer = (
    voteId: string,
    candidates: Candidate[],
  ) => {
    const voteSuggestions: CreateVoteSuggestionDto[] = candidates.map(
      candidate => ({
        voteId,
        candidateId: candidate.id,
        candidate,
      }),
    );
    api.vote.suggestVote(proposal.id, voteId, voteSuggestions);
    setSuggestedVotes(prevVotes => {
      const newVotes = prevVotes.map(prevVote => {
        if (prevVote.id === voteId) {
          return {
            ...prevVote,
            voteSelections: voteSuggestions,
          };
        }
        return prevVote;
      });
      return newVotes;
    });
  };

  const handleVoteStatusToggle = async (vote: Vote) => {
    const newStatus =
      vote.status === VoteStatus.DISABLED
        ? VoteStatus.PENDING
        : VoteStatus.DISABLED;
    await api.vote.mutateUserVoteStatus(proposal.id, vote.id, newStatus);
    revalidator.revalidate();
    setSuggestedVotes(prevVotes => {
      const newVotes = prevVotes.map(prevVote => {
        if (prevVote.id === vote.id) {
          return {
            ...prevVote,
            status: newStatus,
          };
        }
        return prevVote;
      });
      return newVotes;
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
          <div className="grid gap-8 lg:grid-cols-2">
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
                          vote.voteSelections.map(
                            selection => selection.candidateId,
                          ),
                        );
                      }}
                      maxChoiceCount={proposal.choiceCount}
                      onBlur={() => setHighlightedChoices([])}
                      permissions={permissions}
                      saveVoteSuggestionOffer={(
                        voteId: string,
                        candidates: Candidate[],
                      ) => {
                        handleVoteSuggestionOffer(voteId, candidates);
                        setCurrentTab(TAB_NAME.SUGGESTED);
                      }}
                      handleVoteStatusToggle={handleVoteStatusToggle}
                      isProposalActive={
                        proposal.status === ProposalStatus.ACTIVE
                      }
                    />
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="suggested">
          <div className="grid gap-8 lg:grid-cols-2">
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
                          vote.voteSelections.map(
                            selection => selection.candidateId,
                          ),
                        );
                      }}
                      maxChoiceCount={proposal.choiceCount}
                      onBlur={() => setHighlightedChoices([])}
                      permissions={permissions}
                      saveVoteSuggestionOffer={handleVoteSuggestionOffer}
                      handleVoteStatusToggle={handleVoteStatusToggle}
                      isProposalActive={
                        proposal.status === ProposalStatus.ACTIVE
                      }
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
