import VoterCard from '@/components/proposal/VoterCard';
import {
  VOTER_PROPOSALS_LOADER_ID,
  VoterProposalsLoaderReturnType,
} from '@/lib/loaders';
import { Vote } from '@/lib/types';

import { useRouteLoaderData } from 'react-router-dom';

export default function ProposalsVoterPage() {
  const [proposals, userVotes] = useRouteLoaderData(
    VOTER_PROPOSALS_LOADER_ID,
  ) as VoterProposalsLoaderReturnType;

  return (
    <div className="mx-8 mt-10 grid grid-cols-[repeat(auto-fit,minmax(10rem,20rem))] gap-16 md:mx-12">
      {proposals.map(proposal => (
        <VoterCard
          proposalData={proposal}
          // TODO
          // Say what you will
          voteData={
            userVotes.find(vote => vote.proposalId === proposal.id) as Vote
          }
          key={proposal.id}
        />
      ))}
    </div>
  );
}
