import { User } from '@/types';
import { ExtendedFormProps } from '../interface';
import { FC, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet';
import { Button } from '../../ui/button';
import UserSelectionTable from '../../tables/user/UserSelectionTable';
import FormHandleButtons from '../FormHandleButtons';
import { UserPlus } from 'lucide-react';
import { StringifiedUser } from '../../tables/user/UserColumns';
import { Separator } from '../../ui/separator';
import useSignedInUser from '@/context/userContext';
import getNormalizedTableUsers from '../../tables/user/utils/normalize-users';
import UserScrollArea from './UserScrollArea';
import { cn } from '@/lib/utils';

type FormValues = { owners: User[]; reviewers: User[] };
export type ProposalManagerSelectionFormProps = ExtendedFormProps<FormValues>;

const enum SelectionType {
  Owners,
  Reviewers,
}

const ProposalManagerSelectionForm: FC<ProposalManagerSelectionFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [selectionType, setSelectionType] = useState<SelectionType>(
    SelectionType.Owners,
  );

  const { user: signedInUser } = useSignedInUser();

  const [selectedOwners, setSelectedOwners] = useState<User[]>(
    signedInUser ? [signedInUser] : [],
  );
  const [selectedReviewers, setSelectedReviewers] = useState<User[]>([]);

  const [error, setError] = useState<string | null>(null);

  const removeUser = (targetUser: User, selectionType: SelectionType) => {
    if (selectionType === SelectionType.Owners) {
      setSelectedOwners(
        selectedOwners.filter(user => user.id !== targetUser.id),
      );
    } else {
      setSelectedReviewers(
        selectedReviewers.filter(user => user.id !== targetUser.id),
      );
    }
  };

  const handleSelectionEnd = (selectedUsers: Partial<StringifiedUser>[]) => {
    const normalizedUsers = getNormalizedTableUsers(selectedUsers);

    if (selectionType === SelectionType.Owners) {
      setSelectedOwners(normalizedUsers);
    } else {
      setSelectedReviewers(normalizedUsers);
    }

    setSheetIsOpen(false);
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
        <div className="flex flex-1 flex-col gap-16 md:flex-row">
          <div className="flex-1">
            <SheetTrigger asChild>
              <div>
                <div className="flex items-center justify-between">
                  <p className={cn({ 'text-destructive': error })}>Owners</p>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectionType(SelectionType.Owners);
                    }}
                  >
                    <UserPlus />
                  </Button>
                </div>
                <Separator className="mb-5 mt-2" />
              </div>
            </SheetTrigger>
            {error && <p className="text-md text-destructive">{error}</p>}
            <UserScrollArea
              users={selectedOwners}
              handleRemove={(user: User) =>
                removeUser(user, SelectionType.Owners)
              }
            />
          </div>
          <div className="flex-1">
            <SheetTrigger asChild>
              <div>
                <div className="flex items-center justify-between">
                  Reviewers
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectionType(SelectionType.Reviewers);
                    }}
                  >
                    <UserPlus />
                  </Button>
                </div>
                <Separator className="mb-5 mt-2" />
              </div>
            </SheetTrigger>
            <UserScrollArea
              users={selectedReviewers}
              handleRemove={(user: User) => {
                removeUser(user, SelectionType.Reviewers);
              }}
            />
          </div>
        </div>
        <SheetContent
          side="right"
          // TODO: Make this a generic classname?
          className="w-full max-w-full sm:w-3/4 sm:max-w-screen-xl"
        >
          <UserSelectionTable
            handleSelectionEnd={selectedUsers => {
              setError(null);
              handleSelectionEnd(selectedUsers);
            }}
            selectedUsers={
              selectionType === SelectionType.Owners
                ? selectedOwners
                : selectedReviewers
            }
          />
        </SheetContent>
      </Sheet>
      <FormHandleButtons
        formSubmitLabel="Next"
        handleCancelClick={onCancel}
        handleSubmitClick={() => {
          if (selectedOwners.length === 0) {
            setError('At least one owner is required');
            return;
          }
          setError(null);
          onSubmit({ owners: selectedOwners, reviewers: selectedReviewers });
        }}
      />
    </div>
  );
};

export default ProposalManagerSelectionForm;
