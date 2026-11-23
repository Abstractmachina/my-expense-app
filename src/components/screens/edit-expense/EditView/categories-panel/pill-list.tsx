import {
  View,
  ScrollView,
  ScrollViewInstance,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import IndicatorDots from "./indicator-dots";
import PillButton from "./pill-button";
import { useRef, useState } from "react";

type LabeledItem = { value: string; label: string };

type Props<T extends LabeledItem> = {
  onSelect?: (value:string) => void;
  activeValue?: string | null;
  paginatedItems: T[][];
};

const PillList = <T extends LabeledItem>({ paginatedItems, onSelect, activeValue }: Props<T>) => {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // 1. Update the active dot when the user swipes/scrolls
  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const scrollLeft = e.nativeEvent.contentOffset.x;
    // Calculate which page we are mostly looking at
    const currentIndex = Math.round(scrollLeft / (pageWidth || 1));
    setActiveIndex(currentIndex);
  }

  // 2. Scroll to the correct page when a user taps a dot
  function scrollToPage(index: number) {
    scrollRef.current?.scrollTo({ x: index * pageWidth, animated: true });
  }

  return (
    <View className="flex flex-col gap-4">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        onLayout={(e) => setPageWidth(e.nativeEvent.layout.width)}
        className="flex overflow-x-auto snap-x snap-mandatory w-full pb-2 no-scrollbar"
      >
        {paginatedItems.map((page, pageIndex) => (
          <View
            key={pageIndex}
            style={{ width: pageWidth }}
            className="w-full flex-shrink-0 snap-start flex-row flex-wrap justify-between gap-y-3 gap-x-2 px-4"
          >
            {page.map((item) => (
              <PillButton
                key={item.value}
                // onPress={() => handleSelectCategory(category)}
                onPress={() => onSelect?.(item.value)}
                isActive={item.value === activeValue }
              >
                {item.label}
              </PillButton>
            ))}
          </View>
        ))}
      </ScrollView>

      <IndicatorDots
        items={paginatedItems}
        activeIndex={activeIndex}
        onPress={scrollToPage}
      />
    </View>
  );
};

export default PillList;
