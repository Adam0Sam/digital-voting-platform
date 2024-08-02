import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { getTimeLeft } from '@/lib/time';
import { Proposal, Vote } from '@/lib/types';

import { CalendarClock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VoterCard({
  proposalData,
  voteData,
}: {
  proposalData: Proposal;
  voteData: Vote;
}) {
  const { hasStarted, hasEnded, timeLeft } = getTimeLeft(
    proposalData.startDate,
    proposalData.endDate,
  );

  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-center">
          <CardTitle className="text-xl">{proposalData.title}</CardTitle>
          <CardDescription>{proposalData.description}</CardDescription>
        </div>
        <CardContent className="flex flex-col items-center p-0 pt-6">
          <Popover>
            <div className="flex items-center gap-2">
              {hasEnded ? 'Ended' : hasStarted ? 'Active' : 'Upcoming'}
              {` until ${daysLeft}d. ${hoursLeft}h.`}
              <PopoverTrigger asChild>
                <Button variant="ghost">
                  <CalendarClock size={24} />
                </Button>
              </PopoverTrigger>
            </div>
            {!hasEnded && (
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
            )}
          </Popover>
          <Button>
            <Link to={`../${proposalData.id}`}>View</Link>
          </Button>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
