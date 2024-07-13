import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselScrollHandles,
} from './ui/carousel';
import { Button } from './ui/button';
import { FC, useRef } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

const FormCarouselSummary: FC<{
  data: Record<string, string>;
  summaryTitle: string;
  handleClick: (data: Record<string, string>) => void | Response;
  handleCancel: () => void;
}> = ({ data, summaryTitle, handleClick, handleCancel }) => (
  <Card>
    <CardHeader>
      <CardTitle>{summaryTitle} Summary</CardTitle>
    </CardHeader>
    <CardContent>
      {Object.keys(data).map(key => (
        <div key={key}>
          <span className="italic">{key}:</span> {data[key]}
        </div>
      ))}
    </CardContent>
    <CardFooter>
      <div className="flex gap-10">
        <Button variant="secondary" onClick={handleCancel}>
          Go Back
        </Button>
        <Button onClick={() => handleClick(data)}>Create {summaryTitle}</Button>
      </div>
    </CardFooter>
  </Card>
);

// TODO: Fix the type of formComponents
const FormCarousel = ({
  formComponents,
  carouselData,
  carouselTitle,
}: {
  formComponents: FC<CarouselScrollHandles>[];
  carouselData: Record<string, string>;
  carouselTitle: string;
}) => {
  const carouselRef = useRef<CarouselScrollHandles>(null);
  return (
    // TODO: Fix the hardcoded max-w-[550px]
    <Carousel
      className="max-w-[550px] flex-1"
      opts={{ watchDrag: false }}
      ref={carouselRef}
    >
      <CarouselContent>
        {[...formComponents].map((Component, index) => (
          <CarouselItem key={index}>
            <Component
              scrollNext={() => {
                if (carouselRef.current) carouselRef.current.scrollNext();
              }}
              scrollPrev={() => {
                if (carouselRef.current) carouselRef.current.scrollPrev();
              }}
            />
          </CarouselItem>
        ))}
        <CarouselItem>
          <FormCarouselSummary
            data={carouselData}
            summaryTitle={carouselTitle}
            handleClick={data => console.log(data, ' has been sent!')}
            handleCancel={() => {
              if (carouselRef.current) carouselRef.current.scrollPrev();
            }}
          />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
};

export default FormCarousel;
