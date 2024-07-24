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
import { useSubmit } from 'react-router-dom';

export type SubmitHandler<T> = (data: T) => void | Promise<Response>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FormCarouselSummary<T extends Record<string, any>>({
  data,
  summaryTitle,
  onCancel,
}: {
  data: T;
  summaryTitle: string;
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
            <Button type="button" variant="secondary" onClick={onCancel}>
              Go Back
            </Button>
            <Button type="submit">Create {summaryTitle}</Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

//TODO: Fix the generic type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FormCarousel<T extends Record<string, any>>({
  formComponents,
  carouselData,
  carouselTitle,
}: {
  formComponents: FC<CarouselScrollHandles>[];
  carouselData: T;
  carouselTitle: string;
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
