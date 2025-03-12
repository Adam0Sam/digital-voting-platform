import { Proposal, ProposalStatus } from '@ambassador';
import { StatusBadgeProps } from '@/components/StatusBadge';
import {
  CalendarRange,
  CheckCircle,
  Clock,
  FileText,
  XOctagon,
  AlertTriangle,
} from 'lucide-react';
import { getTimeLeft } from '@/lib/time-left';

type ProposalStatusInfo = {
  badgeStatus: StatusBadgeProps['status'];
  statusText: string;
  StatusIcon: typeof FileText;
  timeLeftText: string;
};

export function getProposalStatusInfo(
  proposalData: Omit<Proposal, 'managers'>,
): ProposalStatusInfo {
  const { hasStarted, hasEnded, timeLeft } = getTimeLeft(
    proposalData.startDate,
    proposalData.endDate,
  );

  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  const timeLeftText = `${daysLeft}d ${hoursLeft}h`;

  switch (proposalData.status) {
    case ProposalStatus.DRAFT:
      return {
        badgeStatus: 'draft',
        statusText: 'Draft',
        StatusIcon: FileText,
        timeLeftText: '',
      };
    case ProposalStatus.ACTIVE:
      if (!hasStarted) {
        return {
          badgeStatus: 'pending',
          statusText: `Starts in ${timeLeftText}`,
          StatusIcon: Clock,
          timeLeftText,
        };
      } else if (!hasEnded) {
        return {
          badgeStatus: 'active',
          statusText: `Ends in ${timeLeftText}`,
          StatusIcon: CalendarRange,
          timeLeftText,
        };
      } else {
        return {
          badgeStatus: 'resolved',
          statusText: 'Voting Ended',
          StatusIcon: CheckCircle,
          timeLeftText: '',
        };
      }
    case ProposalStatus.RESOLVED:
      return {
        badgeStatus: 'resolved',
        statusText: 'Resolved',
        StatusIcon: CheckCircle,
        timeLeftText: '',
      };
    case ProposalStatus.ABORTED:
      return {
        badgeStatus: 'aborted',
        statusText: 'Aborted',
        StatusIcon: XOctagon,
        timeLeftText: '',
      };
    default:
      return {
        badgeStatus: 'pending',
        statusText: 'Unknown',
        StatusIcon: AlertTriangle,
        timeLeftText: '',
      };
  }
}
