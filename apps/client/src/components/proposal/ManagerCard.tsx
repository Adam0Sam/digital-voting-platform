import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { BarChartBigIcon, CalendarClock } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { getTimeLeft } from '@/lib/time';
import { Proposal, VoteStatusOptions } from '@/lib/types';
import { SingularLabeledBarChart } from '../bar-chart/SingularLabeledChart';

type choiceChartItem = {
  choiceValue: string;
  choiceVotes: number;
};

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

  const choiceChartDataMap = new Map<string, choiceChartItem>();
  let resolvedVoteCount = 0;

  for (const availableChoice of proposalData.choices) {
    choiceChartDataMap.set(availableChoice.id, {
      choiceValue: availableChoice.value,
      choiceVotes: 0,
    });
  }

  for (const vote of proposalData.votes) {
    if (vote.status !== VoteStatusOptions.RESOLVED) return;
    resolvedVoteCount++;
    for (const voteChoice of vote.choices) {
      if (!choiceChartDataMap.has(voteChoice.id)) continue;
      choiceChartDataMap.set(voteChoice.id, {
        ...choiceChartDataMap.get(voteChoice.id)!,
        choiceVotes: choiceChartDataMap.get(voteChoice.id)!.choiceVotes + 1,
      });
    }
  }

  const choiceChartData = Array.from(choiceChartDataMap.values());
  console.log('data', choiceChartData);

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
               * TODO: Make this value dynamic
               */}
              <PopoverContent className="w-96">
                <SingularLabeledBarChart
                  chartData={choiceChartData}
                  dataLabelKey="choiceValue"
                  dataValueKey="choiceVotes"
                  chartTitle="Votes"
                  chartDescription={`Max choice count per vote: ${proposalData.choiceCount}`}
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
            to={`../${proposalData.id}`}
          >
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
