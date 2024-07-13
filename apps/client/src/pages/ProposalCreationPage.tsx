import FormCarousel from '@/components/FormCarousel';
import TitleDescriptionForm from '@/components/forms/TitleDescriptionForm';
import { CarouselScrollHandles } from '@/components/ui/carousel';
import { FC, useState } from 'react';

export default function ProposalCreationPage() {
  const [proposalData, setProposalData] = useState<Record<string, string>>({});

  const mutateProposalData = (key: string, value: string) => {
    setProposalData(prev => {
      return { ...prev, [key]: value };
    });
  };

  // how to make this more generic?
  const formComponents: FC<CarouselScrollHandles>[] = [
    ({ scrollNext }) => (
      <TitleDescriptionForm
        formCardTitle="Create a Proposal"
        formCardDescription="Create a proposal for your project. This will be the first thing that people see when they view your project. Get their attention with a short title that best describes your project."
        formSubmitLabel="Next"
        onSubmit={values => {
          mutateProposalData('title', values.title);
          mutateProposalData('description', values.description);
          scrollNext();
        }}
        titleLabel="Proposal Title"
        descriptionLabel="Proposal Description"
        defaultTitle={proposalData.title}
        defaultDescription={proposalData.description}
      />
    ),
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
