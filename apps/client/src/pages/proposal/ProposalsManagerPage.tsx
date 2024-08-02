import { api } from '@/lib/api';
import { Proposal, ProposalAgentRoles } from '@/lib/types/proposal.type';

import { useLoaderData } from 'react-router-dom';

export default function ProposalsManagerPage() {
  const [ownerProposals, reviewerProposals] = useLoaderData() as [
    Proposal[],
    Proposal[],
  ];

  return <div></div>;
}

export async function loader() {
  return await Promise.all([
    api.proposals.getProposalsByAgentRole(ProposalAgentRoles.OWNER),
    api.proposals.getProposalsByAgentRole(ProposalAgentRoles.REVIEWER),
  ]);
}
