import ProposalCard, {
  tempProposalData,
} from '@/components/proposal/ProposalCard';
import { ProposalApi } from '@/lib/api';
import { useLoaderData } from 'react-router-dom';

export default function ProposalsManagerPage() {
  const [ownerProposals, reviewerProposals] = useLoaderData() as [
    tempProposalData[],
    tempProposalData[],
  ];

  return (
    <div>
      <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(10rem,25rem))] gap-16 px-16">
        {ownerProposals.map(proposal => (
          <ProposalCard proposalData={proposal} key={proposal.id} />
        ))}
      </div>
      <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(10rem,25rem))] gap-16 px-16">
        {reviewerProposals.map(proposal => (
          <ProposalCard proposalData={proposal} key={proposal.id} />
        ))}
      </div>
    </div>
  );
}

export async function loader() {
  return await Promise.all([
    ProposalApi.getOwnerProposals(),
    ProposalApi.getReviewerProposals(),
  ]);
}
