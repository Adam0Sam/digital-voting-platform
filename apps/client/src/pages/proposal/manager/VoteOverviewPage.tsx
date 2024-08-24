import { SingularLabeledBarChart } from '@/components/bar-chart';
import { useManagerProposal } from './ProposalManagePage';
import { getChoiceData } from '@/lib/proposal-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProposalChoice, Vote } from '@/lib/types';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Settings2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

function getSelectedChoices(
  selectedChoices: ProposalChoice[],
  allChoices: ProposalChoice[],
) {
  const selectedChoiceIdSet = new Set(selectedChoices.map(choice => choice.id));
  return allChoices.map(choice => ({
    ...choice,
    selected: selectedChoiceIdSet.has(choice.id),
  }));
}

function UserVoteItem({
  vote,
  onFocus,
  onBlur,
  canEditChoices,
  canCreateVotes,
  canDeleteVotes,
  canEditChoiceCount,
  allChoices,
  maxChoiceCount,
  saveVoteEdit,
}: {
  vote: Vote;
  onFocus?: (vote: Vote) => void;
  onBlur?: () => void;
  canEditChoices?: boolean;
  canCreateVotes?: boolean;
  canDeleteVotes?: boolean;
  canEditChoiceCount?: boolean;
  allChoices: ProposalChoice[];
  maxChoiceCount: number;
  saveVoteEdit?: (voteId: string, choices: ProposalChoice[]) => void;
}) {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [choices, setChoices] = useState<
    (ProposalChoice & { selected: boolean })[]
  >(getSelectedChoices(vote.choices, allChoices));
  const [choiceOverflow, setChoiceOverflow] = useState(false);

  const handleChoiceClick = (choice: ProposalChoice) => {
    if (!canEditChoices) return;
    setChoiceOverflow(false);
    setChoices(prevChoices =>
      prevChoices.map(prevChoice => {
        if (prevChoice.id === choice.id) {
          return {
            ...prevChoice,
            selected: !prevChoice.selected,
          };
        }
        return prevChoice;
      }),
    );
  };

  const handleVoteEdit = () => {
    const selectedChoices = choices.filter(choice => choice.selected);
    if (selectedChoices.length > maxChoiceCount) {
      setChoiceOverflow(true);
      return;
    }
    setChoiceOverflow(false);
    setSheetIsOpen(false);
    saveVoteEdit?.(vote.id, selectedChoices);
  };

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
        <div className="hidden flex-1 sm:block">
          <p>{vote.status}</p>
          <p className="text-muted-foreground">
            {vote.choices.map(choice => choice.value).join(', ')}
          </p>
        </div>
        {canEditChoices && (
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
        <div className="flex flex-col items-center gap-16">
          <h3 className="text-3xl font-semibold">
            {vote.user.personalNames.join(' ')}, {vote.user.familyName}
          </h3>
          <div className="flex w-full flex-col gap-8">
            <div
              className={cn('flex items-center justify-between', {
                'text-destructive': choiceOverflow,
              })}
            >
              <p className="text-xl">Choice Count: {maxChoiceCount}</p>
              {canEditChoiceCount && <Pencil />}
            </div>
            <div className="flex w-full flex-col gap-4">
              {choices.map(choice => {
                return (
                  <Button
                    variant={choice.selected ? 'secondary' : 'ghost'}
                    className="p flex w-full items-center gap-8 overflow-hidden"
                    onClick={() => handleChoiceClick(choice)}
                    key={choice.id}
                  >
                    <Checkbox checked={choice.selected} />
                    <p className="flex flex-1 text-xl">{choice.value}</p>
                  </Button>
                );
              })}
            </div>
            {canEditChoices && (
              <Button onClick={handleVoteEdit}>
                <span>Save</span>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function VoteOverviewPage() {
  const { proposal, permissions } = useManagerProposal();
  const [proposalVotes, setProposalVotes] = useState<Vote[]>(proposal.votes);
  const { choiceChartData } = useMemo(
    () => getChoiceData(proposal.choices, proposalVotes),
    [proposalVotes, proposal.choices],
  );

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
                canEditChoices={permissions.canEditChoices}
                canCreateVotes={permissions.canCreateVotes}
                canDeleteVotes={permissions.canDeleteVotes}
                canEditChoiceCount={permissions.canEditChoiceCount}
                key={vote.id}
                saveVoteEdit={(voteId, choices) => {
                  api.vote.editVote(proposal.id, voteId, choices);
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
                }}
              />
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
