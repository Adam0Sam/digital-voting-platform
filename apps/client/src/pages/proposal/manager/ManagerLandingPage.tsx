import ManagerCard from '@/components/proposal/manager/ManagerCard';
import {
  MANAGER_PROPOSALS_LOADER_ID,
  ManagerProposalsLoaderResolved,
} from '@/lib/loaders';
import { useRouteLoaderData } from 'react-router-dom';

export default function ManagerLandingPage() {
  const proposals = useRouteLoaderData(
    MANAGER_PROPOSALS_LOADER_ID,
  ) as ManagerProposalsLoaderResolved;

  return (
    <div className="mx-8 mt-10 flex flex-wrap justify-center gap-12 md:mx-12">
      {proposals.length === 0 && (
        <h1 className="self-center text-4xl text-muted-foreground">
          No proposals available
        </h1>
      )}
      {proposals.map(proposal => (
        <ManagerCard
          proposalData={proposal}
          className="h-80 max-w-screen-sm flex-1 basis-60"
          key={proposal.id}
        />
      ))}
    </div>
  );
}
