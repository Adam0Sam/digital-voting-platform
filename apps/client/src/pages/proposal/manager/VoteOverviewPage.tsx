import { SingularLabeledBarChart } from '@/components/bar-chart';
import { useManagerProposal } from './ProposalManagePage';
import { getChoiceData } from '@/lib/proposal-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProposalChoice, Vote, VoteStatus } from '@/lib/types';
import { useMemo, useState } from 'react';

import { api } from '@/lib/api';
import UserVoteItem from '@/components/UserVoteItem';

export default function VoteOverviewPage() {
  const { proposal, permissions } = useManagerProposal();
  const [proposalVotes, setProposalVotes] = useState<Vote[]>(proposal.votes);
  const { choiceChartData } = useMemo(
    () => getChoiceData(proposal.choices, proposalVotes),
    [proposalVotes, proposal.choices],
  );
  const [highlightedChoices, setHighlightedChoices] = useState<string[]>([]);

  const handleVoteSave = (
    voteId: string,
    choices: ProposalChoice[],
    status: VoteStatus,
  ) => {
    api.vote.editVote(proposal.id, voteId, choices, status);
    setProposalVotes(prevVotes =>
      prevVotes.map(prevVote => {
        if (prevVote.id === voteId) {
          return {
            ...prevVote,
            choices,
          };
        }
        return prevVote;
      }),
    );
  };

  return (
    <div className="flex flex-col gap-12 md:flex-row">
      <div className="flex flex-1 flex-col gap-12">
        <h2 className="text-2xl">Votes</h2>
        <SingularLabeledBarChart
          chartData={choiceChartData}
          selectedCells={highlightedChoices}
          dataLabelKey="choiceValue"
          dataValueKey="choiceVotes"
          className="min-h-1 flex-1"
        />
      </div>
      <Card className="flex flex-1 flex-col">
        <CardHeader>
          <CardTitle>Voters</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {proposalVotes.map(vote => (
              <UserVoteItem
                vote={vote}
                allChoices={proposal.choices}
                onFocus={vote => {
                  setHighlightedChoices(
                    vote.choices.map(choice => choice.value),
                  );
                }}
                maxChoiceCount={proposal.choiceCount}
                onBlur={() => setHighlightedChoices([])}
                canEditVoteChoices={permissions.canEditVoteChoices}
                canCreateVotes={permissions.canCreateVotes}
                canDeleteVotes={permissions.canDeleteVotes}
                canEditChoiceCount={permissions.canEditChoiceCount}
                key={vote.id}
                saveVoteEdit={handleVoteSave}
              />
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
