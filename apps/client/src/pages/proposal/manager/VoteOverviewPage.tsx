import { SingularLabeledBarChart } from '@/components/bar-chart';
import { useManagerProposal } from './ProposalManagePage';
import { getChoiceData } from '@/lib/proposal-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Vote } from '@/lib/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

function UserVoteItem({
  vote,
  onFocus,
  onBlur,
  canEdit,
}: {
  vote: Vote;
  onFocus?: (vote: Vote) => void;
  onBlur?: () => void;
  canEdit?: boolean;
}) {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);

  return (
    <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
      <div
        className="mb-4 flex gap-2 rounded-sm border-2 border-secondary/0 px-4 py-2 transition-colors hover:border-secondary focus-visible:border-secondary"
        onFocus={() => onFocus?.(vote)}
        onMouseEnter={() => onFocus?.(vote)}
        onBlur={onBlur}
        onMouseLeave={onBlur}
      >
        <div className="flex-1">
          <p className="whitespace-nowrap">
            {vote.user.personalNames.join(' ')}, {vote.user.familyName}
          </p>
          <p className="whitespace-nowrap text-muted-foreground">
            {vote.user.roles.map(role => role.toLocaleLowerCase()).join(', ')}
          </p>
        </div>
        <div className="flex-1">
          <p>{vote.status}</p>
          <p className="text-muted-foreground">
            {vote.choices.map(choice => choice.value).join(', ')}
          </p>
        </div>
        {canEdit && (
          <div className="flex flex-col justify-center">
            <SheetTrigger asChild>
              <Button variant="outline">
                <Settings2 />
              </Button>
            </SheetTrigger>
          </div>
        )}
      </div>
      <SheetContent
        side="right"
        className="flex w-full max-w-full items-center justify-center sm:w-3/4 sm:max-w-screen-xl"
      >
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-3xl font-semibold">
            {vote.user.personalNames.join(' ')}, {vote.user.familyName}
          </h3>
          <h4 className="text-2xl">Vote</h4>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function VoteOverviewPage() {
  const { proposal, permissions } = useManagerProposal();

  const { choiceChartData } = getChoiceData(proposal);

  const [highlightedChoices, setHighlightedChoices] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-12 md:flex-row">
      <div className="flex flex-1 flex-col gap-12">
        <h2 className="text-2xl">Votes</h2>
        <SingularLabeledBarChart
          chartData={choiceChartData}
          selectedCells={highlightedChoices}
          dataLabelKey="choiceValue"
          dataValueKey="choiceVotes"
          className="flex-1"
        />
      </div>
      <Card className="flex flex-1 flex-col">
        <CardHeader>
          <CardTitle>Voters</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {proposal.votes.map(vote => (
              <UserVoteItem
                vote={vote}
                onFocus={vote => {
                  setHighlightedChoices(
                    vote.choices.map(choice => choice.value),
                  );
                }}
                onBlur={() => setHighlightedChoices([])}
                canEdit={permissions.canEditVotes}
              />
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
