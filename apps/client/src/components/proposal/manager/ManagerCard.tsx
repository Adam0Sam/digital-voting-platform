import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { BarChartBigIcon, CalendarClock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { getTimeLeft } from '@/lib/time';
import { Proposal } from '@/lib/types';
import { SingularLabeledBarChart } from '@/components/bar-chart/SingularLabeledChart';
import { getChoiceData } from '@/lib/proposal-data';
import { PROPOSAL_HREFS, PROPOSAL_PATHS } from '@/lib/routes';

export default function ManagerCard({
  proposalData,
  className,
}: {
  proposalData: Proposal;
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

  const { choiceChartData, resolvedVoteCount } = getChoiceData(
    proposalData.choices,
    proposalData.votes,
  );

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
              <div className="flex w-full items-center justify-between gap-2">
                <p>
                  {hasEnded ? 'Ended' : hasStarted ? 'Active' : 'Upcoming'}
                  {` until ${daysLeft}d. ${hoursLeft}h.`}
                </p>
                <PopoverTrigger asChild>
                  <Button variant="ghost">
                    <CalendarClock size={24} />
                  </Button>
                </PopoverTrigger>
              </div>
              <PopoverContent className="w-min">
                <Calendar
                  mode="range"
                  selected={{
                    from: new Date(proposalData.startDate),
                    to: new Date(proposalData.endDate),
                  }}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <div className="flex w-full items-center justify-between gap-2">
                Resolved votes: {resolvedVoteCount}/{proposalData.votes.length}
                <PopoverTrigger asChild>
                  <Button variant="ghost">
                    <BarChartBigIcon size={24} />
                  </Button>
                </PopoverTrigger>
              </div>
              {/*
               * TODO: Make width value dynamic
               */}
              <PopoverContent className="flex w-96 flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold">
                    Votes ({proposalData.votes.length})
                  </h3>
                  <p className="text-muted-foreground">
                    Choices/Vote: {proposalData.choiceCount}
                  </p>
                </div>

                <SingularLabeledBarChart
                  chartData={choiceChartData}
                  dataLabelKey="choiceValue"
                  dataValueKey="choiceVotes"
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </div>
      <CardFooter>
        <Button className="w-full p-0">
          <Link
            className="flex h-full w-full items-center justify-center"
            to={`${PROPOSAL_HREFS.MANAGE}/${proposalData.id}/${PROPOSAL_PATHS.VOTES_OVERVIEW}`}
          >
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
