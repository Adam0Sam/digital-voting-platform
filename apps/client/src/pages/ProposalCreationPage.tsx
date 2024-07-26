import CardCarousel from '@/components/CardCarousel';
import CardWrapper from '@/components/CardWrapper';
import DateForm from '@/components/forms/DateForm';
import TitleDescriptionForm from '@/components/forms/TitleDescriptionForm';
import { CarouselScrollHandles } from '@/components/ui/carousel';
import { FC, useRef, useState } from 'react';
import { toast } from 'sonner';
import { redirect, useSubmit } from 'react-router-dom';
import { ProposalData } from '@/types/proposal.type';
import { proposalApi } from '@/lib/api';
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

function ProposalSummary({
  data,
  onCancel,
}: {
  data: ProposalData;
  onCancel: () => void;
}) {
  const submit = useSubmit();

  return (
    <Card>
      <form
        method="post"
        onSubmit={e => {
          e.preventDefault();
          submit(data, {
            method: 'POST',
          });
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

export default function ProposalCreationPage() {
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [proposalStartDate, setProposalStartDate] = useState('');
  const [proposalEndDate, setProposalEndDate] = useState('');
  const [proposalOwners, setProposalOwners] = useState<User[]>([]);
  const [proposalReviewers, setProposalReviewers] = useState<User[]>([]);

  // TODO: Rethink defining components in a component
  const TitleDescriptionCard: FC<Omit<CarouselScrollHandles, 'scrollPrev'>> = ({
    scrollNext,
  }) => (
    <CardWrapper
      cardTitle="Create a Proposal"
      cardDescription="Create a proposal for your project. This will be the first thing that people see when they view your project. Get their attention with a short title that best describes your project."
    >
      <TitleDescriptionForm
        formSubmitLabel="Next"
        onSubmit={values => {
          setProposalTitle(values.title);
          setProposalDescription(values.description ?? '');
          scrollNext();
        }}
        titleLabel="Proposal Title"
        descriptionLabel="Proposal Description"
        // this seems silly but ok
        defaultTitle={proposalTitle}
        defaultDescription={proposalDescription}
      />
    </CardWrapper>
  );

  const DateCard: FC<CarouselScrollHandles> = ({ scrollNext, scrollPrev }) => (
    <CardWrapper
      cardTitle="Set the Dates"
      cardDescription="The start and end dates will define the time period when users can vote for this proposal"
    >
      <DateForm
        onSubmit={values => {
          setProposalStartDate(values.date.from.toISOString());
          setProposalEndDate(values.date.to.toISOString());
          scrollNext();
        }}
        onCancel={scrollPrev}
        defaultStartDate={
          proposalStartDate ? new Date(proposalStartDate) : undefined
        }
        defaultEndDate={proposalEndDate ? new Date(proposalEndDate) : undefined}
      />
    </CardWrapper>
  );

  const UserSelectionCard: FC<CarouselScrollHandles> = ({
    scrollNext,
    scrollPrev,
  }) => {
    return (
      <CardWrapper
        cardTitle="Select Users"
        cardDescription="Select the users who will be the owners and reviewers of this proposal"
      >
        <UserSelectionForm
          onSubmit={values => {
            setProposalOwners(values.owners);
            setProposalReviewers(values.reviewers);
            scrollNext();
          }}
          onCancel={scrollPrev}
        />
      </CardWrapper>
    );
  };

  const carouselRef = useRef<CarouselScrollHandles>(null);

  const scrollNext = () => {
    console.log('scrollNext');
    if (carouselRef.current) {
      carouselRef.current.scrollNext();
    }
  };

  const scrollPrev = () => {
    console.log('scrollPrev');
    if (carouselRef.current) {
      carouselRef.current.scrollPrev();
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center">
      <CardCarousel ref={carouselRef}>
        <TitleDescriptionCard scrollNext={scrollNext} />
        <DateCard scrollNext={scrollNext} scrollPrev={scrollPrev} />
        <UserSelectionCard scrollNext={scrollNext} scrollPrev={scrollPrev} />
        <ProposalSummary
          data={{
            title: proposalTitle,
            description: proposalDescription,
            startDate: proposalStartDate,
            endDate: proposalEndDate,
            owners: proposalOwners,
            reviewers: proposalReviewers,
          }}
          onCancel={scrollPrev}
        />
      </CardCarousel>
    </main>
  );
}

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  console.log('formData', formData);
  const title = formData.get('title') as string;
  const description = formData.get('description') as string | undefined;
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;

  if (!title || !startDate || !endDate) {
    // TODO: Make this a proper error (prob with some react router utility)
    throw new Response('Invalid form data', { status: 400 });
  }

  const proposalData: ProposalData = {
    title,
    description,
    startDate,
    endDate,
    owners: [],
    reviewers: [],
  };

  const response = await proposalApi.createOne(proposalData);
  if (!response.ok) {
    if (response.status === 401) {
      console.error('Unauthorized Request');
      return redirect('/signin');
    }
    throw new Error('Failed to create proposal');
  }
  const { id } = await response.json();

  toast(`Proposal ${title} has been created`, {
    description: new Date().toLocaleTimeString(),
    action: {
      label: 'Undo',
      onClick: () => proposalApi.deleteOne(id),
    },
  });

  return null;
};
