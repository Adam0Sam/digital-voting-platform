import { ProposalApi } from '@/lib/api';
import { ProposalStatus, ProposalVisibility } from '@/lib/types/proposal.type';
import { Params, useLoaderData } from 'react-router-dom';

export const ProposalEndpointVisibilityMap: Record<string, ProposalVisibility> =
  {
    public: ProposalVisibility.PUBLIC,
    restricted: ProposalVisibility.RESTRICTED,
    manager_only: ProposalVisibility.MANAGER_ONLY,
  };

export default function ProposalVisibilityPage() {
  const data = useLoaderData();
  console.log('proposals: ', data);
  return <h1>ate</h1>;
}

export const loader = async ({ params }: { params: Params<string> }) => {
  if (!params.visibility || !ProposalEndpointVisibilityMap[params.visibility]) {
    throw new Response(`Invalid visibility parameter: ${params.visibility}`, {
      status: 400,
    });
  }
  const proposals = await ProposalApi.getProposalCategories(
    ProposalEndpointVisibilityMap[params.visibility],
  );
  return proposals;
};
