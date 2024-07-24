import { Grade, Role, User } from '@/types';
import { ExtendedFormProps } from './interface';
import { FC, useCallback, useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import UserSelectionTable from '../tables/user/UserSelectionTable';
import FormHandleButtons from './FormHandleButtons';
import { ScrollArea } from '../ui/scroll-area';
import { UserMinus } from 'lucide-react';
import { StringifiedUser } from '../tables/user/UserColumns';

type FormValues = { owners: User[]; reviewers: User[] };
export type UserSelectionFormProps = ExtendedFormProps<FormValues>;

const SelectedUserScrollArea = ({ users }: { users: User[] }) => (
  <ScrollArea className="h-48">
    {users.map((user, index) => {
      // console.log('user', user);
      const userId = `${user.personalNames.join('_')}-${user.familyName}-${user.roles.join('_')}-${user.grade}`;
      // const userId = index;
      return (
        <div
          className="mb-4 flex items-center justify-between gap-12 rounded-md border px-2 py-4"
          key={userId}
        >
          <p>{userId}</p>
          <Button variant="ghost">
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

const UserSelectionForm: FC<UserSelectionFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [selectionType, setSelectionType] = useState<SelectionType>(
    SelectionType.Owners,
  );

  const [selectedOwners, setSelectedOwners] = useState<User[]>([]);
  const [selectedReviewers, setSelectedReviewers] = useState<User[]>([]);
  //TODO: This is disgusting
  const handleSelectionEnd = (selectedUsers: Partial<StringifiedUser>[]) => {
    const normalizedUsers = selectedUsers.map(user => {
      if (!user.personalNames || !user.familyName || !user.roles) {
        throw new Error(`Necessary info is missing are missing`);
      }

      const personalNames =
        user.personalNames.indexOf(' ') > -1
          ? user.personalNames.split(' ')
          : [user.personalNames];
      const familyName = user.familyName;
      const roles =
        user.roles.indexOf(' ') > -1 ? user.roles.split(' ') : [user.roles];
      //TODO: What does this mean and how do I fix it
      const grade = Grade[user.grade] ?? Grade.NONE;

      return {
        personalNames,
        familyName,
        roles,
        grade,
      };
    });

    if (selectionType === SelectionType.Owners) {
      setSelectedOwners(normalizedUsers);
    } else {
      setSelectedReviewers(normalizedUsers);
    }

    setSheetIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
          <div className="flex gap-5">
            <div>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  onClick={() => {
                    setSelectionType(SelectionType.Owners);
                  }}
                >
                  Select Owners
                </Button>
              </SheetTrigger>
              <SelectedUserScrollArea users={selectedOwners} />
            </div>
            <div>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  onClick={() => {
                    setSelectionType(SelectionType.Reviewers);
                  }}
                >
                  Select Reviewers
                </Button>
              </SheetTrigger>
              <SelectedUserScrollArea users={selectedReviewers} />
            </div>
          </div>
          <SheetContent
            side="right"
            className="w-full max-w-full sm:w-3/4 sm:max-w-screen-xl"
          >
            <UserSelectionTable handleSelectionEnd={handleSelectionEnd} />
          </SheetContent>
        </Sheet>
      </div>
      <FormHandleButtons formSubmitLabel="Next" handleCancelClick={onCancel} />
    </div>
  );
};

export default UserSelectionForm;
