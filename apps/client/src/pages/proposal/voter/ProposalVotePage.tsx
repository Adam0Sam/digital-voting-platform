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
import {
  Link,
  useNavigate,
  useParams,
  useRevalidator,
  useRouteLoaderData,
} from 'react-router-dom';

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

  const revalidator = useRevalidator();
  const navigate = useNavigate();

  const [selectedChoices, setSelectedChoices] = useState<ProposalChoice[]>(
    () => {
      if (userVote.current) {
        return userVote.current.choices;
      }
      return [];
    },
  );

  if (!proposal.current || !userVote.current) {
    throw new Response('Proposal not found', { status: 404 });
  }

  const canVote = userVote.current!.status === 'PENDING';

  /**
   * @Question
   * Why is proposal.current possibly undefined
   * in functions defined within the render?
   */
  return (
    <div className="mt-12 flex justify-center">
      <div className="flex max-w-screen-lg flex-1 flex-col items-center gap-36">
        <div className="flex flex-col gap-6 text-center">
          <h3 className="text-6xl">{proposal.current!.title}</h3>
          <p className="text-2xl text-muted-foreground">
            {proposal.current.description || 'Empty'}
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-8">
          <h4 className="text-2xl">
            {canVote
              ? `Votes left: ${proposal.current.choiceCount - selectedChoices.length}`
              : 'Your submitted votes'}
          </h4>
          <div className="flex w-full flex-wrap justify-center gap-14">
            {proposal.current.choices.map(choice => (
              <ChoiceCard
                choiceData={choice}
                isSelected={selectedChoices.some(
                  selectedChoice => selectedChoice.value === choice.value,
                )}
                className="basis-50 max-w-sm flex-1"
                handleClick={() => {
                  if (!canVote) {
                    return;
                  }
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
        <div className="flex w-full flex-col justify-center gap-8 sm:flex-row sm:gap-12">
          {canVote && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="flex-1 py-2 sm:max-w-60"
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
                    {selectedChoices.length === proposal.current.choiceCount
                      ? 'You have exhausted all your votes.'
                      : `You have selected ${selectedChoices.length} choices out of ${proposal.current.choiceCount}.`}
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
                    onClick={async () => {
                      await api.proposals.castUserVote(
                        proposal.current!.id,
                        selectedChoices,
                      );
                      revalidator.revalidate();
                      navigate('../all');
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
