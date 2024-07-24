import { User } from '@/types';
import { ExtendedFormProps } from './interface';
import { FC, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import UserSelectionTable from '../tables/user/UserSelectionTable';

type FormValues = { owners: User[]; reviewers: User[] };
export type UserSelectionFormProps = ExtendedFormProps<FormValues>;

const UserSelectionForm: FC<UserSelectionFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);

  return (
    <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          Select Owners
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full max-w-full sm:w-3/4 sm:max-w-screen-xl"
      >
        <UserSelectionTable />
      </SheetContent>
    </Sheet>
  );
};

export default UserSelectionForm;
