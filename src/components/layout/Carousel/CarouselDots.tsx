import { Pressable, View } from 'react-native';
import { useCarousel } from './CarouselContext';
import { cn } from '@/util/ui';

type Props = {
  className?: string;
};

/**
 * Page dots. Tapping one scrolls to that page. Hidden when there is one page or fewer.
 *
 * @param {Props} props - Optional `className` for the dot row
 * @returns {JSX.Element | null} The dot row, or null when there is nothing to page through
 */
const CarouselDots = ({ className }: Props) => {
  const { pageCount, activeIndex, scrollTo } = useCarousel();

  // Hide dots if there is only 1 page or less
  if (pageCount <= 1) return null;

  return (
    <View className={cn('flex-row justify-center items-center gap-2', className)}>
      {Array.from({ length: pageCount }).map((_, index) => (
        <Pressable
          key={index}
          onPress={() => scrollTo(index)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Go to page ${index + 1}`}
          className={cn(
            'size-2 rounded-full',
            activeIndex === index ? 'bg-primary' : 'bg-muted-foreground/40',
          )}
        />
      ))}
    </View>
  );
};

export default CarouselDots;
