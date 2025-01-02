import { VoteStatus } from '@ambassador';
import { AlertTriangle, Ban, CheckCircle } from 'lucide-react';

type VoteStatusInfo = {
  text: string;
  icon: typeof AlertTriangle;
  color: string;
};

export function getVoteStatusInfo(status: VoteStatus): VoteStatusInfo {
  switch (status) {
    case VoteStatus.PENDING:
      return {
        text: 'Not Voted',
        icon: AlertTriangle,
        color: 'text-yellow-500',
      };
    case VoteStatus.RESOLVED:
      return {
        text: 'Vote Submitted',
        icon: CheckCircle,
        color: 'text-green-500',
      };
    case VoteStatus.DISABLED:
      return { text: 'Vote Disabled', icon: Ban, color: 'text-red-500' };
    default:
      return {
        text: 'Unknown Status',
        icon: AlertTriangle,
        color: 'text-gray-500',
      };
  }
}
