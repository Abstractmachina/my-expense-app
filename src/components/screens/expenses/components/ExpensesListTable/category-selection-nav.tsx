import { ThemedText } from "@/components/styled-components/themed-text";
import { expenseCategoriesArray } from "@/lib/types/expenseCategories";
import { cn } from "@/util/ui";
import { ScrollView, View } from "react-native";
import { CATEGORY_COLORS } from "./CATEGORY_COLORS";

type Props = {};

const CategorySelectionNav = ({}: Props) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="flex flex-row items-center gap-2 h-12 px-2"
      className="grow-0"
    >
      {expenseCategoriesArray.map((category) => {
        return (
          <View
            key={category.value}
            className={cn(
              "flex flex-row items-center gap-1 border rounded-full p-2",
              CATEGORY_COLORS[category.value].border,
            )}
          >
            <View
              className={cn(
                "rounded-full size-2",
                CATEGORY_COLORS[category.value].bg,
              )}
            />
            <ThemedText className="text-xs">{category.label}</ThemedText>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default CategorySelectionNav;
