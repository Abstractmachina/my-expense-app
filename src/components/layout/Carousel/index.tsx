import { PropsWithChildren } from 'react';
import CarouselProvider from './CarouselProvider';
import CarouselContent from './CarouselContent';
import CarouselItem from './CarouselItem';
import CarouselDots from './CarouselDots';

type Props = {};

const Carousel = (props: Props & PropsWithChildren) => {
  return (
    <CarouselProvider>
      {props.children}
    </CarouselProvider>
  );
};

Carousel.Content = CarouselContent;
Carousel.Item = CarouselItem;
Carousel.Dots = CarouselDots;

export default Carousel;
