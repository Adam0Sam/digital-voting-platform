// import { SingularLabeledBarChart } from '@/components/bar-chart';
// import { useManagerProposal } from './ProposalManagePage';
// import { getChoiceData } from '@/lib/proposal-data';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { useMemo, useState } from 'react';

// import { api } from '@/lib/api';
// import UserVoteItem from '@/components/UserVoteItem';
// import { Candidate, Vote, VoteStatus } from '@ambassador';

// export default function VoteOverviewPage() {
//   const { proposal, permissions } = useManagerProposal();
//   const [proposalVotes, setProposalVotes] = useState<Vote[]>(proposal.votes);
//   const { choiceChartData } = useMemo(
//     () => getChoiceData(proposal.candidates, proposalVotes),
//     [proposalVotes, proposal.candidates],
//   );
//   const [highlightedChoices, setHighlightedChoices] = useState<string[]>([]);

//   const handleVoteSave = (
//     voteId: string,
//     candidates: Candidate[],
//     status: VoteStatus,
//   ) => {
//     api.vote.editVote(proposal.id, voteId, candidates, status);
//     setProposalVotes(prevVotes =>
//       prevVotes.map(prevVote => {
//         if (prevVote.id === voteId) {
//           return {
//             ...prevVote,
//             choices: candidates,
//           };
//         }
//         return prevVote;
//       }),
//     );
//   };

//   return (
//     <div className="flex flex-col gap-12 md:flex-row">
//       <div className="flex flex-1 flex-col gap-12">
//         <h2 className="text-2xl">Votes</h2>
//         <SingularLabeledBarChart
//           chartData={choiceChartData}
//           selectedCells={highlightedChoices}
//           dataLabelKey="choiceValue"
//           dataValueKey="choiceVotes"
//           className="min-h-1 flex-1"
//         />
//       </div>
//       <Card className="flex flex-1 flex-col">
//         <CardHeader>
//           <CardTitle>Voters</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ScrollArea className="h-96">
//             {proposalVotes.map(vote => (
//               <UserVoteItem
//                 vote={vote}
//                 allChoices={proposal.candidates}
//                 onFocus={vote => {
//                   setHighlightedChoices(
//                     vote.candidates.map(candidate => candidate.value),
//                   );
//                 }}
//                 maxChoiceCount={proposal.choiceCount}
//                 onBlur={() => setHighlightedChoices([])}
//                 canEditVotes={permissions.canEditVotes}
//                 canCreateVotes={permissions.canCreateVotes}
//                 canDeleteVotes={permissions.canDeleteVotes}
//                 canEditChoiceCount={permissions.canEditChoiceCount}
//                 key={vote.id}
//                 saveVoteEdit={handleVoteSave}
//               />
//             ))}
//           </ScrollArea>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { useMemo, useState } from 'react';
import { SingularLabeledBarChart } from '@/components/bar-chart';
import { useManagerProposal } from './ProposalManagePage';
import { getChoiceData } from '@/lib/proposal-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import UserVoteItem from '@/components/UserVoteItem';
import { Candidate, Vote, VoteStatus } from '@ambassador';
import { BarChart2, Users } from 'lucide-react';

export default function VoteOverviewPage() {
  const { proposal, permissions } = useManagerProposal();
  const [proposalVotes, setProposalVotes] = useState<Vote[]>(proposal.votes);
  const { choiceChartData, resolvedVoteCount } = useMemo(
    () => getChoiceData(proposal.candidates, proposalVotes),
    [proposalVotes, proposal.candidates],
  );
  const [highlightedChoices, setHighlightedChoices] = useState<string[]>([]);

  const handleVoteSave = (
    voteId: string,
    candidates: Candidate[],
    status: VoteStatus,
  ) => {
    api.vote.editVote(proposal.id, voteId, candidates, status);
    setProposalVotes(prevVotes =>
      prevVotes.map(prevVote => {
        if (prevVote.id === voteId) {
          return {
            ...prevVote,
            choices: candidates,
          };
        }
        return prevVote;
      }),
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold">Vote Overview</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Total Votes: {proposalVotes.length}</Badge>
          <Badge variant="secondary">Resolved Votes: {resolvedVoteCount}</Badge>
        </div>
      </div>

      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chart">
            <BarChart2 className="mr-2 h-4 w-4" />
            Vote Distribution
          </TabsTrigger>
          <TabsTrigger value="voters">
            <Users className="mr-2 h-4 w-4" />
            Voter List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vote Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <SingularLabeledBarChart
                chartData={choiceChartData}
                selectedCells={highlightedChoices}
                dataLabelKey="choiceValue"
                dataValueKey="choiceVotes"
                className="h-[400px] w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voters">
          <Card>
            <CardHeader>
              <CardTitle>Voter List</CardTitle>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
