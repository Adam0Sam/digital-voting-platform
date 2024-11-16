import { useManagerProposal } from './ProposalManagePage';
import UserPatternSelectionGrid, {
  UserPatternSelectionGridHandles,
} from '@/components/forms/user/user-pattern/UserPatternSelectionGrid';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useRef } from 'react';
import { api } from '@/lib/api';
import { PenBox } from 'lucide-react';

export default function UserPatternPage() {
  const { proposal, permissions } = useManagerProposal();
  const selectionGridRef = useRef<UserPatternSelectionGridHandles>(null);

  const handleConfirm = () => {
    if (!selectionGridRef.current)
      throw new Error('Selection grid ref is null');

    api.proposals.updateOne(proposal.id, {
      userPattern: {
        grades: selectionGridRef.current.getSelectedGrades() ?? [],
        roles: selectionGridRef.current.getSelectedRoles() ?? [],
      },
    });
  };

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
        <ConfirmDialog
          triggerButton={{
            text: (
              <div className="flex items-center gap-4">
                Update Pattern <PenBox />
              </div>
            ),
            variant: 'default',
          }}
          confirmButton={{
            text: 'Update Pattern',
            variant: 'default',
            className: 'flex-[3]',
          }}
          cancelButton={{
            variant: 'secondary',
            className: 'flex-[2]',
          }}
          dialogTitle="Update User Pattern"
          dialogDescription="Are you sure you want to update the user pattern? This may affect which users can vote on this proposal."
          handleConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
