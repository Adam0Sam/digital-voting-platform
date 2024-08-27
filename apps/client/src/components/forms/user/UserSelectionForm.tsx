import { User } from '@/lib/types';
import { ExtendedFormProps } from '../interface';
import { FC, PropsWithChildren, ReactNode, useEffect, useState } from 'react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import UserSelectionTable from '@/components/tables/user/UserSelectionTable';
import FormHandleButtons from '../FormHandleButtons';
import UserScrollArea from '../../UserScrollArea';
import { TablifiedUser } from '@/components/tables/user/table.types';
import { normalizeUser } from '@/components/tables/user/utils';

type FormValues = User[];
export type UserSelectionFormProps = ExtendedFormProps<FormValues> & {
  onSelectionEnd?: (selectedUsers: User[]) => void;
  onUserRemove?: (user: User) => void;
  initiallySelectedUsers?: User[];
  UserItemUtilComponent?: ReactNode;
  className?: string;
};

const UserSelectionForm: FC<PropsWithChildren<UserSelectionFormProps>> = ({
  onSubmit,
  onCancel,
  children,
  initiallySelectedUsers = [],
  onSelectionEnd,
  onUserRemove,
  UserItemUtilComponent,
  disableSubmit,
  disableCancel,
  className,
}) => {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>(
    initiallySelectedUsers,
  );
  const [error, setError] = useState<string | null>(null);

  const removeUser = (targetUser: User) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== targetUser.id));
  };

  const handleSelectionEnd = (selectedUsers: Partial<TablifiedUser>[]) => {
    const normalizedUsers = selectedUsers.map(normalizeUser);
    console.log('normalizedUsers', normalizedUsers);
    setSelectedUsers(normalizedUsers);
    setSheetIsOpen(false);
    onSelectionEnd?.(normalizedUsers);
  };

  useEffect(() => {
    setSelectedUsers(initiallySelectedUsers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn('flex max-w-lg flex-1 flex-col gap-8', className)}>
      <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
        <div
          className={cn('flex flex-col-reverse md:flex-row', {
            'gap-10': !!children,
          })}
        >
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
            <UserScrollArea
              users={selectedUsers}
              handleRemove={user => {
                removeUser(user);
                onUserRemove?.(user);
              }}
            >
              {UserItemUtilComponent}
            </UserScrollArea>
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
          onSubmit?.(selectedUsers);
        }}
        handleCancelClick={onCancel}
        enableSubmit={!disableSubmit}
        enableCancel={!disableCancel}
      />
    </div>
  );
};

export default UserSelectionForm;
