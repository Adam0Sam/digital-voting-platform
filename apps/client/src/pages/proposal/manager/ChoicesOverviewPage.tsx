import CandidateForm, {
  CandidateFormHandles,
} from '@/components/forms/candidate-selection/CandidateForm';
import { useManagerProposal } from './ProposalManagePage';
import { PenBoxIcon } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useRef } from 'react';
import { api } from '@/lib/api';

export default function ChoicesOverviewPage() {
  const { proposal, permissions } = useManagerProposal();
  const choiceFormRef = useRef<CandidateFormHandles>(null);

  return (
    <div className="mt-20 flex items-center justify-center">
      <CandidateForm
        initialCandidates={proposal.candidates}
        formSubmitLabel="Edit Choices"
        disableEdit={!permissions.canEditCandidates}
        disableSubmit={!permissions.canEditCandidates}
        ref={choiceFormRef}
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
            console.log('choices', choiceFormRef.current?.getChoices());
            api.proposals.updateOne(proposal.id, {
              candidates: choiceFormRef.current?.getChoices() ?? [],
              choiceCount: choiceFormRef.current?.getChoiceCount() ?? 1,
            });
          }}
        />
      </CandidateForm>
    </div>
  );
}
