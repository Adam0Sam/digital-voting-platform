import { useManagerProposal } from './ProposalManagePage';
import UserPatternSelectionGrid, {
  UserPatternSelectionGridHandles,
} from '@/components/forms/user/user-pattern/UserPatternSelectionGrid';
import FormHandleButtons from '@/components/forms/FormHandleButtons';
import { useRef } from 'react';
import { api } from '@/lib/api';

export default function UserPatternPage() {
  const { proposal, permissions } = useManagerProposal();
  const selectionGridRef = useRef<UserPatternSelectionGridHandles>(null);
  return (
    <div className="mt-16 flex flex-col items-center">
      <div className="w-full max-w-screen-md">
        <UserPatternSelectionGrid
          initialGrades={proposal.userPattern.grades}
          initialRoles={proposal.userPattern.roles}
          ref={selectionGridRef}
        />
      </div>
      {permissions.canEditUserPattern && (
        <FormHandleButtons
          handleSubmitClick={() => {
            if (!selectionGridRef.current)
              throw new Error('Selection grid ref is null');
            api.proposals.updateOne(proposal.id, {
              userPattern: {
                grades: selectionGridRef.current.getSelectedGrades() ?? [],
                roles: selectionGridRef.current.getSelectedRoles() ?? [],
              },
            });
          }}
        />
      )}
    </div>
  );
}
