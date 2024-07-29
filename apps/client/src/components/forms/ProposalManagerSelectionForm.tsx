import { User } from '@/types';
import { ExtendedFormProps } from './interface';
import { FC, useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import UserSelectionTable from '../tables/user/UserSelectionTable';
import FormHandleButtons from './FormHandleButtons';
import { ScrollArea } from '../ui/scroll-area';
import { UserMinus, UserPlus } from 'lucide-react';
import { StringifiedUser } from '../tables/user/UserColumns';
import { Separator } from '../ui/separator';
import useSignedInUser from '@/context/userContext';
import getNormalizedTableUsers from '../tables/user/utils/normalize-users';

type FormValues = { owners: User[]; reviewers: User[] };
export type UserSelectionFormProps = ExtendedFormProps<FormValues>;

const SelectedUserScrollArea = ({
  users,
  handleRemove,
}: {
  users: User[];
  handleRemove: (user: User) => void;
}) => (
  <ScrollArea className="h-48">
    {users.map(user => {
      return (
        <div
          className="mb-4 flex items-center justify-between gap-12 rounded-md border px-2 py-4"
          key={user.id}
        >
          <p>
            {user.personalNames.join(' ')}, {user.familyName}
          </p>
          <Button variant="ghost" onClick={() => handleRemove(user)}>
            <UserMinus size={22} />
          </Button>
        </div>
      );
    })}
  </ScrollArea>
);

const enum SelectionType {
  Owners,
  Reviewers,
}

const ProposalManagerSelectionForm: FC<UserSelectionFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [selectionType, setSelectionType] = useState<SelectionType>(
    SelectionType.Owners,
  );

  const { user: signedInUSer } = useSignedInUser();

  const [selectedOwners, setSelectedOwners] = useState<User[]>([]);
  const [selectedReviewers, setSelectedReviewers] = useState<User[]>([]);

  useEffect(() => {
    if (signedInUSer) {
      setSelectedOwners(prev => [...prev, signedInUSer]);
    }
  }, [signedInUSer?.id]);

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
                  Owners
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
            <SelectedUserScrollArea
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
            <SelectedUserScrollArea
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
            handleSelectionEnd={handleSelectionEnd}
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
        handleSubmitClick={() =>
          onSubmit({ owners: selectedOwners, reviewers: selectedReviewers })
        }
      />
    </div>
  );
};

export default ProposalManagerSelectionForm;
