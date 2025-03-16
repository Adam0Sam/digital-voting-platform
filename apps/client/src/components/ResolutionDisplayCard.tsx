import { ProposalStatus, Proposal, VoteSelection } from '@ambassador';
import { AlertTriangle, Clock, FileText, Award } from 'lucide-react';
import { SingularLabeledBarChart } from './bar-chart';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import {
  getVoteDistribution,
  getWinningCandidate,
} from '@/lib/resolution/resolution-results';
import { cacheFunction } from '@/lib/cache';
import { VotingSystem } from '@ambassador/voting-system';
import { determineWinner } from '@/lib/resolution/condorcet';

const getCachedVoteDistribution = cacheFunction(getVoteDistribution);
const getCachedWinningCandidate = cacheFunction(getWinningCandidate);

function useAnonVoteResults(id: string) {
  const [voteResults, setVoteResults] = useState<VoteSelection[][]>([]);
  useEffect(() => {
    api.vote.getAnonVoteResults(id).then(voteSelections => {
      setVoteResults(voteSelections);
    });
  }, [id]);
  return voteResults;
}

type ResolutionDisplayCardProps = {
  proposal: Pick<Proposal, 'candidates' | 'status' | 'id' | 'votingSystem'>;
  className?: string;
  showHeader?: boolean;
  voteDistributionCallback?: typeof getVoteDistribution;
};

export default function ResolutionDisplayCard({
  proposal,
  className,
  showHeader = true,
  voteDistributionCallback,
}: ResolutionDisplayCardProps) {
  const voteResults = useAnonVoteResults(proposal.id);
  const getVoteDistribution =
    voteDistributionCallback ?? getCachedVoteDistribution;
  console.log('voteResults', voteResults);
  const { voteDistribution, finalizedVoteCount } = getVoteDistribution(
    proposal.candidates,
    voteResults,
  );
  console.log('voteDistribution', voteDistribution);

  let fptpWinner;
  let rankedChoiceWinner;
  if (proposal.votingSystem === VotingSystem.RANKED_CHOICE) {
    rankedChoiceWinner = determineWinner(proposal.candidates, voteResults);
  } else {
    fptpWinner = getCachedWinningCandidate(
      proposal.candidates,
      voteResults,
      proposal.votingSystem as VotingSystem,
    );
  }

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
              <p className="text-2xl font-bold">{voteResults.length}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Resolved Votes</p>
              <p className="text-2xl font-bold">{finalizedVoteCount}</p>
            </div>
            {proposal.status === ProposalStatus.RESOLVED && (
              <>
                <div>
                  <p className="text-sm font-medium">Winning Choice</p>
                  <p className="text-2xl font-bold">
                    {proposal.votingSystem === VotingSystem.RANKED_CHOICE
                      ? rankedChoiceWinner?.value
                      : fptpWinner?.optionValue}
                  </p>
                </div>
                {proposal.votingSystem !== VotingSystem.RANKED_CHOICE && (
                  <div>
                    <p className="text-sm font-medium">Votes for Winner</p>
                    <p className="text-2xl font-bold">
                      {fptpWinner?.voteCount}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {proposal.status === ProposalStatus.RESOLVED &&
          proposal.votingSystem !== VotingSystem.RANKED_CHOICE && (
            <div className="mt-4">
              <h4 className="mb-2 text-lg font-semibold">
                Final Vote Distribution
              </h4>
              <SingularLabeledBarChart
                chartData={voteDistribution}
                dataLabelKey="optionValue"
                dataValueKey="voteCount"
                className="h-[200px] w-full"
              />
            </div>
          )}
      </CardContent>
    </Card>
  );
}
