import CandidateForm, {
  CandidateFormHandles,
} from '@/components/forms/candidate-selection/CandidateForm';
import { useManagerProposal } from './ProposalManagePage';
import { PenBoxIcon } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useRef, useState } from 'react';
import { api } from '@/lib/api';

export default function CandidateOverviewPage() {
  const { proposal, permissions } = useManagerProposal();
  const [error, setError] = useState<string | null>(null);
  const candidateFormRef = useRef<CandidateFormHandles>(null);

  return (
    <div className="mt-20 flex items-center justify-center">
      <CandidateForm
        initialCandidates={proposal.candidates}
        formSubmitLabel="Edit Choices"
        disableEdit={!permissions.canEditCandidates}
        disableSubmit={!permissions.canEditCandidates}
        initialChoiceCount={proposal.choiceCount}
        ref={candidateFormRef}
        className="max-w-lg"
        errorMessage={error}
      >
        <ConfirmDialog
          triggerButton={{
            text: (
              <div className="flex items-center gap-4">
                Edit Choices <PenBoxIcon />
              </div>
            ),
            variant: 'default',
          }}
          confirmButton={{
            text: 'Edit Choices',
            variant: 'default',
            className: 'flex-[3]',
          }}
          cancelButton={{
            variant: 'secondary',
            className: 'flex-[2]',
          }}
          dialogDescription="Editing choices will reset all votes."
          handleConfirm={() => {
            if (candidateFormRef.current?.getCandidates().length === 0) {
              console.error('Please add at least one candidate.');
              setError('Please add at least one candidate.');
              return;
            }
            api.proposals.updateOne(proposal.id, {
              candidates: candidateFormRef.current?.getCandidates() ?? [],
              choiceCount: candidateFormRef.current?.getChoiceCount() ?? 1,
            });
          }}
        />
      </CandidateForm>
    </div>
  );
}
