import { tempProposalData } from '@/components/proposal/ProposalCard';
import { ProposalApi } from '@/lib/api';
import { useLoaderData } from 'react-router-dom';

export default function ManageProposalsPage() {
  const [ownerProposals, reviewerProposals] = useLoaderData() as [
    tempProposalData[],
    tempProposalData[],
  ];
  console.log(ownerProposals, reviewerProposals);
  return <h1>Manage Proposals</h1>;
}

export async function loader() {
  return await Promise.all([
    ProposalApi.getOwnerProposals(),
    ProposalApi.getReviewerProposals(),
  ]);
}
