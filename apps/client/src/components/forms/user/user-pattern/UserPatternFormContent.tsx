import MultiSelectDropdown, {
  MultiSelectDropdownHandle,
} from '@/components/MultiSelectDropdown';
import { Grade, Grades, UserRole, UserRoles } from '@/lib/types';
import { FC, PropsWithChildren } from 'react';

type UserPatternFormContentProps = {
  gradesDropdownRef?: React.RefObject<MultiSelectDropdownHandle<Grade>>;
  rolesDropdownRef?: React.RefObject<MultiSelectDropdownHandle<UserRole>>;
  selectedGrades?: Grade[];
  selectedRoles?: UserRole[];
};
export const UserPatternFormContent: FC<
  PropsWithChildren<UserPatternFormContentProps>
> = ({
  children,
  gradesDropdownRef,
  rolesDropdownRef,
  selectedGrades,
  selectedRoles,
}) => {
  return (
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
            initiallySelectedItems={selectedGrades}
          />
          <MultiSelectDropdown
            triggerText="Select Roles"
            items={UserRoles}
            ref={rolesDropdownRef}
            initiallySelectedItems={selectedRoles}
          />
        </div>
        {children}
      </div>
    </div>
  );
};
