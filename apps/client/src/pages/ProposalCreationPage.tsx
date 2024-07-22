import FormCarousel from '@/components/FormCarousel';
import CardWrapper from '@/components/CardWrapper';
import DateForm from '@/components/forms/DateForm';
import TitleDescriptionForm from '@/components/forms/TitleDescriptionForm';
import { CarouselScrollHandles } from '@/components/ui/carousel';
import { FC, useState } from 'react';
import { toast } from 'sonner';
import { redirect } from 'react-router-dom';
import { ProposalData } from '@/types/proposal.type';
import { proposalApi } from '@/lib/api';

export default function ProposalCreationPage() {
  const [proposalData, setProposalData] = useState<ProposalData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const mutateProposalData = (
    key: keyof ProposalData,
    value: string | Date | undefined,
  ) => {
    if (!value) return;
    if (value instanceof Date) {
      value = value.toISOString();
    }
    setProposalData(prev => {
      return { ...prev, [key]: value };
    });
  };

  const TitleDescriptionCard: FC<CarouselScrollHandles> = ({ scrollNext }) => (
    <CardWrapper
      cardTitle="Create a Proposal"
      cardDescription="Create a proposal for your project. This will be the first thing that people see when they view your project. Get their attention with a short title that best describes your project."
    >
      <TitleDescriptionForm
        formSubmitLabel="Next"
        onSubmit={values => {
          mutateProposalData('title', values.title);
          mutateProposalData('description', values.description);
          scrollNext();
        }}
        titleLabel="Proposal Title"
        descriptionLabel="Proposal Description"
        // this seems silly but ok
        defaultTitle={proposalData.title}
        defaultDescription={proposalData.description}
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
          mutateProposalData('startDate', values.date.from);
          mutateProposalData('endDate', values.date.to);
          scrollNext();
        }}
        onCancel={scrollPrev}
        defaultStartDate={
          proposalData.startDate ? new Date(proposalData.startDate) : undefined
        }
        defaultEndDate={
          proposalData.endDate ? new Date(proposalData.endDate) : undefined
        }
      />
    </CardWrapper>
  );

  const formComponents: FC<CarouselScrollHandles>[] = [
    TitleDescriptionCard,
    DateCard,
  ];
  return (
    <main className="flex flex-1 items-center justify-center">
      <FormCarousel
        formComponents={formComponents}
        carouselData={proposalData}
        carouselTitle="Proposal"
      />
    </main>
  );
}

// onSubmit={data => {
//   toast(`Proposal ${data.title} has been created`, {
//     description: new Date().toLocaleString(),
//     action: {
//       label: 'Undo',
//       onClick: () => console.log('Undo'),
//     },
//   });
// }}

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
