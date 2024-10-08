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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';
import { LOADER_IDS, useLoadedData } from '@/lib/loaders';
import { PROPOSAL_HREFS } from '@/lib/routes';
import { Candidate } from '@ambassador';
import { ArrowLeft } from 'lucide-react';

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

  const canVote = proposal.votes[0].status === 'PENDING';
  const votesLeft = proposal.choiceCount - selectedCandidates.length;
  const progressPercentage =
    (selectedCandidates.length / proposal.choiceCount) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{proposal.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            {proposal.description || 'No description provided'}
          </p>
        </CardContent>
      </Card>

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
                <h4 className="mb-2 font-semibold">Selected Candidates:</h4>
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
  );
}
