import { ProposalApi } from '@/lib/api';
import { ProposalVisibility } from '@/lib/types/proposal.type';
import { Params, useLoaderData } from 'react-router-dom';
import ProposalCard, {
  tempProposalData,
} from '@/components/proposal/ProposalCard';

export const proposalVisibilityValueMap: Record<string, ProposalVisibility> = {
  public: ProposalVisibility.PUBLIC,
  restricted: ProposalVisibility.RESTRICTED,
  manager_only: ProposalVisibility.MANAGER_ONLY,
};

export default function ProposalByVisibilityPage() {
  const proposals = useLoaderData() as tempProposalData[];

  return (
    <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(10rem,25rem))] gap-16 px-16">
      {proposals.map(proposal => (
        <ProposalCard proposalData={proposal} key={proposal.id} />
      ))}
    </div>
  );
}

export const loader = async ({ params }: { params: Params<string> }) => {
  if (!params.visibility || !proposalVisibilityValueMap[params.visibility]) {
    throw new Response(`Invalid visibility parameter: ${params.visibility}`, {
      status: 400,
    });
  }
  const proposals = (await ProposalApi.getProposalsByVisibility(
    proposalVisibilityValueMap[params.visibility],
  )) as tempProposalData[];
  return proposals;
};
