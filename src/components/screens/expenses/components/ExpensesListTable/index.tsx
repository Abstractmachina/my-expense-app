import { useMemo } from "react";

import Card from "@/components/layout/card";
import { ThemedText } from "@/components/styled-components/themed-text";
import { Expense, ExpenseTag } from "@/payload-types";
import { formatDateTime } from "@/util/formatDateTime";
import { roundToDecimal } from "@/util/math/round";
import { capitalizeFirstLetter } from "@/util/string/capitalizeFirstLetter";
import { Text, View } from "react-native";
import { formatCurrency } from "../../../../../util/currency/format-currency";

type Props = {
  expensesByDate?: Map<string, Expense[]>;
  expensesByCategory?: Map<string, Map<string, Expense[]>>;
  sortBy?: "date" | "category";
};

const ExpensesListTable = ({
  expensesByDate,
  expensesByCategory,
  sortBy,
}: Props) => {
  const total = useMemo(() => {
    if (sortBy === "date") {
      if (!expensesByDate) return 0;
      const result = _getTotal(
        Array.from(expensesByDate.values()).map((expenseArray) => {
          const sub = _getTotal(
            expenseArray.map((doc: Expense) => doc.amount || 0),
          );
          return sub;
        }),
      );
      return result;
    }
    if (sortBy === "category") {
      if (!expensesByCategory) return 0;
      const result = _getTotal(
        Array.from(expensesByCategory.values()).map((tagMap) => {
          const sub = _getTotal(
            Array.from(tagMap.values()).map((expenseArray) =>
              _getTotal(expenseArray.map((doc: Expense) => doc.amount || 0)),
            ),
          );
          return sub;
        }),
      );
      return result;
    }
  }, [expensesByDate, expensesByCategory, sortBy]);

  if (expensesByDate) {
    return (
      <View className="flex flex-col gap-4">
        {/* <Card className="bg-primary-400">
          <ThemedText className="text-sm">
            Monthly Total: {formatCurrency(total || 0)}
          </ThemedText>
        </Card> */}
        <Card id="expenses_list_table_container" className="w-full">
          {Array.from(expensesByDate).map(([key, val]) => {
            const total = _getTotal(val.map((doc: Expense) => doc.amount || 0));
            return (
              <View key={key} className="w-full mb-4">
                <View className="flex flex-row px-2 justify-between">
                  <ThemedText className="text-left pl-2">{key}</ThemedText>
                  <ThemedText className="text-right pr-2">
                    {formatCurrency(total)}
                  </ThemedText>
                </View>
                <View className="">
                  {val.map((doc: Expense, index: number) => (
                    <View key={key + "_" + index} className="flex-row">
                      <View className="pl-8 flex flex-row">
                        {/* <Link href={`/admin/collections/expenses/${doc.id}`}> */}
                        <ThemedText className="font-bold">
                          {sortBy === "category"
                            ? formatDateTime(doc.updatedAt || "")
                            : doc.category}
                        </ThemedText>
                        <ThemedText>
                          {" "}
                          {(doc.tag as ExpenseTag)?.name}
                        </ThemedText>
                        {/* </Link> */}
                        <ThemedText className="text-zinc-400 italic text-xxs ml-2">
                          {" "}
                          {doc.comment}
                        </ThemedText>
                      </View>
                      <ThemedText className="w-20 text-right pr-2">
                        {formatCurrency(doc.amount || 0)}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </Card>
      </View>
    );
  }

  if (expensesByCategory) {
    let variableExpenditure: number = 0;
    let fixedExpenditure: number = 0;
    for (const category of Array.from(expensesByCategory.keys())) {
      if (category === "taxes" || category === "business") {
        for (const expenses of Array.from(
          expensesByCategory.get(category)?.values() || [],
        )) {
          const total = _getTotal(
            expenses.map((doc: Expense) => doc.amount || 0),
          );
          fixedExpenditure += total;
        }
      } else {
        for (const expenses of Array.from(
          expensesByCategory.get(category)?.values() || [],
        )) {
          const total = _getTotal(
            expenses.map((doc: Expense) => doc.amount || 0),
          );
          variableExpenditure += total;
        }
      }
    }
    const today = new Date();
    const dayOfMonth = today.getDate();
    const dailyExpenditure = variableExpenditure / dayOfMonth;
    const now = new Date();
    // month is 0-indexed (Jan=0, Feb=1, etc.)
    // We get the next month and set the day to 0
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();
    const projectedExpenditure = dailyExpenditure * daysInMonth;
    return (
      <View className="flex flex-col gap-4">
        <View className="w-full bg-zinc-400 bg-opacity-25 p-8 rounded-md flex flex-col items-center justify-center">
          <ThemedText>
            Monthly Total: {formatCurrency(total || 0)}
          </ThemedText>
          <ThemedText>
            Variable: {formatCurrency(variableExpenditure)} | Fixed:{" "}
            {formatCurrency(fixedExpenditure)}
          </ThemedText>
          <ThemedText>
            Daily variable expenditure: {formatCurrency(dailyExpenditure)}
          </ThemedText>
          <ThemedText>
            Projected variable expenditure:{" "}
            {formatCurrency(projectedExpenditure)}
          </ThemedText>
          <ThemedText>
            Projected total expenditure:{" "}
            {formatCurrency(projectedExpenditure + fixedExpenditure)}
          </ThemedText>
        </View>
        <View id="expenses_list_table_container" className="w-full">
          {Array.from(expensesByCategory).map(([key, val]) => {
            const rawTotal = _getTotal(
              Array.from(val).map((group) => {
                return _getTotal(
                  group[1].map((doc: Expense) => doc.amount || 0),
                );
              }),
            );

            const total = roundToDecimal(rawTotal, 2);

            return (
              <View key={"categoryTable_" + key} className="w-full">
                <View className="flex-row px-2 bg-red-500/20 text-lg">
                  <Text className="text-left pl-4 py-2">
                    {capitalizeFirstLetter(key)}
                  </Text>
                  <Text className="text-right pr-4">{total}</Text>
                </View>
                <View className=" pl-4 w-full">
                  {Array.from(val).map(([key2, val2]) => {
                    return (
                      <View
                        key={"tagGroup_" + key2}
                        id={"tag-group-container_" + key2}
                        className="w-full"
                      >
                        <View className="w-full bg-opacity-50">
                          <View
                            id={"tag-group-table_" + key2}
                            className="w-full"
                          >
                            <View className="flex-row font-bold">
                              <Text className="text-left pl-8">{key2}</Text>
                              <Text className="text-right pr-8">
                                {formatCurrency(
                                  _getTotal(
                                    val2.map((doc: Expense) => doc.amount || 0),
                                  ),
                                )}
                              </Text>
                            </View>
                            <View className="bg-zinc-800">
                              {val2.map((doc: Expense, index: number) => {
                                return (
                                  <View
                                    key={key2 + "_" + index}
                                    className="flex-row"
                                  >
                                    <View className="pl-12 flex-1">
                                      {/* <Link
                                        href={`/admin/collections/expenses/${doc.id}`}
                                      > */}
                                      <Text className="font-bold">
                                        {sortBy === "category"
                                          ? formatDateTime(doc.date)
                                          : doc.category}
                                      </Text>
                                      {/* </Link> */}
                                      <Text className="text-zinc-400 italic text-xxs ml-2">
                                        {" "}
                                        {doc.comment}
                                      </Text>
                                    </View>
                                    <Text className="text-right pr-8">
                                      {formatCurrency(doc.amount || 0)}
                                    </Text>
                                  </View>
                                );
                              })}
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
  return null;
};

export default ExpensesListTable;

function _getTotal(vals: number[]): number {
  return vals.reduce((accumulator, currentVal) => accumulator + currentVal, 0);
}
