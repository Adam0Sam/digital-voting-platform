import VoterCard, { tempProposalData } from '@/components/proposal/VoterCard';

import { useRouteLoaderData } from 'react-router-dom';

export default function ProposalsVoterPage() {
  const [proposals, userVotes] = useRouteLoaderData('vote') as [
    tempProposalData[],
  ];

  return (
    <div className="mx-8 mt-10 grid grid-cols-[repeat(auto-fit,minmax(10rem,20rem))] gap-16 md:mx-12">
      {proposals.map(proposal => (
        <VoterCard
          proposalData={proposal}
          voteData={userVotes.find(vote => vote.proposalId === proposal.id)}
          key={proposal.id}
        />
      ))}
    </div>
  );
}
