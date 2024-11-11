import { useParams, Outlet, useOutletContext } from 'react-router-dom';
import { useSignedInUser } from '@/lib/hooks/useSignedInUser';
import { LOADER_IDS, useLoadedData } from '@/lib/loaders';
import { PROPOSAL_HREFS, PROPOSAL_OVERVIEW_PATHS } from '@/lib/routes';
import { ManagerPermissions, Proposal } from '@ambassador';
import ProposalManageDate from '@/components/proposal/manager/ProposalManageDate';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import InnerPageNavLinks from '@/components/nav/InnerPageNavLinks';
import { APIError } from '@/lib/api';
import { capitalizeFirstLetter } from '@/lib/utils';

type ContextType = {
  proposal: Proposal;
  permissions: ManagerPermissions;
};

export default function ProposalManagePage() {
  const { id: proposalId } = useParams();
  const proposals = useLoadedData(LOADER_IDS.MANAGER_PROPOSALS);
  const proposal = proposals.find(proposal => proposal.id === proposalId);

  const { user: signedInUser } = useSignedInUser();
  const permissions = proposal?.managers.find(
    manager => manager.userId === signedInUser.id,
  )?.role.permissions;

  if (!proposal || !permissions || !proposalId) {
    throw new APIError(
      "Proposal not found or you don't have permission to view it",
      404,
    );
  }

  const links = Object.values(PROPOSAL_OVERVIEW_PATHS).map(path => ({
    title: capitalizeFirstLetter(path),
    href: PROPOSAL_HREFS.MANAGER_OVERVIEW(path, proposalId),
  }));

  return (
    <div className="space-y-4 px-4 py-8">
      <Card className="mb-8 overflow-hidden">
        <CardHeader className="flex flex-col items-center md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col justify-start gap-4">
            <CardTitle className="text-3xl font-bold">
              Proposal Dashboard
            </CardTitle>
            <CardDescription>
              <h2 className="mb-2 text-xl font-semibold">{proposal.title}</h2>
              <p className="text-muted-foreground">{proposal.description}</p>
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-4">
            <ProposalManageDate
              proposal={proposal}
              canEdit={permissions.canEditDates}
              className="w-max"
            />
            <InnerPageNavLinks links={links} />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Outlet context={{ proposal, permissions } satisfies ContextType} />
        </CardContent>
      </Card>
    </div>
  );
}

export function useManagerProposal() {
  return useOutletContext<ContextType>();
}
