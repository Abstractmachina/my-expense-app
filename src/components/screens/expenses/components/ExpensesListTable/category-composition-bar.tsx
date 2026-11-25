import { Expense } from "@/payload-types";
import { cn } from "@/util/ui";
import { useMemo } from "react";
import { View } from "react-native";
import { CATEGORY_COLORS, CategoryType } from "./CATEGORY_COLORS";

type Props = {
  expenses?: Expense[] | null;
};

const CategoryCompositionBar = ({ expenses }: Props) => {
  const ratios = useMemo(() => {
    if (!expenses || expenses.length === 0)
      return new Map<CategoryType, number>();

    const result = new Map<CategoryType, number>();
    let total = 0;

    expenses.forEach((expense) => {
      const category = expense.category;
      const amount = expense.amount || 0;
      total += amount;
      const current = result.get(category);
      result.set(category, current ? current + amount : amount);
    });

    // All-zero amounts would divide by zero (NaN segments), so show an empty bar instead.
    if (total === 0) return new Map<CategoryType, number>();

    // Calculate ratios
    for (const [category, amount] of result.entries()) {
      result.set(category, amount / total);
    }

    // Largest segment first.
    return new Map([...result.entries()].sort((a, b) => b[1] - a[1]));
  }, [expenses]);

  return (
    <View className="w-full h-3 rounded-full flex flex-row items-center justify-between bg-primary-400/10 border border-primary-400/25 overflow-hidden">
      {Array.from(ratios.entries()).map(([category, ratio]) => (
        <View
          key={category}
          className={cn(CATEGORY_COLORS[category].bg, "h-full")}
          style={{ flex: ratio }}
        />
      ))}
    </View>
  );
};

export default CategoryCompositionBar;
