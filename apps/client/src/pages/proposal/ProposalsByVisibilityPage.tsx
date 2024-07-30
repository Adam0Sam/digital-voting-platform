import { ProposalApi } from '@/lib/api';
import { ProposalStatus, ProposalVisibility } from '@/lib/types/proposal.type';
import { Params, useLoaderData } from 'react-router-dom';

export const proposalVisibilityValueMap: Record<string, ProposalVisibility> = {
  public: ProposalVisibility.PUBLIC,
  restricted: ProposalVisibility.RESTRICTED,
  manager_only: ProposalVisibility.MANAGER_ONLY,
};

export default function ProposalByVisibilityPage() {
  const data = useLoaderData();
  console.log('proposals: ', data);
  return <h1>ate</h1>;
}

export const loader = async ({ params }: { params: Params<string> }) => {
  if (!params.visibility || !proposalVisibilityValueMap[params.visibility]) {
    throw new Response(`Invalid visibility parameter: ${params.visibility}`, {
      status: 400,
    });
  }
  // const proposals = await ProposalApi.getAllSpecificProposals(
  //   proposalVisibilityValueMap[params.visibility],
  //   ProposalStatus.DRAFT,
  // );
  const proposals = await ProposalApi.getProposalsByVisibility(
    proposalVisibilityValueMap[params.visibility],
  );
  return proposals;
};
