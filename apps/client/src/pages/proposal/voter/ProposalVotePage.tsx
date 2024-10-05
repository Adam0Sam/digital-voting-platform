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
} from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { LOADER_IDS, useLoadedData } from '@/lib/loaders';
import { PROPOSAL_HREFS } from '@/lib/routes';
import { Candidate } from '@ambassador';

import { DialogDescription } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { Link, useNavigate, useParams, useRevalidator } from 'react-router-dom';

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

  console.log(
    'proposal',
    proposal,
    'selectedChoices',
    selectedCandidates,
    'canVote',
    canVote,
  );

  /**
   * @Question
   * Why is proposal.current possibly undefined
   * in functions defined within the render?
   */
  return (
    <div className="mt-12 flex justify-center">
      <div className="flex max-w-screen-lg flex-1 flex-col items-center gap-36">
        <div className="flex flex-col gap-6 text-center">
          <h3 className="text-6xl">{proposal!.title}</h3>
          <p className="text-2xl text-muted-foreground">
            {proposal.description || 'Empty'}
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-8">
          <h4 className="text-2xl">
            {canVote
              ? `Votes left: ${proposal.choiceCount - selectedCandidates.length}`
              : 'Your submitted votes'}
          </h4>
          <div className="flex w-full flex-wrap justify-center gap-14">
            {proposal.candidates?.map(candidate => (
              <CandidateCard
                candidate={candidate}
                isSelected={selectedCandidates.some(
                  selectedChoice => selectedChoice.value === candidate.value,
                )}
                className="max-w-52 flex-1"
                handleClick={() => {
                  if (!canVote) {
                    return;
                  }
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
                    if (proposal!.choiceCount <= prevCandidates.length) {
                      return [candidate];
                    }
                    return [...prevCandidates, candidate];
                  });
                }}
                key={candidate.id}
              />
            ))}
          </div>
        </div>
        <div className="flex w-full flex-col justify-center gap-8 sm:flex-row sm:gap-12">
          {canVote && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="flex-1 py-2 sm:max-w-60"
                  disabled={selectedCandidates.length <= 0}
                >
                  Submit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to submit your vote?
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-8 flex flex-col items-center">
                  <DialogDescription>
                    {selectedCandidates.length === proposal.choiceCount
                      ? 'You have exhausted all your votes.'
                      : `You have selected ${selectedCandidates.length} choices out of ${proposal.choiceCount}.`}
                  </DialogDescription>
                  <DialogDescription>
                    Selected:{' '}
                    {selectedCandidates
                      .map(selectedChoice => selectedChoice.value)
                      .join(', ')}
                  </DialogDescription>
                </div>
                <DialogFooter className="mt-10 sm:justify-around">
                  <Button
                    onClick={async () => {
                      await api.vote.voteForProposal(
                        proposal.id,
                        selectedCandidates,
                      );
                      revalidator.revalidate();
                      navigate(`${PROPOSAL_HREFS.VOTE_ALL}`);
                    }}
                  >
                    Submit
                  </Button>
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <Button variant="secondary" className="flex-1 p-0 sm:max-w-60">
            <Link to={'../all'} className="w-full py-2">
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
