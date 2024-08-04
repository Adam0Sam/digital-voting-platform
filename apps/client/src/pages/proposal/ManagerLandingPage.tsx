import {
  MANAGER_PROPOSALS_LOADER_ID,
  ManagerProposalsLoaderReturnType,
} from '@/lib/loaders';
import { useRouteLoaderData } from 'react-router-dom';

export default function ManagerLandingPage() {
  const proposals = useRouteLoaderData(
    MANAGER_PROPOSALS_LOADER_ID,
  ) as ManagerProposalsLoaderReturnType;
  console.log(proposals);
  return <div></div>;
}
