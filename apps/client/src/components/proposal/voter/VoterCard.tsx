import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import StatusBadge from '@/components/StatusBadge';
import { PROPOSAL_HREFS } from '@/lib/routes';
import { Proposal, Vote, VoteStatus } from '@ambassador';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTimeLeft } from '@/lib/time-left';
import { getProposalStatusInfo, getVoteStatusInfo } from '@/lib/get-status';

export default function VoterCard({
  proposalData,
  voteData,
  className,
}: {
  proposalData: Omit<Proposal, 'managers'>;
  voteData: Vote;
  className?: string;
}) {
  const { hasStarted } = getTimeLeft(
    proposalData.startDate,
    proposalData.endDate,
  );

  const proposalStatusInfo = getProposalStatusInfo(proposalData);
  const voteStatusInfo = getVoteStatusInfo(voteData.status);

  return (
    <Card className={cn('flex flex-col justify-between shadow-lg', className)}>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <StatusBadge status={proposalStatusInfo.badgeStatus}>
            {proposalStatusInfo.statusText}
          </StatusBadge>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <proposalStatusInfo.StatusIcon className="h-4 w-4" />
                <span className="sr-only">View calendar</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={
                  !hasStarted
                    ? new Date(proposalData.startDate)
                    : new Date(proposalData.endDate)
                }
                defaultMonth={
                  !hasStarted
                    ? new Date(proposalData.startDate)
                    : new Date(proposalData.endDate)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <CardTitle className="line-clamp-2 text-xl">
          {proposalData.title}
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {proposalData.description || (
            <p className="italic">No description provided</p>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'flex items-center gap-2 font-medium',
            voteStatusInfo.color,
          )}
        >
          <voteStatusInfo.icon className="h-5 w-5" />
          <span>{voteStatusInfo.text}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className="w-full"
          disabled={
            voteData.status === VoteStatus.DISABLED ||
            proposalData.status !== 'ACTIVE'
          }
        >
          <Link
            to={PROPOSAL_HREFS.VOTE(proposalData.id)}
            className="flex items-center justify-center gap-2"
          >
            {proposalData.status === 'ACTIVE' &&
            voteData.status === VoteStatus.PENDING
              ? 'Vote Now'
              : 'View Details'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
