import InnerPageNavLinks from '@/components/nav/InnerPageNavLinks';
import ProposalManageDate from '@/components/proposal/manager/ProposalManageDate';
import { useSignedInUser } from '@/lib/hooks/useSignedInUser';
import { LOADER_IDS, useLoadedData } from '@/lib/loaders';
import { PROPOSAL_HREFS, PROPOSAL_PATHS } from '@/lib/routes';
import { ManagerPermissions, Proposal } from '@ambassador';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';

function getLinks(proposalId: string) {
  const BASE = `${PROPOSAL_HREFS.MANAGE}/${proposalId}`;
  return [
    {
      title: 'Votes',
      href: `${BASE}/${PROPOSAL_PATHS.VOTES_OVERVIEW}`,
    },
    {
      title: 'Content',
      href: `${BASE}/${PROPOSAL_PATHS.CONTENT_OVERVIEW}`,
    },
    {
      title: 'Choices',
      href: `${BASE}/${PROPOSAL_PATHS.CHOICES_OVERVIEW}`,
    },
    {
      title: 'Pattern',
      href: `${BASE}/${PROPOSAL_PATHS.PATTERN_OVERVIEW}`,
    },
  ];
}

type ContextType = {
  proposal: Proposal;
  permissions: ManagerPermissions;
};

export default function ProposalManagePage() {
  const { id: proposalId } = useParams();
  const proposals = useLoadedData(LOADER_IDS.MANAGER_PROPOSALS);
  const proposal = proposals.find(proposal => proposal.id === proposalId);

  if (!proposal) {
    throw new Response('Proposal not found', { status: 404 });
  }

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
          <h3 className="text-4xl font-bold">Dashboard</h3>
          <div>
            <ProposalManageDate
              proposal={proposal}
              canEdit={permissions.canEditDates}
            />
          </div>
        </div>
        <InnerPageNavLinks
          links={getLinks(proposalId)}
          // forceFirstActive={true}
        />
      </div>
      <Outlet context={{ proposal, permissions } satisfies ContextType} />
    </div>
  );
}

export function useManagerProposal() {
  return useOutletContext<ContextType>();
}
