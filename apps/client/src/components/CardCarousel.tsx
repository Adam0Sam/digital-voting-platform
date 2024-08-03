import { forwardRef, ReactNode } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselScrollHandles,
} from './ui/carousel';

const CardCarousel = forwardRef<
  CarouselScrollHandles,
  { children: ReactNode[] }
>(function CardCarousel({ children }, ref) {
  return (
    <Carousel
      className="min-w-0 max-w-screen-md flex-1 px-2 md:px-10"
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
