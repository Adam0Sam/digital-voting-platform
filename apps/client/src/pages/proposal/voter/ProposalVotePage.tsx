import { useState } from 'react';
import { useNavigate, useParams, useRevalidator } from 'react-router-dom';
import CandidateCard from '@/components/proposal/ChoiceCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { api } from '@/lib/api';
import { LOADER_IDS, useLoadedData } from '@/lib/loaders';
import { PROPOSAL_HREFS } from '@/lib/routes';
import { Candidate, ProposalStatus, VoteStatus } from '@ambassador';
import {
  ArrowLeft,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  FileText,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResolutionDisplayCard from '@/components/ResolutionDisplayCard';
import { getProgressBetweenDates } from '@/lib/utils';
import Timeline, { constructMarkerArray } from '@/components/Timeline';

function StatusAlert({ proposalStatus }: { proposalStatus: ProposalStatus }) {
  type StatusConfig = {
    [key in ProposalStatus]: {
      variant?: 'default' | 'destructive' | null | undefined;
      icon: React.ElementType;
      title: string;
      description: string;
    };
  };
  const statusConfig: StatusConfig = {
    [ProposalStatus.DRAFT]: {
      icon: FileText,
      title: 'Proposal in Draft',
      description:
        'This proposal is not yet active. Voting will be available once the proposal is activated.',
    },
    [ProposalStatus.RESOLVED]: {
      variant: 'default',
      icon: CheckCircle,
      title: 'Proposal Resolved',
      description:
        "Voting for this proposal has concluded. You can view the results in the 'Results' tab.",
    },
    [ProposalStatus.ABORTED]: {
      variant: 'destructive',
      icon: AlertTriangle,
      title: 'Proposal Aborted',
      description:
        'This proposal has been terminated. No further voting is possible.',
    },
    [ProposalStatus.ACTIVE]: {
      variant: 'default',
      icon: Clock,
      title: 'Proposal Active',
      description:
        'Voting is currently open for this proposal. Please select your candidates and submit your vote.',
    },
  };

  const {
    variant,
    icon: Icon,
    title,
    description,
  } = statusConfig[proposalStatus];

  return (
    <Alert variant={variant} className="mb-8">
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

export default function ProposalVotePage() {
  const { id: proposalId } = useParams();
  const proposals = useLoadedData(LOADER_IDS.VOTER_PROPOSALS);
  const proposal = proposals.find(proposal => proposal.id === proposalId);

  if (!proposal) {
    throw new Response('Proposal not found', { status: 404 });
  }

  const revalidator = useRevalidator();
  const navigate = useNavigate();

  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>(
    proposal.votes[0].candidates,
  );

  const canVote =
    proposal.status === ProposalStatus.ACTIVE &&
    proposal.votes[0].status === VoteStatus.PENDING;
  const proposalHasEnded =
    proposal.status === ProposalStatus.RESOLVED ||
    proposal.status === ProposalStatus.ABORTED;
  const votesLeft = proposal.choiceCount - selectedCandidates.length;
  const progressPercentage =
    (selectedCandidates.length / proposal.choiceCount) * 100;

  const renderVotingInterface = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl">
          {canVote ? 'Select Your Candidates' : 'Your Submitted Votes'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium">
            {canVote ? `Votes left: ${votesLeft}` : 'Votes submitted'}
          </span>
          <span className="text-sm font-medium">
            {selectedCandidates.length}/{proposal.choiceCount}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {proposal.candidates?.map(candidate => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isSelected={selectedCandidates.some(
                selectedChoice => selectedChoice.value === candidate.value,
              )}
              handleClick={() => {
                if (!canVote) return;
                setSelectedCandidates(prevCandidates => {
                  if (
                    prevCandidates.some(
                      prevChoice => prevChoice.value === candidate.value,
                    )
                  ) {
                    return prevCandidates.filter(
                      prevChoice => prevChoice.value !== candidate.value,
                    );
                  }
                  if (proposal.choiceCount <= prevCandidates.length) {
                    return [candidate];
                  }
                  return [...prevCandidates, candidate];
                });
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{proposal.title}</CardTitle>
          <CardDescription className="text-lg">
            {proposal.description || 'No description provided'}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="vote" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vote">
            <Users className="mr-2 h-4 w-4" />
            Vote
          </TabsTrigger>
          {proposalHasEnded && (
            <TabsTrigger value="results">
              <CheckCircle className="mr-2 h-4 w-4" />
              Results
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="vote" className="flex justify-center">
          <div className="w-full max-w-lg">
            {proposal.status in
            [ProposalStatus.DRAFT, ProposalStatus.ABORTED] ? (
              <StatusAlert proposalStatus={proposal.status} />
            ) : (
              renderVotingInterface()
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => navigate(PROPOSAL_HREFS.VOTE_ALL)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
              </Button>

              {canVote && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full sm:w-auto"
                      disabled={selectedCandidates.length <= 0}
                    >
                      Submit Vote
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Your Vote</DialogTitle>
                      <DialogDescription>
                        {selectedCandidates.length === proposal.choiceCount
                          ? 'You have used all your available votes.'
                          : `You have selected ${selectedCandidates.length} out of ${proposal.choiceCount} possible choices.`}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="my-4">
                      <h4 className="mb-2 font-semibold">
                        Selected Candidates:
                      </h4>
                      <ul className="list-inside list-disc">
                        {selectedCandidates.map(candidate => (
                          <li key={candidate.id}>{candidate.value}</li>
                        ))}
                      </ul>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button
                        onClick={async () => {
                          await api.vote.voteForProposal(
                            proposal.id,
                            selectedCandidates,
                          );
                          revalidator.revalidate();
                          navigate(PROPOSAL_HREFS.VOTE_ALL);
                        }}
                      >
                        Confirm Vote
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </TabsContent>

        {proposalHasEnded && (
          <TabsContent value="results" className="flex justify-center">
            <ResolutionDisplayCard
              proposal={proposal}
              className="max-w-xl flex-1"
            />
          </TabsContent>
        )}
      </Tabs>
      {proposal.status === ProposalStatus.ACTIVE && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Proposal Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline
              progressPercentage={getProgressBetweenDates(
                new Date(proposal.startDate),
                new Date(proposal.endDate),
              )(new Date())}
              markers={constructMarkerArray(proposal)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
