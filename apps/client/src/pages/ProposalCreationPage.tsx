import CardCarousel from '@/components/CardCarousel';
import CardWrapper from '@/components/CardWrapper';
import DateForm from '@/components/forms/DateForm';
import TitleDescriptionForm from '@/components/forms/TitleDescriptionForm';
import { CarouselScrollHandles } from '@/components/ui/carousel';
import { FC, useRef, useState } from 'react';
import { toast } from 'sonner';
import { redirect } from 'react-router-dom';
import {
  isResolutionValueArray,
  ProposalData,
  ResolutionValue,
} from '@/types/proposal.type';
import { ProposalApi } from '@/lib/api';
import UserSelectionForm from '@/components/forms/UserSelectionForm';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { isValid } from 'date-fns';
import { Button } from '@/components/ui/button';
import { isUserArray, User } from '@/types';
import ResolutionValueForm from '@/components/forms/ResolutionValueSelectionForm';

const createProposal = async (data: ProposalData) => {
  const response = await ProposalApi.createOne(data);
  if (!response.ok) {
    if (response.status === 401) {
      console.error('Unauthorized Request');
      return redirect('/signin');
    }
    throw new Error('Failed to create proposal');
  }
  const { id } = await response.json();
  // TODO: Undo proposal creation via scheduled worker request disruption
  toast(`Proposal ${data.title} has been created`, {
    description: new Date().toLocaleTimeString(),
    action: {
      label: 'Undo',
      onClick: () => ProposalApi.deleteOne(id),
    },
  });
};

function ProposalSummary({
  data,
  onCancel,
}: {
  data: ProposalData;
  onCancel: () => void;
}) {
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
            } else if (isResolutionValueArray(value)) {
              outputString = value
                .map(resolution => resolution.value)
                .join(', ');
            } else if (isValid(new Date(value))) {
              outputString = new Date(value).toLocaleDateString();
            } else {
              outputString = value;
            }
            return (
              <div key={key}>
                <span className="italic">{key}:</span> {outputString}
              </div>
            );
          })}
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
    />
  </CardWrapper>
);

const ResolutionValueCard: FC<{
  carouselApi: CarouselScrollHandles;
  handleSubmit: (resolutioValue: ResolutionValue[]) => void;
}> = ({ carouselApi, handleSubmit }) => {
  return (
    <CardWrapper
      cardTitle="Set Resolution Values"
      cardDescription="Set the possible resolution values for this proposal"
    >
      <ResolutionValueForm
        onSubmit={values => {
          handleSubmit(values);
          carouselApi.scrollNext();
        }}
        onCancel={carouselApi.scrollPrev}
      />
    </CardWrapper>
  );
};

const UserSelectionCard: FC<{
  carouselApi: CarouselScrollHandles;
  handleSubmit: (owners: User[], reviewers: User[]) => void;
}> = ({ carouselApi, handleSubmit }) => {
  return (
    <CardWrapper
      cardTitle="Select Users"
      cardDescription="Select the users who will be the owners and reviewers of this proposal"
    >
      <UserSelectionForm
        onSubmit={values => {
          handleSubmit(values.owners, values.reviewers);
          carouselApi.scrollNext();
        }}
        onCancel={carouselApi.scrollPrev}
      />
    </CardWrapper>
  );
};

export default function ProposalCreationPage() {
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [proposalStartDate, setProposalStartDate] = useState('');
  const [proposalEndDate, setProposalEndDate] = useState('');
  const [proposalOwners, setProposalOwners] = useState<User[]>([]);
  const [proposalReviewers, setProposalReviewers] = useState<User[]>([]);
  const [proposalResolutionValues, setProposalResolutionValues] = useState<
    ResolutionValue[]
  >([]);
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
          handleSubmit={resolutionValue => {
            setProposalResolutionValues(resolutionValue);
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
        <UserSelectionCard
          carouselApi={carouselApi}
          handleSubmit={(owners, reviewers) => {
            setProposalOwners(owners);
            setProposalReviewers(reviewers);
          }}
        />
        <ProposalSummary
          data={{
            title: proposalTitle,
            description: proposalDescription,
            startDate: proposalStartDate,
            endDate: proposalEndDate,
            owners: proposalOwners,
            reviewers: proposalReviewers,
            resolutionValues: proposalResolutionValues,
          }}
          onCancel={carouselApi.scrollPrev}
        />
      </CardCarousel>
    </main>
  );
}
