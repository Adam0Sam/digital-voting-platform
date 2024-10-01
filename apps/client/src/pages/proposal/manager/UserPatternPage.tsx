import { useManagerProposal } from './ProposalManagePage';
import { UserPatternFormContent } from '@/components/forms/user/user-pattern/UserPatternFormContent';
import FormHandleButtons from '@/components/forms/FormHandleButtons';
import { Grade, UserRole } from '@/lib/types';
import { MultiSelectDropdownHandle } from '@/components/MultiSelectDropdown';
import { useRef } from 'react';
import { api } from '@/lib/api';

export default function UserPatternPage() {
  const { proposal, permissions } = useManagerProposal();
  const gradesDropdownRef = useRef<MultiSelectDropdownHandle<Grade>>(null);
  const rolesDropdownRef = useRef<MultiSelectDropdownHandle<UserRole>>(null);
  console.log(permissions.canEditUserPattern);
  return (
    <div className="mt-16 flex justify-center">
      <UserPatternFormContent
        selectedGrades={proposal.userPattern.grades}
        selectedRoles={proposal.userPattern.roles}
        gradesDropdownRef={gradesDropdownRef}
        rolesDropdownRef={rolesDropdownRef}
      >
        {permissions.canEditUserPattern && (
          <FormHandleButtons
            className="mt-72"
            handleSubmitClick={() => {
              api.proposals.updateOne(proposal.id, {
                userPattern: {
                  grades: gradesDropdownRef.current?.getSelectedItems(),
                  roles: rolesDropdownRef.current?.getSelectedItems(),
                },
              });
            }}
          />
        )}
      </UserPatternFormContent>
    </div>
  );
}
