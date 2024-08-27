import InnerPageNavButtons from '@/components/InnerPageNavButtons';
import ProposalManageDate from '@/components/proposal/manager/ProposalManageDate';
import { useSignedInUser } from '@/lib/hooks/useSignedInUser';
import {
  MANAGER_PROPOSALS_LOADER_ID,
  ManagerProposalsLoaderResolved,
} from '@/lib/loaders';
import { PROPOSAL_HREFS, PROPOSAL_PATHS } from '@/lib/routes';
import { Proposal } from '@/lib/types';
import { ManagerPermissionsDto } from '@/lib/types/proposal-manager.type';
import {
  Outlet,
  useOutletContext,
  useParams,
  useRouteLoaderData,
} from 'react-router-dom';

function buildHrefEntries(proposalId: string) {
  const BASE = `${PROPOSAL_HREFS.MANAGE}/${proposalId}`;
  return {
    Votes: `${BASE}/${PROPOSAL_PATHS.VOTES_OVERVIEW}`,
    Content: `${BASE}/${PROPOSAL_PATHS.CONTENT_OVERVIEW}`,
    Choices: `${BASE}/${PROPOSAL_PATHS.CHOICES_OVERVIEW}`,
  };
}

type ContextType = {
  proposal: Proposal;
  permissions: ManagerPermissionsDto;
};

export default function ProposalManagePage() {
  const { id: proposalId } = useParams();
  const proposals = useRouteLoaderData(
    MANAGER_PROPOSALS_LOADER_ID,
  ) as ManagerProposalsLoaderResolved;

  const proposal = proposals.find(proposal => proposal.id === proposalId);
  const { user: signedInUser } = useSignedInUser();
  const permissions = proposal?.managers.find(
    manager => manager.userId === signedInUser.id,
  )?.role.permissions;

  if (!proposal || !permissions || !proposalId) {
    throw new Response('Proposal not found', { status: 404 });
  }

  return (
    <div className="flex flex-col gap-8 px-10 sm:px-20">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h3 className="text-4xl font-bold">Manager Dashboard</h3>
          <div>
            <ProposalManageDate
              proposal={proposal}
              canEdit={permissions.canEditDates}
            />
          </div>
        </div>
        <InnerPageNavButtons hrefEntries={buildHrefEntries(proposalId)} />
      </div>
      <Outlet context={{ proposal, permissions } satisfies ContextType} />
    </div>
  );
}

export function useManagerProposal() {
  return useOutletContext<ContextType>();
}
