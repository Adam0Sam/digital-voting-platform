import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PROPOSAL_HREFS } from '@/lib/routes';

import { getTimeLeft } from '@/lib/time';
import { Proposal, Vote, VoteStatus } from '@ambassador';
import { cn } from '@/lib/utils';

import { CalendarClock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VoterCard({
  proposalData,
  voteData,
  className,
}: {
  proposalData: Omit<Proposal, 'managers'>;
  voteData: Vote;
  className?: string;
}) {
  const { hasStarted, hasEnded, timeLeft } = getTimeLeft(
    proposalData.startDate,
    proposalData.endDate,
  );

  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  let timeLeftText: string;
  if (!hasStarted) {
    timeLeftText = `Starts in ${daysLeft}d. ${hoursLeft}h.`;
  } else if (!hasEnded) {
    timeLeftText = `Ends in ${daysLeft}d. ${hoursLeft}h.`;
  } else {
    timeLeftText = 'Has Ended';
  }

  return (
    <Card className={cn('flex flex-col justify-between', className)}>
      <div>
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-xl">{proposalData.title}</CardTitle>
          <CardDescription>{proposalData.description}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-12 p-0">
          <div className="flex flex-col items-center gap-1">
            <Popover>
              <div className="flex items-center gap-2">
                <p>{timeLeftText}</p>
                <PopoverTrigger asChild>
                  <Button variant="ghost">
                    <CalendarClock size={24} />
                  </Button>
                </PopoverTrigger>
              </div>
              <PopoverContent className="w-min">
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
                />
              </PopoverContent>
            </Popover>
            <p>
              {voteData.status === VoteStatus.PENDING
                ? 'submit a vote'
                : 'review your vote'}
            </p>
          </div>
        </CardContent>
      </div>
      <CardFooter>
        <Button className="w-full p-0">
          <Link
            className="flex h-full w-full items-center justify-center"
            to={`${PROPOSAL_HREFS.VOTE}/${proposalData.id}`}
          >
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
