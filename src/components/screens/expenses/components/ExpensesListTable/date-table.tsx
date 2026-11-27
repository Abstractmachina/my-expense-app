import Card from "@/components/layout/card";
import { Link } from "expo-router";
import { ThemedText } from "@/components/styled-components/themed-text";
import { Expense, ExpenseTag } from "@/payload-types";
import { formatCurrency } from "@/util/currency/format-currency";
import { isEqualToformattedDates } from "@/util/formatDateTime";
import { getTotal } from "@/util/math/getTotal";
import { cn } from "@/util/ui";
import { View } from "react-native";
import { CATEGORY_COLORS } from "./CATEGORY_COLORS";
import { Separator } from "@/components/rnr/separator";

type Props = {
  expensesByDate?: Map<string, Expense[]>;
};

const DateTable = ({ expensesByDate }: Props) => {
  if (!expensesByDate) return null;

  return (
    <View id="expenses_list_table_container" className="w-full px-4">
      {Array.from(expensesByDate).map(([key, val], index) => {
        const total = getTotal(val.map((doc: Expense) => doc.amount || 0));
        // Keys are "dd/mm/yy"; the label shows "dd.mm".
        const dayMonth = key.split("/").slice(0, 2).join(".");
        return (
          <View key={key} className="w-full mb-4">
            {index > 0 && <Separator />}
            <View className="flex flex-row justify-between mt-2">
              <ThemedText className="text-left font-bold text-fg-500">
                {isEqualToformattedDates(new Date().toISOString(), key)
                  ? `Today ${dayMonth}`
                  : dayMonth}
              </ThemedText>
              <ThemedText className="text-right pr-2 font-bold text-fg-500">
                {formatCurrency(total)}
              </ThemedText>
            </View>
            <View className="">
              {val.map((doc: Expense, index: number) => (
                <View
                  key={key + "_" + index}
                  className="flex-row justify-between"
                >
                  <View className="flex flex-row items-center gap-2">
                    <View
                      className={cn(
                        "size-2 rounded-full",
                        CATEGORY_COLORS[doc.category].bg,
                      )}
                    />
                    <Link href={{ pathname: "/edit-expense", params: { id: String(doc.id) } }}>
                      <ThemedText className="text-fg-300">
                        {(doc.tag as ExpenseTag)?.name}
                      </ThemedText>
                    </Link>
                    {doc.comment && (
                      <ThemedText className="text-fg-500 italic text-xs ml-1 border border-bg-300 px-2 rounded-sm">
                        {doc.comment}
                      </ThemedText>
                    )}
                  </View>
                  <ThemedText className="w-20 text-right pr-2 text-fg-300">
                    {formatCurrency(doc.amount || 0, { noSymbol: true })}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default DateTable;
