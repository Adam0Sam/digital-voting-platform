import CardCarousel from '@/components/CardCarousel';
import CardWrapper from '@/components/CardWrapper';
import DateForm from '@/components/forms/DateForm';
import TitleDescriptionForm from '@/components/forms/TitleDescriptionForm';
import { CarouselScrollHandles } from '@/components/ui/carousel';
import { FC, useRef, useState } from 'react';
import { toast } from 'sonner';
import { redirect } from 'react-router-dom';
import {
  isProposalChoiceDtoArray,
  ProposalChoiceDto,
  ProposalDto,
  ProposalManagerRole,
  ProposalManagerRoles,
  ProposalStatusOptions,
  ProposalVisibility,
  ProposalVisibilityOptions,
} from '@/lib/types/proposal.type';
import { api, APIError } from '@/lib/api';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { isUserArray, User } from '@/lib/types';

import ProposalOwnerReviewerSelectionForm from '@/components/forms/user/ProposalOwnerReviewerSelectionForm';
import UserSelectionForm from '@/components/forms/user/UserSelectionForm';

import Combobox from '@/components/Combobox';
import ProposalChoiceForm from '@/components/forms/choice-selection/ProposalChoiceForm';

const createProposal = async (data: ProposalDto) => {
  try {
    const createdProposal = await api.proposals.createOne(data);
    const { id } = createdProposal;
    // TODO: Undo proposal creation via scheduled worker request disruption
    toast(`Proposal ${data.title} has been created`, {
      description: new Date().toLocaleTimeString(),
      action: {
        label: 'Undo',
        onClick: () => api.proposals.deleteOne(id),
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === 401) {
        console.error('Unauthorized Request');
        return redirect('/signin');
      } else {
        console.error(`API Error: ${error.message}, ${error.status}`);
      }
    } else {
      console.error('Failed to create proposal ', error);
    }
  }
};
// TODO: Make a prettier proposal summary component
function ProposalSummary({
  data,
  onCancel,
}: {
  data: ProposalDto;
  onCancel: () => void;
}) {
  const managerNameMap = new Map<ProposalManagerRole, string[]>();

  // data.managers.forEach(({ role, user }) => {
  //   managerNameMap.set(role, [
  //     ...(managerNameMap.get(role) ?? []),
  //     `${user.personalNames.join(' ')} ${user.familyName}`,
  //   ]);
  // });

  return (
    <Card>
      <form
        method="post"
        onSubmit={e => {
          e.preventDefault();
          createProposal(data);
        }}
      >
        <CardHeader>
          <CardTitle>Proposal Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(data).map(([key, value]) => {
            let outputString: string;

            if (isUserArray(value)) {
              outputString = value
                .map(
                  user => `${user.personalNames.join(' ')} ${user.familyName}`,
                )
                .join(', ');
            } else if (isProposalChoiceDtoArray(value)) {
              outputString = value.map(choice => choice.value).join(', ');
            } else {
              outputString = String(value);
            }

            return (
              <div key={key}>
                <span className="italic">{key}:</span> {outputString ?? ''}
              </div>
            );
          })}
          {Array.from(managerNameMap).map(([role, name]) => (
            <div key={role}>
              <span className="italic">{role}:</span>{' '}
              {name.map(n => n).join(', ')}
            </div>
          ))}
        </CardContent>
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
  carouselApi: CarouselScrollHandles;
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

const DateCard: FC<{
  carouselApi: CarouselScrollHandles;
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
  carouselApi: CarouselScrollHandles;
  handleSubmit: ({
    choices,
    choiceCount,
  }: {
    choices: ProposalChoiceDto[];
    choiceCount: number;
  }) => void;
}> = ({ carouselApi, handleSubmit }) => {
  return (
    <CardWrapper
      cardTitle="Set Resolution Values"
      cardDescription="Set the possible resolution values for this proposal"
    >
      <ProposalChoiceForm
        onSubmit={values => {
          handleSubmit(values);
          carouselApi.scrollNext();
        }}
        onCancel={carouselApi.scrollPrev}
      />
    </CardWrapper>
  );
};

const ManagerSelectionCard: FC<{
  carouselApi: CarouselScrollHandles;
  handleSubmit: (owners: User[], reviewers: User[]) => void;
}> = ({ carouselApi, handleSubmit }) => {
  return (
    <CardWrapper
      cardTitle="Select Managers"
      cardDescription="Select the users who will be the owners and reviewers of this proposal"
    >
      <ProposalOwnerReviewerSelectionForm
        onSubmit={values => {
          handleSubmit(values.owners, values.reviewers);
          carouselApi.scrollNext();
        }}
        onCancel={carouselApi.scrollPrev}
      />
    </CardWrapper>
  );
};

const proposalVisibilityChoices = [
  {
    value: ProposalVisibilityOptions.PUBLIC,
    label: 'Public',
    description: 'Visible to all users',
  },
  {
    value: ProposalVisibilityOptions.AGENT_ONLY,
    label: 'Agent Only',
    description: 'Only visible to selected agents: voters and managers',
  },
  {
    value: ProposalVisibilityOptions.MANAGER_ONLY,
    label: 'Manager Only',
    description: 'Only visible to managers',
  },
];

const DEFAULT_PROPOSAL_VISIBILITY = ProposalVisibilityOptions.AGENT_ONLY;

const VoterSelectionCard: FC<{
  carouselApi: CarouselScrollHandles;
  handleSubmit: (users: User[], proposalVisibility: ProposalVisibility) => void;
}> = ({ carouselApi, handleSubmit }) => {
  const [proposalVisibility, setProposalVisibility] =
    useState<ProposalVisibility>(DEFAULT_PROPOSAL_VISIBILITY);
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
      >
        <Combobox
          items={proposalVisibilityChoices}
          handleSelectedValue={value => setProposalVisibility(value)}
          defaultItem={proposalVisibilityChoices.find(
            option => option.value === DEFAULT_PROPOSAL_VISIBILITY,
          )}
        />
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

  const [proposalManagers, setProposalManagers] = useState<
    {
      type: ProposalManagerRole;
      users: User[];
    }[]
  >([]);

  const [proposalVoters, setProposalVoters] = useState<User[]>([]);

  const [proposalChoices, setProposalChoices] = useState<ProposalChoiceDto[]>(
    [],
  );
  const [proposalChoiceCount, setProposalChoiceCount] = useState(1);

  const carouselRef = useRef<CarouselScrollHandles>(null);

  const carouselApi = {
    scrollNext: () => {
      if (carouselRef.current) {
        carouselRef.current.scrollNext();
      }
    },
    scrollPrev: () => {
      if (carouselRef.current) {
        carouselRef.current.scrollPrev();
      }
    },
  };

  return (
    <main className="flex flex-1 items-center justify-center">
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
        <ResolutionValueCard
          carouselApi={carouselApi}
          handleSubmit={({ choices, choiceCount }) => {
            setProposalChoices(choices);
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
        <VoterSelectionCard
          carouselApi={carouselApi}
          handleSubmit={(users, proposalVisibility) => {
            setProposalVoters(users);
            setProposalVisibility(proposalVisibility);
          }}
        />
        <ManagerSelectionCard
          carouselApi={carouselApi}
          handleSubmit={(owners, reviewers) => {
            setProposalManagers([
              { type: ProposalManagerRoles.OWNER, users: owners },
              { type: ProposalManagerRoles.REVIEWER, users: reviewers },
            ]);
          }}
        />
        <ProposalSummary
          data={{
            title: proposalTitle,
            description: proposalDescription,
            startDate: proposalStartDate,
            endDate: proposalEndDate,
            status: ProposalStatusOptions.DRAFT,
            visibility:
              proposalVisibility ?? ProposalVisibilityOptions.AGENT_ONLY,
            voters: proposalVoters,
            // managers: proposalManagers.flatMap(({ type, users }) => {
            //   return users.map(user => ({
            //     role: type,
            //     user,
            //   }));
            // }),
            managers: [],
            choices: proposalChoices,
            choiceCount: proposalChoiceCount,
          }}
          onCancel={carouselApi.scrollPrev}
        />
      </CardCarousel>
    </main>
  );
}
