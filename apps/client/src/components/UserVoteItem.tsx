import { Button } from '@/components/ui/button';
import { Pencil, Settings2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  ProposalChoice,
  Vote,
  VoteStatus,
  VoteStatusOptions,
} from '@/lib/types';
import { useRef, useState } from 'react';
import Combobox, { ComboboxHandle, ComboboxItem } from './Combobox';
import ConfirmDialog from './ConfirmDialog';

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

const comboboxVoteStatusItems: ComboboxItem<VoteStatus>[] = [
  {
    label: 'Resolved',
    value: VoteStatusOptions.RESOLVED,
  },
  {
    label: 'Pending',
    value: VoteStatusOptions.PENDING,
  },
];

const comboboxItemsMap: Record<VoteStatus, ComboboxItem<VoteStatus>> = {
  [VoteStatusOptions.RESOLVED]: comboboxVoteStatusItems[0],
  [VoteStatusOptions.PENDING]: comboboxVoteStatusItems[1],
};

/**
 * State management here is really bad
 */
export default function UserVoteItem({
  vote,
  onFocus,
  onBlur,
  canEditVoteChoices,
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
  canEditVoteChoices?: boolean;
  canCreateVotes?: boolean;
  canDeleteVotes?: boolean;
  canEditChoiceCount?: boolean;
  allChoices: ProposalChoice[];
  maxChoiceCount: number;
  saveVoteEdit?: (
    voteId: string,
    choices: ProposalChoice[],
    status: VoteStatus,
  ) => void;
}) {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [choices, setChoices] = useState<
    (ProposalChoice & { selected: boolean })[]
  >(getSelectedChoices(vote.choices, allChoices));
  const [choiceOverflow, setChoiceOverflow] = useState(false);
  const [voteStatus, setVoteStatus] = useState(vote.status);
  const comboboxRef = useRef<ComboboxHandle<VoteStatus>>(null);

  const handleChoiceClick = (choice: ProposalChoice) => {
    if (!canEditVoteChoices) return;
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
      if (selectedChoicesCount === 0) {
        comboboxRef.current?.setSelectedItem(
          comboboxItemsMap[VoteStatusOptions.PENDING],
        );
        setVoteStatus(VoteStatusOptions.PENDING);
      } else {
        comboboxRef.current?.setSelectedItem(
          comboboxItemsMap[VoteStatusOptions.RESOLVED],
        );
        setVoteStatus(VoteStatusOptions.RESOLVED);
      }
      if (selectedChoicesCount > maxChoiceCount) {
        setChoiceOverflow(true);
      }
      return newChoices;
    });
  };

  const handleVoteEdit = () => {
    if (choiceOverflow) return;
    const selectedChoices = choices.filter(choice => choice.selected);
    if (selectedChoices.length > maxChoiceCount) {
      setChoiceOverflow(true);
      return;
    }
    setChoiceOverflow(false);
    setSheetIsOpen(false);
    const selectedVoteStatus =
      comboboxRef.current?.getSelectedItem()?.value ?? vote.status;
    setVoteStatus(selectedVoteStatus);
    saveVoteEdit?.(vote.id, selectedChoices, selectedVoteStatus);
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
          <p>{voteStatus}</p>
          <p className="text-muted-foreground">
            {vote.choices.map(choice => choice.value).join(', ')}
          </p>
        </div>
        {canEditVoteChoices && (
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
            </div>
            <div className="flex flex-[1] flex-col items-center gap-12">
              {canEditVoteChoices && (
                <Combobox
                  items={comboboxVoteStatusItems}
                  defaultItem={comboboxItemsMap[voteStatus]}
                  handleSelectedValue={(voteStatus: VoteStatus) => {
                    if (voteStatus === VoteStatusOptions.PENDING) {
                      setChoices(prevChoices =>
                        prevChoices.map(choice => ({
                          ...choice,
                          selected: false,
                        })),
                      );
                    }
                  }}
                  ref={comboboxRef}
                />
              )}
            </div>
          </div>
          <div className="flex w-full justify-center gap-8">
            {canEditVoteChoices && (
              <Button onClick={handleVoteEdit} className="flex-[2]">
                <span>Save</span>
              </Button>
            )}
            {canDeleteVotes && (
              <ConfirmDialog
                triggerButton={{
                  text: 'Delete',
                  variant: 'destructive',
                  className: 'flex-1',
                }}
                confirmButton={{
                  variant: 'destructive',
                  className: 'flex-[3]',
                }}
                cancelButton={{
                  variant: 'secondary',
                  className: 'flex-[2]',
                }}
                dialogTitle="Are you sure you want to delete this vote?"
                dialogDescription="This action cannot be undone"
                handleConfirm={() => {
                  console.log('delete vote');
                }}
              />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
