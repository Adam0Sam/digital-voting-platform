import {
  VOTER_PROPOSALS_LOADER_ID,
  VoterProposalsLoaderReturnType,
} from '@/lib/loaders';
import { useParams, useRouteLoaderData } from 'react-router-dom';

export default function ProposalVotePage() {
  const { id: proposalId } = useParams();
  const [proposals, userVotes] = useRouteLoaderData(
    VOTER_PROPOSALS_LOADER_ID,
  ) as VoterProposalsLoaderReturnType;

  const proposal = proposals.find(proposal => proposal.id === proposalId);
  const userVote = userVotes.find(vote => vote.proposalId === proposalId);

  if (!proposal || !userVote) {
    throw new Response('Proposal not found', { status: 404 });
  }

  console.log(proposal);

  return (
    <div className="flex flex-col items-center gap-5">
      <h3 className="text-6xl">{proposal?.title}</h3>
      <p className="text-2xl text-muted-foreground">
        {proposal?.description || 'Empty'}
      </p>
    </div>
  );
}
