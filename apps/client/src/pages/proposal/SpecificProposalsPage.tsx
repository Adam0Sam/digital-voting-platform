import { ProposalStatus } from '@/lib/types/proposal.type';

export const ProposalEndpointStatusMap: Record<string, ProposalStatus> = {
  draft: ProposalStatus.DRAFT,
  active: ProposalStatus.ACTIVE,
  resolved: ProposalStatus.RESOLVED,
  aborted: ProposalStatus.ABORTED,
};

export default function SpecificProposalsPage() {
  return <h1>proposals</h1>;
}
