import { PropsWithChildren } from 'react';

import React, { useEffect } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';
import { useCarousel } from './CarouselContext';
import { cn } from '@/util/ui';

type Props = {
  className?: string;
};

/**
 * Horizontal paging ScrollView that holds the carousel pages.
 *
 * @param {Props & PropsWithChildren} props - Pages to show, plus an optional `className`
 * @returns {JSX.Element} The paging ScrollView
 */
const CarouselContent = ({ children, className }: Props & PropsWithChildren) => {
  const { scrollRef, setActiveIndex, setPageCount } = useCarousel();

  // Automatically count how many items exist to generate the dots
  useEffect(() => {
    setPageCount(React.Children.count(children));
  }, [children, setPageCount]);

  /**
   * Sets the active dot once a swipe settles on a page.
   *
   * @param {NativeSyntheticEvent<NativeScrollEvent>} e - Scroll event from the ScrollView
   * @returns {void}
   */
  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { x } = e.nativeEvent.contentOffset;
    const { width } = e.nativeEvent.layoutMeasurement;
    // Calculate current index based on scroll position
    setActiveIndex(Math.round(x / width));
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      className={cn('w-full', className)}
    >
      {children}
    </ScrollView>
  );
};

export default CarouselContent;
