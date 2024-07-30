import { ProposalApi } from '@/lib/api';
import UserController from '@/lib/user-controller';
import { ProposalStatus, ProposalVisibility } from '@/lib/types/proposal.type';
import { redirect, useLoaderData } from 'react-router-dom';

export default function RestrictedActiveProposalsPage() {
  const proposals = useLoaderData();

  return <h1>labas</h1>;
}

export const loader = async () => {
  const user = UserController.getItem();
  if (!user) return redirect('/signin');
  const proposals = await ProposalApi.getAllSpecificProposals(
    ProposalVisibility.RESTRICTED,
    ProposalStatus.DRAFT,
  );
  console.log('Proposals: ', proposals);
  return proposals;
};
