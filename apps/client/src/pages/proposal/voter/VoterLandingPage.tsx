import VoterCard from '@/components/proposal/voter/VoterCard';
import {
  VOTER_PROPOSALS_LOADER_ID,
  VoterProposalsLoaderReturnType,
} from '@/lib/loaders';

import { useRouteLoaderData } from 'react-router-dom';

export default function VoterLandingPage() {
  const proposals = useRouteLoaderData(
    VOTER_PROPOSALS_LOADER_ID,
  ) as VoterProposalsLoaderReturnType;

  return (
    <div className="mx-8 mt-10 flex flex-wrap justify-center gap-12 md:mx-12">
      {proposals.map(proposal => (
        <VoterCard
          proposalData={proposal}
          voteData={proposal.votes[0]}
          className="h-80 max-w-screen-sm flex-1 basis-60"
          key={proposal.id}
        />
      ))}
    </div>
  );
}
