import ChoiceCard from '@/components/proposal/ChoiceCard';
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
import {
  VOTER_PROPOSALS_LOADER_ID,
  VoterProposalsLoaderReturnType,
} from '@/lib/loaders';
import { ProposalChoice } from '@/lib/types';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useRef, useState } from 'react';
import { Link, useParams, useRouteLoaderData } from 'react-router-dom';

export default function ProposalVotePage() {
  const { id: proposalId } = useParams();
  const [proposals, userVotes] = useRouteLoaderData(
    VOTER_PROPOSALS_LOADER_ID,
  ) as VoterProposalsLoaderReturnType;

  const proposal = useRef(
    proposals.find(proposal => proposal.id === proposalId),
  );
  const userVote = useRef(
    userVotes.find(vote => vote.proposalId === proposalId),
  );

  const [selectedChoices, setSelectedChoices] = useState<ProposalChoice[]>(
    () => {
      if (userVote.current) {
        console.log('USER CHOICES ', userVote.current.choices);
        console.log('AVAILABLE CHOICES ', proposal.current?.choices);
        return userVote.current.choices;
      }
      return [];
    },
  );

  if (!proposal.current || !userVote.current) {
    throw new Response('Proposal not found', { status: 404 });
  }

  return (
    <div className="mt-12 flex justify-center">
      <div className="flex max-w-screen-lg flex-1 flex-col items-center gap-36">
        <div className="flex flex-col gap-6 text-center">
          <h3 className="text-6xl">{proposal.current!.title}</h3>
          <p className="text-2xl text-muted-foreground">
            {proposal.current!.description || 'Empty'}
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-8">
          <h4 className="text-2xl">
            Votes left: {proposal.current!.choiceCount - selectedChoices.length}
          </h4>
          <div className="grid w-full auto-rows-max grid-cols-[repeat(auto-fit,minmax(10rem,15rem))] gap-14">
            {proposal.current!.choices.map(choice => (
              <ChoiceCard
                choiceData={choice}
                isSelected={selectedChoices.some(
                  selectedChoice => selectedChoice.value === choice.value,
                )}
                handleClick={() => {
                  setSelectedChoices(prevChoices => {
                    if (
                      prevChoices.some(
                        prevChoice => prevChoice.value === choice.value,
                      )
                    ) {
                      return prevChoices.filter(
                        prevChoice => prevChoice.value !== choice.value,
                      );
                    }
                    if (proposal.current!.choiceCount <= prevChoices.length) {
                      return [choice];
                    }
                    return [...prevChoices, choice];
                  });
                }}
                key={choice.id}
              />
            ))}
          </div>
        </div>
        <div className="flex w-full max-w-screen-sm justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="max-w-60 flex-1"
                disabled={selectedChoices.length <= 0}
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
                  {selectedChoices.length === proposal.current!.choiceCount
                    ? 'You have exhausted all your votes.'
                    : `You have selected ${selectedChoices.length} choices out of ${proposal.current!.choiceCount}.`}
                </DialogDescription>
                <DialogDescription>
                  Selected:{' '}
                  {selectedChoices
                    .map(selectedChoice => selectedChoice.value)
                    .join(', ')}
                </DialogDescription>
              </div>
              <DialogFooter className="mt-10 sm:justify-around">
                <Button
                  onClick={() =>
                    api.proposals.castUserVote(
                      proposal.current!.id,
                      selectedChoices,
                    )
                  }
                >
                  Submit
                </Button>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="secondary" className="max-w-60 flex-1">
            <Link to={'../all'} className="w-full">
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
