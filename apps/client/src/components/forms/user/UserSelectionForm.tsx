import { StringifiedUser, User } from '@/lib/types';
import { ExtendedFormProps } from '../interface';
import { FC, ReactNode, useState } from 'react';
import getNormalizedTableUsers from '@/components/tables/user/utils/normalize-users';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import UserSelectionTable from '@/components/tables/user/UserSelectionTable';
import FormHandleButtons from '../FormHandleButtons';
import UserScrollArea from './UserScrollArea';

type FormValues = User[];
export type UserSelectionFormProps = ExtendedFormProps<FormValues>;

const UserSelectionForm: FC<
  UserSelectionFormProps & { children?: ReactNode }
> = ({ onSubmit, onCancel, children }) => {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const removeUser = (targetUser: User) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== targetUser.id));
  };

  const handleSelectionEnd = (selectedUsers: Partial<StringifiedUser>[]) => {
    const normalizedUsers = getNormalizedTableUsers(selectedUsers);
    setSelectedUsers(normalizedUsers);
    setSheetIsOpen(false);
  };

  return (
    <div className="flex max-w-lg flex-1 flex-col gap-8">
      <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
        <div className="flex flex-col-reverse gap-10 md:flex-row">
          <div className="flex flex-1 flex-col">
            <SheetTrigger asChild className="flex-1">
              <div>
                <div className="flex items-center justify-between">
                  <p className={cn({ 'text-destructive': error })}>
                    Selected Users
                  </p>
                  <Button variant="ghost">
                    <UserPlus />
                  </Button>
                </div>
                <Separator className="mb-5 mt-2" />
              </div>
            </SheetTrigger>
            {error && <p className="text-md text-destructive">{error}</p>}
            <UserScrollArea users={selectedUsers} handleRemove={removeUser} />
          </div>
          <div className="self-center md:self-auto">{children}</div>
        </div>
        <SheetContent
          side="right"
          className="w-full max-w-full sm:w-3/4 sm:max-w-screen-xl"
        >
          <UserSelectionTable
            handleSelectionEnd={selectedUsers => {
              setError(null);
              handleSelectionEnd(selectedUsers);
            }}
            selectedUsers={selectedUsers}
          />
        </SheetContent>
      </Sheet>
      <FormHandleButtons
        formSubmitLabel="Next"
        formCancelLabel="Cancel"
        handleSubmitClick={() => {
          if (selectedUsers.length === 0) {
            setError('Please add at least one user to the list');
            return;
          }
          setError(null);
          onSubmit(selectedUsers);
        }}
        handleCancelClick={onCancel}
      />
    </div>
  );
};

export default UserSelectionForm;
