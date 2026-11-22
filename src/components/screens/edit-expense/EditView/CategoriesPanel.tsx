import { useContext, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  ScrollViewInstance,
  View,
} from "react-native";

import { ThemedText } from "@/components/styled-components/themed-text";
import { cn } from "@/util/ui";
import { EditViewContext } from "./EditViewContext";
import Collapsible from "@/components/layout/Collapsible";
import { chunkArray } from "@/util/arrays/chunkArray";
import {
  expenseCategoriesArray,
  ExpenseCategory,
} from "@/lib/types/expenseCategories";

type Props = {};

const CategoriesPanel = (props: Props) => {
  const ctx = useContext(EditViewContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [pageWidth, setPageWidth] = useState(0);
  // Measured natural width of each label, keyed by category value
  const [labelWidths, setLabelWidths] = useState<Record<string, number>>({});

  const paginatedCategories = chunkArray<ExpenseCategory>(
    expenseCategoriesArray,
    9,
  );

  // 1. Update the active dot when the user swipes/scrolls
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollLeft = e.nativeEvent.contentOffset.x;
    // Calculate which page we are mostly looking at
    const currentIndex = Math.round(scrollLeft / (pageWidth || 1));
    setActiveIndex(currentIndex);
  };

  // 2. Scroll to the correct page when a user taps a dot
  const scrollToPage = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * pageWidth, animated: true });
  };

  function handleSelectCategory(category: ExpenseCategory) {
    ctx?.setSelectedCategory(category);
  }

  return (
    <Collapsible.Item>
      <Collapsible.Header className="flex flex-row justify-between items-center">
        <ThemedText type="h2">Category</ThemedText>
        <ThemedText type="description" numberOfLines={1}>{ctx?.selectedCategory?.label}</ThemedText>
      </Collapsible.Header>

      <Collapsible.Content>
        <View className="flex flex-col gap-4">
          {/* Hidden copy of every label, laid out unwrapped, to measure its natural width */}
          <View
            pointerEvents="none"
            style={{ position: "absolute", opacity: 0, alignItems: "flex-start" }}
          >
            {expenseCategoriesArray.map((category) => (
              <ThemedText
                key={category.value}
                type="description"
                onLayout={(e) =>
                  setLabelWidths((w) => ({
                    ...w,
                    [category.value]: e.nativeEvent.layout.width,
                  }))
                }
              >
                {category.label}
              </ThemedText>
            ))}
          </View>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            onLayout={(e) => setPageWidth(e.nativeEvent.layout.width)}
            className="flex overflow-x-auto snap-x snap-mandatory w-full pb-2 no-scrollbar"
          >
            {/* 3. Outer Map: The "Slides" */}
            {paginatedCategories.map((page, pageIndex) => (
              <View
                key={pageIndex}
                style={{ width: pageWidth }}
                className="w-full flex-shrink-0 snap-start flex-row flex-wrap gap-y-3 px-4"
              >
                {/* 4. Inner Map: The Buttons on this specific slide */}
                {page.map((category) => (
                  <Pressable
                    key={category.value}
                    // shortcut: uses a char-count guess until the first layout measures the label, so the first frame may briefly differ
                    style={{
                      flexBasis:
                        (labelWidths[category.value] ??
                          category.label.length * 10) + 42, // + px-4 padding, border, and 8px slack so labels don't wrap
                      flexGrow: category.label.length,
                      flexShrink: 0,
                    }}
                    className={cn(
                      "px-4 py-2 bg-neutral-800 text-white border border-white/50 rounded-full whitespace-nowrap flex flex-row justify-center text-nowrap",
                      ctx?.selectedCategory?.value === category.value &&
                        "bg-red-800 active:bg-red-600 hover:bg-red-800",
                    )}
                    onPress={() => handleSelectCategory(category)}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: ctx?.selectedCategory?.value === category.value,
                    }}
                  >
                    <ThemedText type="description" numberOfLines={1}>{category.label}</ThemedText>
                  </Pressable>
                ))}
              </View>
            ))}
          </ScrollView>

          {/* 3. Indicator Dots */}
          {/* Only render dots if there is more than 1 page */}
          {paginatedCategories.length > 1 && (
            <View className="flex flex-row justify-center items-center gap-2 h-4">
              {paginatedCategories.map((_, index) => (
                <Pressable
                  key={index}
                  onPress={() => scrollToPage(index)}
                  className={cn(
                    `appearance-none size-2 rounded-full shrink-0 transition-all duration-300 border-none p-0 m-0 opacity-75 ${
                      activeIndex === index
                        ? "bg-white" // Active state (a wider pill shape looks modern)
                        : "bg-white/40" // Inactive state
                    }`,
                  )}
                  accessibilityRole="button"
                  accessibilityLabel={`Go to page ${index + 1}`}
                />
              ))}
            </View>
          )}
        </View>
      </Collapsible.Content>
    </Collapsible.Item>
  );
};

export default CategoriesPanel;
