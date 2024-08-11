import TitleDescriptionForm from '@/components/forms/TitleDescriptionForm';
import { useManagerProposal } from './ProposalManagePage';
import { api } from '@/lib/api';

export default function ContentOverviewPage() {
  const { proposal, permissions } = useManagerProposal();
  return (
    <div className="mt-8 flex justify-center">
      <TitleDescriptionForm
        titleLabel="Proposal Title"
        defaultTitle={proposal.title}
        titleEditDisabled={!permissions.canEditTitle}
        descriptionLabel="Proposal Description"
        defaultDescription={proposal.description}
        descriptionEditDisabled={!permissions.canEditDescription}
        disableSubmit={
          !permissions.canEditTitle && !permissions.canEditDescription
        }
        onSubmit={data => api.proposals.updateOne(proposal.id, data)}
      />
    </div>
  );
}
