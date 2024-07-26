import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselScrollHandles,
} from './ui/carousel';
import { Button } from './ui/button';
import { forwardRef, ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { isValid } from 'date-fns';
import { useSubmit } from 'react-router-dom';

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
            // if(Array.isArray(value)) {
            //   if()
            // }
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

const CardCarousel = forwardRef<
  CarouselScrollHandles,
  { children: ReactNode[] }
>(function CardCarousel({ children }, ref) {
  return (
    <Carousel
      className="min-w-0 max-w-screen-lg flex-1 px-2 md:px-10"
      opts={{ watchDrag: false }}
      ref={ref}
    >
      <CarouselContent>
        {children?.map((child, index) => (
          <CarouselItem key={index}>{child}</CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
});

export default CardCarousel;
