import { tempProposalData } from '@/components/proposal/ProposalCard';
import { ProposalApi } from '@/lib/api';
import { useLoaderData } from 'react-router-dom';

export default function VoteProposalsPage() {
  const proposals = useLoaderData() as tempProposalData[];
  console.log('Proposals: ', proposals);
  return <h1>Vote Proposals</h1>;
}

export async function loader() {
  return (await ProposalApi.getVoterProposals()) as tempProposalData[];
}
