import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pencil, Settings2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { Candidate, ManagerPermissions, Vote, VoteStatus } from '@ambassador';
import { PROPOSAL_HREFS } from '@/lib/routes';

function getSelectedChoices(
  selectedCandidates: Candidate[],
  allCandidates: Candidate[],
) {
  const selectedChoiceIdSet = new Set(
    selectedCandidates.map(choice => choice.id),
  );
  return allCandidates.map(choice => ({
    ...choice,
    selected: selectedChoiceIdSet.has(choice.id),
  }));
}

type UserVoteItemProps = {
  vote: Vote;
  onFocus?: (vote: Vote) => void;
  onBlur?: () => void;
  permissions?: ManagerPermissions;
  allChoices: Candidate[];
  maxChoiceCount: number;
  saveVoteSuggestionOffer: (voteId: string, candidates: Candidate[]) => void;
  handleVoteStatusToggle: (vote: Vote) => Promise<void>;
};

export default function UserVoteItem({
  vote,
  onFocus,
  onBlur,
  permissions,
  allChoices,
  maxChoiceCount,
  saveVoteSuggestionOffer,
  handleVoteStatusToggle,
}: UserVoteItemProps) {
  const navigate = useNavigate();
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [choices, setChoices] = useState<(Candidate & { selected: boolean })[]>(
    getSelectedChoices(vote.candidates, allChoices),
  );
  const [choiceOverflow, setChoiceOverflow] = useState(false);

  const handleChoiceClick = (choice: Candidate) => {
    if (!permissions?.canOfferVoteSuggestions) return;
    setChoiceOverflow(false);
    setChoices(prevChoices => {
      let selectedChoicesCount = 0;
      const newChoices = prevChoices.map(prevChoice => {
        if (prevChoice.id === choice.id) {
          if (!prevChoice.selected) {
            selectedChoicesCount++;
          }
          return {
            ...prevChoice,
            selected: !prevChoice.selected,
          };
        }
        if (prevChoice.selected) {
          selectedChoicesCount++;
        }
        return prevChoice;
      });
      if (selectedChoicesCount > maxChoiceCount) {
        setChoiceOverflow(true);
      }
      return newChoices;
    });
  };

  const handleSuggestionOffer = () => {
    if (choiceOverflow) return;
    const selectedChoices = choices.filter(choice => choice.selected);
    if (selectedChoices.length > maxChoiceCount) {
      setChoiceOverflow(true);
      return;
    }
    setChoiceOverflow(false);
    setSheetIsOpen(false);
    saveVoteSuggestionOffer(vote.id, selectedChoices);
  };

  const handleStatusToggle = async () => {
    setSheetIsOpen(false);
    await handleVoteStatusToggle(vote);
  };

  return (
    <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
      <div
        className={cn(
          'mb-4 flex gap-2 rounded-sm border-2 px-4 py-2 transition-colors',
          {
            'border-secondary/75 hover:border-primary focus-visible:border-primary':
              vote.status !== VoteStatus.DISABLED,
          },
          {
            'border-destructive/50 hover:border-destructive focus-visible:border-destructive':
              vote.status === VoteStatus.DISABLED,
          },
        )}
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
            {vote.candidates.map(choice => choice.value).join(', ')}
          </p>
        </div>
        {permissions?.canOfferVoteSuggestions && (
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
        <div className="flex w-full flex-col items-center gap-16 md:w-2/3 lg:w-1/2">
          <h3 className="text-3xl font-semibold">
            {vote.user.personalNames.join(' ')}, {vote.user.familyName}
          </h3>
          <div className="flex w-full gap-12">
            <div className="flex flex-[3] flex-col gap-8">
              <div
                className={cn('flex items-center justify-between', {
                  'text-destructive': choiceOverflow,
                })}
              >
                <p className="text-xl">Choice Count: {maxChoiceCount}</p>
                {permissions?.canEditChoiceCount && (
                  <Pencil
                    className="cursor-pointer"
                    onClick={() =>
                      navigate(
                        PROPOSAL_HREFS.MANAGER_OVERVIEW(
                          'candidates',
                          vote.proposalId,
                        ),
                      )
                    }
                  />
                )}
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
            </div>
          </div>
          <div className="flex w-full justify-center gap-8">
            {permissions?.canOfferVoteSuggestions && (
              <Button onClick={handleSuggestionOffer} className="flex-[2]">
                <span>Save Suggestions</span>
              </Button>
            )}
            {permissions?.canChangeVoteStatus && (
              <ConfirmDialog
                triggerButton={{
                  text:
                    vote.status === VoteStatus.DISABLED ? 'Enable' : 'Disable',
                  variant:
                    vote.status === VoteStatus.DISABLED
                      ? 'constructive'
                      : 'destructive',
                  className: 'flex-1',
                }}
                confirmButton={{
                  variant:
                    vote.status === VoteStatus.DISABLED
                      ? 'constructive'
                      : 'destructive',
                  className: 'flex-[3]',
                }}
                cancelButton={{
                  variant: 'secondary',
                  className: 'flex-[2]',
                }}
                dialogTitle={`Are you sure you want to ${vote.status === VoteStatus.DISABLED ? 'enable' : 'disable'} this user's vote?`}
                dialogDescription={`This action will ${vote.status === VoteStatus.DISABLED ? 'allow' : 'prevent'} the user from voting.`}
                handleConfirm={handleStatusToggle}
              />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
