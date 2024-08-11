import ManagerCard from '@/components/proposal/manager/ManagerCard';
import {
  MANAGER_PROPOSALS_LOADER_ID,
  ManagerProposalsLoaderReturnType,
} from '@/lib/loaders';
import { useRouteLoaderData } from 'react-router-dom';

export default function ManagerLandingPage() {
  const proposals = useRouteLoaderData(
    MANAGER_PROPOSALS_LOADER_ID,
  ) as ManagerProposalsLoaderReturnType;

  return (
    <div className="mx-8 mt-10 flex flex-wrap justify-center gap-12 md:mx-12">
      {proposals.map(proposal => (
        <ManagerCard
          proposalData={proposal}
          className="max-w-70 h-80 flex-1 basis-60"
          key={proposal.id}
        />
      ))}
    </div>
  );
}
