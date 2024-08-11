import { StandaloneNavLink } from '@/components/nav/NavLinkItem';
import ProposalManageDate from '@/components/proposal/manager/ProposalManageDate';
import { useSignedInUser } from '@/lib/hooks/useSignedInUser';
import {
  MANAGER_PROPOSALS_LOADER_ID,
  ManagerProposalsLoaderReturnType,
} from '@/lib/loaders';
import { PROPOSAL_HREFS, PROPOSAL_PATHS } from '@/lib/routes';
import { Proposal } from '@/lib/types';
import { ManagerPermissionsDto } from '@/lib/types/proposal-manager.type';

import { cn } from '@/lib/utils';
import {
  Outlet,
  useOutletContext,
  useParams,
  useRouteLoaderData,
} from 'react-router-dom';

function buildHrefs(proposalId: string) {
  return {
    Votes: `${PROPOSAL_HREFS.MANAGE}/${proposalId}/${PROPOSAL_PATHS.VOTES_OVERVIEW}`,
    Content: `${PROPOSAL_HREFS.MANAGE}/${proposalId}/${PROPOSAL_PATHS.CONTENT_OVERVIEW}`,
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
  ) as ManagerProposalsLoaderReturnType;

  const proposal = proposals.find(proposal => proposal.id === proposalId);
  const signedInUser = useSignedInUser();
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
        <div className="flex max-w-max rounded-md border-2 border-secondary">
          {Object.entries(buildHrefs(proposalId)).map(([key, href], index) => (
            <StandaloneNavLink
              key={key}
              to={href}
              title={key}
              titleAlign="center"
              titleClassName="text-md"
              className={cn('min-w-0 flex-1 rounded-none px-6 py-6', {
                'rounded-l-md': index === 0,
                'rounded-r-md':
                  index === Object.keys(buildHrefs(proposalId)).length - 1,
              })}
            />
          ))}
        </div>
      </div>
      <Outlet context={{ proposal, permissions } satisfies ContextType} />
    </div>
  );
}

export function useManagerProposal() {
  return useOutletContext<ContextType>();
}
