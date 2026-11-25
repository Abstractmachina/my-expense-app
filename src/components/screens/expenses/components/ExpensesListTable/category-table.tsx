import { ThemedText } from "@/components/styled-components/themed-text";
import { Expense } from "@/payload-types";
import { formatCurrency } from "@/util/currency/format-currency";
import { formatDateTime } from "@/util/formatDateTime";
import { getTotal } from "@/util/math/getTotal";
import { capitalizeFirstLetter } from "@/util/string/capitalizeFirstLetter";
import { cn } from "@/util/ui";
import { View } from "react-native";
import { CATEGORY_COLORS, CategoryType } from "./CATEGORY_COLORS";
import Card from "@/components/layout/card";

type Props = {
  expenses: Map<string, Map<string, Expense[]>>;
};

const CategoryTable = ({ expenses }: Props) => {
  let variableExpenditure: number = 0;
  let fixedExpenditure: number = 0;
  for (const category of Array.from(expenses.keys())) {
    if (category === "taxes" || category === "business") {
      for (const group of Array.from(expenses.get(category)?.values() || [])) {
        const total = getTotal(group.map((doc: Expense) => doc.amount || 0));
        fixedExpenditure += total;
      }
    } else {
      for (const group of Array.from(expenses.get(category)?.values() || [])) {
        const total = getTotal(group.map((doc: Expense) => doc.amount || 0));
        variableExpenditure += total;
      }
    }
  }

  return (
    <View
      id="expenses_list_table_container"
      className="w-full flex flex-col gap-2"
    >
      {Array.from(expenses).map(([key, val], index) => {
        const total = getTotal(
          Array.from(val).map((group) =>
            getTotal(group[1].map((doc: Expense) => doc.amount || 0)),
          ),
        );

        return (
          <Card
            key={"categoryTable_" + key}
            className="w-full border border-fg-500/25"
          >
            <View className="flex flex-row justify-between">
              <ThemedText
                className={cn(
                  "text-left font-bold text-fg-500",
                  CATEGORY_COLORS[key as CategoryType].text,
                )}
              >
                {capitalizeFirstLetter(key)}
              </ThemedText>
              <ThemedText
                className={cn(
                  "text-right pr-2 font-bold text-fg-500",
                  CATEGORY_COLORS[key as CategoryType].text,
                )}
              >
                {formatCurrency(total)}
              </ThemedText>
            </View>
            {Array.from(val).map(([key2, val2]) => (
              <View
                key={"tagGroup_" + key2}
                id={"tag-group-container_" + key2}
                className="w-full"
              >
                <View className="flex flex-row justify-between">
                  <ThemedText className="text-left text-fg-300 font-medium">
                    {key2}
                  </ThemedText>
                  <ThemedText className="text-right pr-2 text-fg-300">
                    {formatCurrency(
                      getTotal(val2.map((doc: Expense) => doc.amount || 0)),
                    )}
                  </ThemedText>
                </View>
                {val2.map((doc: Expense, docIndex: number) => (
                  <View
                    key={key2 + "_" + docIndex}
                    className="flex-row justify-between pl-4"
                  >
                    <View className="flex flex-row items-center gap-2">
                      <ThemedText className="text-fg-500 italic text-sm">
                        {formatDateTime(doc.date)}
                      </ThemedText>
                      {doc.comment && (
                        <ThemedText className="text-fg-500 italic text-xs ml-1 border border-bg-300 px-2 rounded-sm">
                          {doc.comment}
                        </ThemedText>
                      )}
                    </View>
                    <ThemedText className="w-20 text-right text-sm pr-2 text-fg-500">
                      {formatCurrency(doc.amount || 0, { noSymbol: true })}
                    </ThemedText>
                  </View>
                ))}
              </View>
            ))}
          </Card>
        );
      })}
    </View>
  );
};

export default CategoryTable;
