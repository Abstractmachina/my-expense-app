import { ComponentRef, PropsWithChildren, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { CarouselContext } from './CarouselContext';
import { cn } from '@/util/ui';

type Props = {className?: string};

/**
 * Holds the carousel state and measures the page width.
 *
 * @param {Props & PropsWithChildren} props - Optional `className` for the wrapper and the carousel children
 * @returns {JSX.Element} The provider wrapping the carousel children
 */
const CarouselProvider = ({ children, className }: Props & PropsWithChildren) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);

  /**
   * Scrolls to a page and marks it active. Programmatic scrolls don't fire the
   * momentum event on iOS, so the active index is set here as well.
   *
   * @param {number} index - Zero-based page to show
   * @returns {void}
   */
  const scrollTo = (index: number) => {
    setActiveIndex(index);
    scrollRef.current?.scrollTo({ x: index * pageWidth, animated: true });
  };

  return (
    <CarouselContext.Provider
      value={{
        activeIndex,
        setActiveIndex,
        scrollRef,
        scrollTo,
        pageWidth,
        setPageWidth,
        pageCount,
        setPageCount,
      }}
    >
      <View
        onLayout={(e) => setPageWidth(e.nativeEvent.layout.width)}
        className={cn(`relative flex flex-col gap-4 w-full`, className)}
      >
        {children}
      </View>
    </CarouselContext.Provider>
  );
};

export default CarouselProvider;
