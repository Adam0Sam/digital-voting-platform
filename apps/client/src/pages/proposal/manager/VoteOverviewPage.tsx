import { useState } from 'react';
import { SingularLabeledBarChart } from '@/components/bar-chart';
import { useManagerProposal } from './ProposalManagePage';
import { getChoiceData } from '@/lib/proposal-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import UserVoteItem from '@/components/UserVoteItem';
import { Candidate, VoteStatus, Vote } from '@ambassador';
import { BarChart2, Users, CheckCircle, Vote as VoteIcon } from 'lucide-react';
import { getCachedFunction } from '@/lib/utils';
import ResolutionDisplayCard from '@/components/ResolutionDisplayCard';

const getCachedChoiceData = getCachedFunction(getChoiceData);

export default function VoteOverviewPage() {
  const { proposal, permissions } = useManagerProposal();
  const [proposalVotes, setProposalVotes] = useState<Vote[]>(proposal.votes);
  const [highlightedChoices, setHighlightedChoices] = useState<string[]>([]);

  const handleVoteSave = (
    voteId: string,
    candidates: Candidate[],
    status: VoteStatus,
  ) => {
    api.vote.editVote(proposal.id, voteId, candidates, status);
    setProposalVotes(prevVotes => {
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
          <Badge variant="secondary">Total Votes: {proposalVotes.length}</Badge>
          <Badge variant="secondary">
            Resolved Votes:{' '}
            {
              getCachedChoiceData(proposal.candidates, proposalVotes)
                .resolvedVoteCount
            }
          </Badge>
        </div>
      </div>
      <Tabs defaultValue="votes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="votes">
            <VoteIcon className="mr-2 h-4 w-4" />
            Votes
          </TabsTrigger>
          <TabsTrigger value="results">
            <CheckCircle className="mr-2 h-4 w-4" />
            Results
          </TabsTrigger>
        </TabsList>
        <TabsContent value="votes">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5" />
                  Vote Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SingularLabeledBarChart
                  chartData={
                    getCachedChoiceData(proposal.candidates, proposalVotes)
                      .choiceChartData
                  }
                  selectedCells={highlightedChoices}
                  dataLabelKey="choiceValue"
                  dataValueKey="choiceVotes"
                  className="h-[400px] w-full"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Voter List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {proposalVotes.map(vote => (
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
                      canEditVotes={permissions.canEditVotes}
                      canCreateVotes={permissions.canCreateVotes}
                      canDeleteVotes={permissions.canDeleteVotes}
                      canEditChoiceCount={permissions.canEditChoiceCount}
                      saveVoteEdit={handleVoteSave}
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
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
