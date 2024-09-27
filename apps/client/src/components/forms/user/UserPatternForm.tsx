import {
  Grade,
  Grades,
  UserPatternDto,
  UserRole,
  UserRoles,
} from '@/lib/types';
import { ExtendedFormProps, WithRequiredSubmit } from '../interface';
import { useRef, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SquareAsterisk } from 'lucide-react';

import MultiSelectDropdown, {
  MultiSelectDropdownHandle,
} from '@/components/MultiSelectDropdown';
import FormHandleButtons from '../FormHandleButtons';

type FormValues = UserPatternDto;
export type UserPatternFormProps = WithRequiredSubmit<
  ExtendedFormProps<FormValues>
> & {
  className?: string;
};

export default function UserPatternForm({
  onSubmit,
  className,
}: UserPatternFormProps) {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const gradesDropdownRef = useRef<MultiSelectDropdownHandle<Grade>>(null);
  const rolesDropdownRef = useRef<MultiSelectDropdownHandle<UserRole>>(null);

  return (
    <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
      <div className="flex flex-col-reverse md:flex-row">
        <div className="flex flex-1 flex-col">
          <SheetTrigger asChild className="flex-1">
            <Button className="max-w-max">
              <div className="flex items-center gap-2">
                <p>Create User Pattern</p>
                <SquareAsterisk />
              </div>
            </Button>
          </SheetTrigger>
        </div>
      </div>
      <SheetContent
        side="right"
        className="flex w-full max-w-full justify-center sm:w-3/4 sm:max-w-screen-md"
      >
        <div className="max-w-sm">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col justify-between">
              <h3 className="text-2xl font-semibold">User Pattern</h3>
              <p className="text-muted-foreground">
                User patterns define the properties a user must have to be
                automatically included in the proposal
              </p>
            </div>
            <div className="flex items-center justify-between">
              <MultiSelectDropdown
                triggerText="Select Grades"
                items={Grades}
                ref={gradesDropdownRef}
              />
              <MultiSelectDropdown
                triggerText="Select Roles"
                items={UserRoles}
                ref={rolesDropdownRef}
              />
            </div>
            <FormHandleButtons
              className="mt-72"
              handleSubmitClick={() => {
                setSheetIsOpen(false);
                onSubmit({
                  grades: gradesDropdownRef.current?.getSelectedItems(),
                  roles: rolesDropdownRef.current?.getSelectedItems(),
                });
              }}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
