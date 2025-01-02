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
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { BarChartBig, CalendarRange, ArrowRight } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Proposal } from '@ambassador';
import { SingularLabeledBarChart } from '@/components/bar-chart/SingularLabeledChart';
import { PROPOSAL_HREFS, PROPOSAL_OVERVIEW_PATHS } from '@/lib/routes';
import StatusBadge from '@/components/StatusBadge';
import { getVoteDistribution } from '@/lib/resolution-results';
import { cacheFunction } from '@/lib/cache';
import { getProposalStatusInfo } from '@/lib/get-status';

const getCachedVoteDistribution = cacheFunction(getVoteDistribution);

export default function ManagerCard({
  proposalData,
  className,
}: {
  proposalData: Proposal;
  className?: string;
}) {
  const { voteDistribution, finalizedVoteCount } = getCachedVoteDistribution(
    proposalData.candidates,
    proposalData.votes.map(vote => vote.voteSelections),
  );

  const voteProgress = (finalizedVoteCount / proposalData.votes.length) * 100;
  const proposalStatusInfo = getProposalStatusInfo(proposalData);

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
                <CalendarRange className="h-4 w-4" />
                <span className="sr-only">View proposal date range</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{
                  from: new Date(proposalData.startDate),
                  to: new Date(proposalData.endDate),
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <CardTitle className="line-clamp-2 text-xl">
          {proposalData.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {proposalData.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Votes resolved:</span>
            <span className="font-medium">{`${finalizedVoteCount}/${proposalData.votes.length}`}</span>
          </div>
          <Progress value={voteProgress} className="h-2" />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">
              <BarChartBig className="mr-2 h-4 w-4" />
              View Vote Distribution
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h3 className="font-semibold">Vote Distribution</h3>
              <p className="text-sm text-muted-foreground">
                Choices per Vote: {proposalData.choiceCount}
              </p>
            </div>
            <SingularLabeledBarChart
              chartData={voteDistribution}
              dataLabelKey="optionValue"
              dataValueKey="voteCount"
            />
          </PopoverContent>
        </Popover>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link
            to={PROPOSAL_HREFS.MANAGER_OVERVIEW(
              PROPOSAL_OVERVIEW_PATHS.VOTES,
              proposalData.id,
            )}
            className="flex items-center justify-center"
          >
            Manage Proposal
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
