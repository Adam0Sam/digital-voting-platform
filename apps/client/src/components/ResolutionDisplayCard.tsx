import { ProposalStatus, Candidate, Proposal } from '@ambassador';
import { AlertTriangle, Clock, FileText, Award } from 'lucide-react';
import { SingularLabeledBarChart } from './bar-chart';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card';
import { getCachedFunction } from '@/lib/utils';
import { getChoiceData } from '@/lib/proposal-data';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

const getCachedChoiceData = getCachedFunction(getChoiceData);

function useAnonVoteResults(id: string) {
  const [voteResults, setVoteResults] = useState<Candidate[][]>([]);
  useEffect(() => {
    api.vote
      .getAnonVoteResults(id)
      .then(candidates => setVoteResults(candidates));
  }, [id]);
  return voteResults;
}

type ResolutionDisplayCardProps = {
  proposal: Pick<Proposal, 'candidates' | 'status' | 'id'>;
  className?: string;
  showHeader?: boolean;
};

export default function ResolutionDisplayCard({
  proposal,
  className,
  showHeader = true,
}: ResolutionDisplayCardProps) {
  const voteResults = useAnonVoteResults(proposal.id);
  const { choiceChartData, resolvedVoteCount } = getCachedChoiceData(
    proposal.candidates,
    voteResults,
  );
  const totalVotes = voteResults.length;
  const winningCandidate = choiceChartData.reduce((prev, current) =>
    current.choiceVotes > prev.choiceVotes ? current : prev,
  );

  const statusConfig = {
    [ProposalStatus.ABORTED]: {
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      title: 'Proposal Aborted',
      description: 'This proposal has been terminated before completion.',
    },
    [ProposalStatus.ACTIVE]: {
      icon: Clock,
      color: 'text-green-300',
      bgColor: 'bg-green-300/10',
      title: 'Proposal Active',
      description: 'Voting is currently in progress for this proposal.',
    },
    [ProposalStatus.DRAFT]: {
      icon: FileText,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      title: 'Proposal in Draft',
      description:
        'This proposal is still being prepared and is not yet active.',
    },
    [ProposalStatus.RESOLVED]: {
      icon: Award,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      title: 'Proposal Resolved',
      description: 'Voting has concluded for this proposal.',
    },
  };

  const {
    icon: StatusIcon,
    color,
    bgColor,
    title,
    description,
  } = statusConfig[proposal.status];

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <CardTitle className="gap- flex items-center">
            <StatusIcon className={`h-6 w-6 ${color}`} />
            <span>{title}</span>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <div className={`rounded-lg p-4 ${bgColor}`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Total Votes</p>
              <p className="text-2xl font-bold">{totalVotes}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Resolved Votes</p>
              <p className="text-2xl font-bold">{resolvedVoteCount}</p>
            </div>
            {proposal.status === ProposalStatus.RESOLVED && (
              <>
                <div>
                  <p className="text-sm font-medium">Winning Choice</p>
                  <p className="text-2xl font-bold">
                    {winningCandidate.choiceValue}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Votes for Winner</p>
                  <p className="text-2xl font-bold">
                    {winningCandidate.choiceVotes}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        {proposal.status === ProposalStatus.RESOLVED && (
          <div className="mt-4">
            <h4 className="mb-2 text-lg font-semibold">
              Final Vote Distribution
            </h4>
            <SingularLabeledBarChart
              chartData={choiceChartData}
              dataLabelKey="choiceValue"
              dataValueKey="choiceVotes"
              className="h-[200px] w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
