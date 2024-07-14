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
import { isValid } from 'date-fns';

export type SubmitHandler<T> = (data: T) => void | Response;

const FormCarouselSummary: FC<{
  data: Record<string, string>;
  summaryTitle: string;
  onSubmit: SubmitHandler<Record<string, string>>;
  onCancel: () => void;
}> = ({ data, summaryTitle, onSubmit, onCancel }) => (
  <Card>
    <CardHeader>
      <CardTitle>{summaryTitle} Summary</CardTitle>
    </CardHeader>
    <CardContent>
      {Object.keys(data).map(key => {
        let value = data[key];
        if (isValid(new Date(value))) {
          value = new Date(value).toLocaleDateString();
        }
        return (
          <div key={key}>
            <span className="italic">{key}:</span> {value}
          </div>
        );
      })}
    </CardContent>
    <CardFooter>
      <div className="flex gap-10">
        <Button variant="secondary" onClick={onCancel}>
          Go Back
        </Button>
        <Button onClick={() => onSubmit(data)}>Create {summaryTitle}</Button>
      </div>
    </CardFooter>
  </Card>
);

// TODO: Fix the type of formComponents
const FormCarousel = ({
  formComponents,
  carouselData,
  carouselTitle,
  submitHandler,
}: {
  formComponents: FC<CarouselScrollHandles>[];
  carouselData: Record<string, string>;
  carouselTitle: string;
  submitHandler: SubmitHandler<Record<string, string>>;
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
            onSubmit={submitHandler}
            onCancel={() => {
              if (carouselRef.current) carouselRef.current.scrollPrev();
            }}
          />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
};

export default FormCarousel;
