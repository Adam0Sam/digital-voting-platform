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

export type SubmitHandler<T> = (data: T) => void | Promise<Response>;

function FormCarouselSummary<T extends Record<string, string>>({
  data,
  summaryTitle,
  onSubmit,
  onCancel,
}: {
  data: T;
  summaryTitle: string;
  onSubmit: SubmitHandler<T>;
  onCancel: () => void;
}) {
  return (
    <Card>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit(data);
        }}
      >
        <CardHeader>
          <CardTitle>{summaryTitle} Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(data).map(([key, value]) => {
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
            <Button type="submit">Create {summaryTitle}</Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

// TODO: Fix the type of formComponents
function FormCarousel<T extends Record<string, string>>({
  formComponents,
  carouselData,
  carouselTitle,
  submitHandler,
}: {
  formComponents: FC<CarouselScrollHandles>[];
  carouselData: T;
  carouselTitle: string;
  submitHandler: SubmitHandler<T>;
}) {
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
}

export default FormCarousel;
