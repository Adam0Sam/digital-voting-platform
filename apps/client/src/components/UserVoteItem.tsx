import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pencil, Settings2, Check } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import {
  BindedVote,
  Candidate,
  ManagerPermissions,
  VoteSelection,
  VoteStatus,
} from '@ambassador';
import { PROPOSAL_HREFS } from '@/lib/routes';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

function getSelectedChoices(
  voteSelections: VoteSelection[],
  allCandidates: Candidate[],
) {
  const selectedChoiceIdSet = new Set(
    voteSelections.map(selection => selection.candidateId),
  );
  return allCandidates.map(choice => ({
    ...choice,
    selected: selectedChoiceIdSet.has(choice.id),
  }));
}

type UserVoteItemProps = {
  vote: BindedVote;
  onFocus?: (vote: BindedVote) => void;
  onBlur?: () => void;
  permissions?: ManagerPermissions;
  allChoices: Candidate[];
  maxChoiceCount: number;
  saveVoteSuggestionOffer: (voteId: string, candidates: Candidate[]) => void;
  handleVoteStatusToggle: (vote: BindedVote) => Promise<void>;
  isProposalActive: boolean;
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
  isProposalActive,
}: UserVoteItemProps) {
  const navigate = useNavigate();
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [choices, setChoices] = useState<(Candidate & { selected: boolean })[]>(
    getSelectedChoices(vote.voteSelections, allChoices),
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

  const getVoteStatusColor = (status: VoteStatus) => {
    switch (status) {
      case VoteStatus.PENDING:
        return 'bg-yellow-500';
      case VoteStatus.RESOLVED:
        return 'bg-green-500';
      case VoteStatus.DISABLED:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
      <div
        className={cn(
          'mb-4 flex items-center gap-4 rounded-lg border p-4 transition-all hover:shadow-md',
          {
            'border-secondary hover:border-primary focus-visible:border-primary':
              vote.status !== VoteStatus.DISABLED,
            'border-destructive/50 hover:border-destructive focus-visible:border-destructive':
              vote.status === VoteStatus.DISABLED,
          },
        )}
        onFocus={() => onFocus?.(vote)}
        onMouseEnter={() => onFocus?.(vote)}
        onBlur={onBlur}
        onMouseLeave={onBlur}
      >
        <Avatar className="h-12 w-12">
          <AvatarFallback>
            {vote.user.personalNames[0][0]}
            {vote.user.familyName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">
            {vote.user.personalNames.join(' ')} {vote.user.familyName}
          </p>
          <p className="text-sm text-muted-foreground">
            {vote.user.roles.map(role => role.toLocaleLowerCase()).join(', ')}
          </p>
        </div>
        <div className="hidden flex-1 sm:block">
          <Badge
            variant="outline"
            className={cn('text-white', getVoteStatusColor(vote.status))}
          >
            {vote.status}
          </Badge>
          <p className="mt-1 text-sm text-muted-foreground">
            {vote.voteSelections
              .map(
                selection =>
                  allChoices.find(choice => choice.id === selection.candidateId)
                    ?.value,
              )
              .join(', ')}
          </p>
        </div>
        <div className="flex flex-col justify-center">
          {isProposalActive ? (
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings2 className="h-4 w-4" />
              </Button>
            </SheetTrigger>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" disabled>
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-center text-muted-foreground">
                    Proposal is not active
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      <SheetContent
        side="right"
        className="flex w-full max-w-full items-center justify-center sm:w-3/4 sm:max-w-screen-xl"
      >
        <div className="flex w-full flex-col items-center gap-8 md:w-2/3 lg:w-1/2">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>
                {vote.user.personalNames[0][0]}
                {vote.user.familyName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-semibold">
                {vote.user.personalNames.join(' ')} {vote.user.familyName}
              </h3>
              <p className="text-muted-foreground">
                {vote.user.roles
                  .map(role => role.toLocaleLowerCase())
                  .join(', ')}
              </p>
            </div>
          </div>
          <div className="w-full space-y-4">
            <div
              className={cn('flex items-center justify-between', {
                'text-destructive': choiceOverflow,
              })}
            >
              <p className="text-xl font-medium">
                Choice Count: {maxChoiceCount}
              </p>
              {permissions?.canEditChoiceCount && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    navigate(
                      PROPOSAL_HREFS.MANAGER_OVERVIEW(
                        'candidates',
                        vote.proposalId,
                      ),
                    )
                  }
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <div className="space-y-2">
                {choices.map(choice => (
                  <Button
                    key={choice.id}
                    variant={choice.selected ? 'secondary' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => handleChoiceClick(choice)}
                  >
                    <Checkbox
                      checked={choice.selected}
                      className="mr-2 h-4 w-4"
                    />
                    <span className="flex-1 text-left">{choice.value}</span>
                    {choice.selected && <Check className="h-4 w-4" />}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="flex w-full justify-center gap-4">
            {permissions?.canOfferVoteSuggestions && (
              <Button onClick={handleSuggestionOffer} className="flex-1">
                Save Suggestions
              </Button>
            )}
            {permissions?.canChangeVoteStatus && (
              <ConfirmDialog
                triggerButton={{
                  text:
                    vote.status === VoteStatus.DISABLED ? 'Enable' : 'Disable',
                  variant:
                    vote.status === VoteStatus.DISABLED
                      ? 'default'
                      : 'destructive',
                  className: 'flex-1',
                }}
                confirmButton={{
                  variant:
                    vote.status === VoteStatus.DISABLED
                      ? 'default'
                      : 'destructive',
                  className: 'flex-1',
                }}
                cancelButton={{
                  variant: 'outline',
                  className: 'flex-1',
                }}
                dialogTitle={`${vote.status === VoteStatus.DISABLED ? 'Enable' : 'Disable'} User's Vote`}
                dialogDescription={`Are you sure you want to ${vote.status === VoteStatus.DISABLED ? 'enable' : 'disable'} this user's vote? This action will ${vote.status === VoteStatus.DISABLED ? 'allow' : 'prevent'} the user from voting.`}
                handleConfirm={handleStatusToggle}
              />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
