import FormCarousel, { SubmitHandler } from '@/components/FormCarousel';
import CardForm from '@/components/forms/CardForm';
import DateForm from '@/components/forms/DateForm';
import TitleDescriptionForm from '@/components/forms/TitleDescriptionForm';
import { CarouselScrollHandles } from '@/components/ui/carousel';
import { FC, useState } from 'react';

interface ProposalData extends Record<string, string> {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export default function ProposalCreationPage() {
  const [proposalData, setProposalData] = useState<ProposalData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const mutateProposalData = (
    key: keyof ProposalData,
    value: string | Date,
  ) => {
    if (value instanceof Date) {
      value = value.toISOString();
    }
    setProposalData(prev => {
      return { ...prev, [key]: value };
    });
  };

  const TitleDescriptionCard: FC<CarouselScrollHandles> = ({ scrollNext }) => (
    <CardForm
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
    </CardForm>
  );

  const DateCard: FC<CarouselScrollHandles> = ({ scrollNext, scrollPrev }) => (
    <CardForm
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
    </CardForm>
  );

  const submitHandler: SubmitHandler<ProposalData> = data => {
    console.log(JSON.stringify({ proposal: data }));
  };

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
        submitHandler={submitHandler}
      />
    </main>
  );
}
