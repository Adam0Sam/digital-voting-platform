import VoterCard from '@/components/proposal/VoterCard';
import {
  VOTER_PROPOSALS_LOADER_ID,
  VoterProposalsLoaderReturnType,
} from '@/lib/loaders';
import { Vote } from '@/lib/types';

import { useRouteLoaderData } from 'react-router-dom';

export default function VoterLandingPage() {
  const [proposals, userVotes] = useRouteLoaderData(
    VOTER_PROPOSALS_LOADER_ID,
  ) as VoterProposalsLoaderReturnType;

  return (
    <div className="mx-8 mt-10 flex flex-wrap justify-center gap-12 md:mx-12">
      {proposals.map(proposal => (
        <VoterCard
          proposalData={proposal}
          voteData={
            userVotes.find(vote => vote.proposalId === proposal.id) as Vote
          }
          className="max-w-70 h-80 flex-1 basis-60"
          key={proposal.id}
        />
      ))}
    </div>
  );
}
