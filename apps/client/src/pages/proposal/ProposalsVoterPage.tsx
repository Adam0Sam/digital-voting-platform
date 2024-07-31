import ProposalCard, {
  tempProposalData,
} from '@/components/proposal/ProposalCard';
import { ProposalApi } from '@/lib/api';
import { useLoaderData } from 'react-router-dom';

export default function ProposalsVoterPage() {
  const proposals = useLoaderData() as tempProposalData[];
  return (
    <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(10rem,25rem))] gap-16 px-16">
      {proposals.map(proposal => (
        <ProposalCard proposalData={proposal} key={proposal.id} />
      ))}
    </div>
  );
}

export async function loader() {
  return (await ProposalApi.getVoterProposals()) as tempProposalData[];
}
