import CardCarousel, { CardCarouselApi } from '@/components/CardCarousel';
import CardWrapper from '@/components/CardWrapper';
import DateForm from '@/components/forms/DateForm';
import TitleDescriptionForm from '@/components/forms/TitleDescriptionForm';
import { CarouselScrollHandles } from '@/components/ui/carousel';
import { FC, useRef, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UserSelectionForm from '@/components/forms/user/UserSelectionForm';
import Combobox from '@/components/Combobox';
import CandidateForm from '@/components/forms/candidate-selection/CandidateForm';
import ManagerSelectionForm from '@/components/forms/user/ManagerSelectionForm';
import { AllUsersProvider } from '@/lib/context/all-users';
import { DelayedFulfill } from '@/lib/delayed-fulfill';
import UserPatternForm from '@/components/forms/user/user-pattern/UserPatternForm';
import { useNavigate } from 'react-router-dom';
import { PROPOSAL_HREFS } from '@/lib/routes';
import { cn } from '@/lib/utils';
import {
  CreateCandidateDto,
  CreateProposalDto,
  ManagerListDto,
  ProposalStatus,
  ProposalVisibility,
  User,
  UserPattern,
} from '@ambassador';
import VotingSystemForm from '@/components/forms/VotingSystemForm';
import { VotingSystem } from '@ambassador/voting-system';

// TODO: Make a prettier proposal summary component
export function ProposalSummary({
  data,
  onCancel,
}: {
  data: CreateProposalDto;
  onCancel: () => void;
}) {
  const DELAY_DURATION = 4000;
  const navigate = useNavigate();
  const delayedFulfill = new DelayedFulfill(DELAY_DURATION + 250, async () => {
    await api.proposals.createOne(data);
    navigate(PROPOSAL_HREFS.BASE);
  });

  return (
    <Card>
      <form
        method="post"
        onSubmit={e => {
          e.preventDefault();
          delayedFulfill.beginResolve();
          toast(`Proposal ${data.title} has been created`, {
            description: new Date().toLocaleTimeString(),
            action: {
              label: 'Undo',
              onClick: delayedFulfill.reset,
            },
            duration: DELAY_DURATION,
          });
        }}
      >
        <CardHeader>
          <CardTitle>Proposal Summary</CardTitle>
        </CardHeader>
        <CardContent>Proposal Summary Placeholder</CardContent>
        <CardFooter>
          <div className="flex gap-10">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Go Back
            </Button>
            <Button type="submit">Create Proposal</Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

const TitleDescriptionCard: FC<{
  carouselApi: CardCarouselApi;
  handleSubmit: (title: string, description: string) => void;
  defaultValues: { title: string; description: string };
}> = ({ carouselApi, handleSubmit, defaultValues }) => (
  <CardWrapper
    cardTitle="Create a Proposal"
    cardDescription="Create a proposal for your project. This will be the first thing that people see when they view your project. Get their attention with a short title that best describes your project."
  >
    <TitleDescriptionForm
      formSubmitLabel="Next"
      onSubmit={values => {
        handleSubmit(values.title, values.description ?? '');
        carouselApi.scrollNext();
      }}
      titleLabel="Proposal Title"
      descriptionLabel="Proposal Description"
      defaultTitle={defaultValues.title}
      defaultDescription={defaultValues.description}
    />
  </CardWrapper>
);

const VotingSystemCard: FC<{
  carouselApi: CardCarouselApi;
  handleSubmit: (votingSystem: VotingSystem) => void;
}> = ({ carouselApi, handleSubmit }) => {
  return (
    <CardWrapper
      cardTitle="Select Voting System"
      cardDescription="Select the voting system for this proposal"
    >
      <VotingSystemForm
        onSubmit={values => {
          handleSubmit(values.system);
          carouselApi.scrollNext();
        }}
        onCancel={carouselApi.scrollPrev}
      />
    </CardWrapper>
  );
};

const DateCard: FC<{
  carouselApi: CardCarouselApi;
  handleSubmit: (startDate: string, endDate: string) => void;
  defaultValues: { startDate: string; endDate: string };
}> = ({ carouselApi, handleSubmit, defaultValues }) => (
  <CardWrapper
    cardTitle="Set the Dates"
    cardDescription="The start and end dates will define the time period when users can vote for this proposal"
  >
    <DateForm
      onSubmit={values => {
        handleSubmit(
          values.date.from.toISOString(),
          values.date.to.toISOString(),
        );
        carouselApi.scrollNext();
      }}
      onCancel={carouselApi.scrollPrev}
      defaultStartDate={
        defaultValues.startDate ? new Date(defaultValues.startDate) : undefined
      }
      defaultEndDate={
        defaultValues.endDate ? new Date(defaultValues.endDate) : undefined
      }
      submitButtonLabel="Next"
    />
  </CardWrapper>
);

const ResolutionValueCard: FC<{
  carouselApi: CardCarouselApi;
  handleSubmit: ({
    candidates,
    choiceCount,
  }: {
    candidates: CreateCandidateDto[];
    choiceCount: number;
  }) => void;
}> = ({ carouselApi, handleSubmit }) => {
  return (
    <CardWrapper
      cardTitle="Set Resolution Values"
      cardDescription="Set the possible resolution values for this proposal"
    >
      <CandidateForm
        onSubmit={values => {
          handleSubmit(values);
          carouselApi.scrollNext();
        }}
        onCancel={carouselApi.scrollPrev}
        formSubmitLabel="Next"
      />
    </CardWrapper>
  );
};

const ManagerSelectionCard: FC<{
  carouselApi: CardCarouselApi;
  handleSubmit: (managers: ManagerListDto[]) => void;
}> = ({ carouselApi, handleSubmit }) => {
  return (
    <CardWrapper
      cardTitle="Select Managers"
      cardDescription="Select the users who will be able to manage this proposal. Assign your own permissions"
    >
      <ManagerSelectionForm
        onSubmit={values => {
          handleSubmit(values);
          carouselApi.scrollNext();
        }}
        onCancel={carouselApi.scrollPrev}
      />
    </CardWrapper>
  );
};

const proposalVisibilityChoices = [
  {
    value: ProposalVisibility.PUBLIC,
    label: 'Public',
    description: 'Visible to all users',
  },
  {
    value: ProposalVisibility.AGENT_ONLY,
    label: 'Agent Only',
    description: 'Only visible to selected agents: voters and managers',
  },
  {
    value: ProposalVisibility.MANAGER_ONLY,
    label: 'Manager Only',
    description: 'Only visible to managers',
  },
];

const DEFAULT_PROPOSAL_VISIBILITY = ProposalVisibility.AGENT_ONLY;

const VoterSelectionCard: FC<{
  carouselApi: CardCarouselApi;
  handleSubmit: (users: User[], proposalVisibility: ProposalVisibility) => void;
  handlePatternSubmit: (pattern: UserPattern) => void;
}> = ({ carouselApi, handleSubmit, handlePatternSubmit }) => {
  const [proposalVisibility, setProposalVisibility] =
    useState<ProposalVisibility>(DEFAULT_PROPOSAL_VISIBILITY);
  const [isPatternCreated, setIsPatternCreated] = useState(false);
  return (
    <CardWrapper
      cardTitle="Select Voters"
      cardDescription="Select the users who will be able to vote on this proposal"
    >
      <UserSelectionForm
        onSubmit={values => {
          handleSubmit(values, proposalVisibility);
          carouselApi.scrollNext();
        }}
        onCancel={carouselApi.scrollPrev}
        enableFormError={!isPatternCreated}
      >
        <div className="flex flex-col gap-4">
          <Combobox
            items={proposalVisibilityChoices}
            handleSelectedValue={value => setProposalVisibility(value)}
            defaultItem={proposalVisibilityChoices.find(
              option => option.value === DEFAULT_PROPOSAL_VISIBILITY,
            )}
          />
          <UserPatternForm
            onSubmit={pattern => {
              handlePatternSubmit(pattern);
              if (
                (pattern?.grades?.length ?? 0) > 0 ||
                (pattern?.roles?.length ?? 0) > 0
              ) {
                setIsPatternCreated(true);
              }
            }}
          />
        </div>
      </UserSelectionForm>
    </CardWrapper>
  );
};

export default function ProposalCreationPage() {
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [proposalStartDate, setProposalStartDate] = useState('');
  const [proposalEndDate, setProposalEndDate] = useState('');
  const [proposalVisibility, setProposalVisibility] =
    useState<ProposalVisibility>();

  const [proposalManagers, setProposalManagers] = useState<ManagerListDto[]>(
    [],
  );

  const [proposalVoters, setProposalVoters] = useState<User[]>([]);

  const [candidates, setCandidates] = useState<CreateCandidateDto[]>([]);
  const [proposalChoiceCount, setProposalChoiceCount] = useState(1);
  const [proposalUserPattern, setProposalUserPattern] = useState<UserPattern>();

  const [votingSystem, setVotingSystem] = useState<VotingSystem>();

  const carouselRef = useRef<CarouselScrollHandles>(null);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const carouselApi = {
    scrollNext: () => {
      if (carouselRef.current) {
        carouselRef.current.scrollNext();
        setCurrentCardIndex(prevIndex => prevIndex + 1);
      }
    },
    scrollPrev: () => {
      if (carouselRef.current) {
        carouselRef.current.scrollPrev();
        setCurrentCardIndex(prevIndex => prevIndex - 1);
      }
    },
  };

  return (
    <AllUsersProvider>
      <div className="flex h-full flex-col justify-center gap-5">
        <div className="flex justify-center gap-2">
          {Array.from({
            length: carouselRef.current?.getCarouselLength() ?? 0,
          }).map((_, index) => {
            const isInteractive = index <= currentCardIndex;
            return (
              <button
                key={index}
                className={cn(
                  'h-2 w-2 rounded-full bg-primary opacity-35 transition-all',
                  {
                    'opacity-100': isInteractive,
                    'scale-[1.4] opacity-100': index === currentCardIndex,
                  },
                )}
                disabled={!isInteractive}
                onClick={() => {
                  if (carouselRef.current) {
                    carouselRef.current.scrollTo?.(index);
                    setCurrentCardIndex(index);
                  }
                }}
              >
                {}
              </button>
            );
          })}
        </div>
        <main className="flex items-center justify-center">
          <CardCarousel ref={carouselRef}>
            <TitleDescriptionCard
              carouselApi={carouselApi}
              handleSubmit={(title, description) => {
                setProposalTitle(title);
                setProposalDescription(description);
              }}
              defaultValues={{
                title: proposalTitle,
                description: proposalDescription,
              }}
            />
            <VotingSystemCard
              carouselApi={carouselApi}
              handleSubmit={system => setVotingSystem(system)}
            />
            <ResolutionValueCard
              carouselApi={carouselApi}
              handleSubmit={({ candidates, choiceCount }) => {
                setCandidates(candidates);
                setProposalChoiceCount(choiceCount);
              }}
            />
            <DateCard
              carouselApi={carouselApi}
              handleSubmit={(startDate, endDate) => {
                setProposalStartDate(startDate);
                setProposalEndDate(endDate);
              }}
              defaultValues={{
                startDate: proposalStartDate,
                endDate: proposalEndDate,
              }}
            />
            <ManagerSelectionCard
              carouselApi={carouselApi}
              handleSubmit={managers => {
                setProposalManagers(managers);
              }}
            />
            <VoterSelectionCard
              carouselApi={carouselApi}
              handleSubmit={(users, proposalVisibility) => {
                setProposalVoters(users);
                setProposalVisibility(proposalVisibility);
              }}
              handlePatternSubmit={pattern => setProposalUserPattern(pattern)}
            />

            <ProposalSummary
              data={{
                title: proposalTitle,
                description: proposalDescription,
                startDate: proposalStartDate,
                endDate: proposalEndDate,
                status: ProposalStatus.DRAFT,
                visibility: proposalVisibility ?? ProposalVisibility.AGENT_ONLY,
                userPattern: proposalUserPattern ?? {
                  grades: [],
                  roles: [],
                },
                votingSystem: votingSystem ?? VotingSystem.FIRST_PAST_THE_POST,
                voters: proposalVoters,
                managers: proposalManagers,
                candidates: candidates,
                choiceCount: proposalChoiceCount,
              }}
              onCancel={carouselApi.scrollPrev}
            />
          </CardCarousel>
        </main>
      </div>
    </AllUsersProvider>
  );
}
