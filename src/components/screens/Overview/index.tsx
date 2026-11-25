import { useMemo, useState } from "react";

import { ThemedText } from "@/components/styled-components/themed-text";
import { ThemedView } from "@/components/styled-components/themed-view";
import { useExpensesQuery } from "@/lib/queries/expensesQueries";
import { getExpenseCategory } from "@/lib/types/expenseCategories";
import { formatCurrency } from "@/util/currency/format-currency";
import { summarizeExpenses } from "@/util/expenses/summarizeExpenses";

type Props = {};

/**
 * Summary panels for the current month's expenses. Each panel shows one figure.
 *
 * @returns The overview element.
 */
const Overview = (props: Props) => {
  const [today] = useState(() => new Date());
  const expensesQuery = useExpensesQuery(today.getFullYear(), today.getMonth());

  const summary = useMemo(
    () => summarizeExpenses(expensesQuery.data ?? [], today),
    [expensesQuery.data, today],
  );

  const topCategoryLabel = summary.topCategory
    ? (getExpenseCategory(summary.topCategory)?.label ?? summary.topCategory)
    : "—";

  const panels = [
    { label: "Total this month", value: formatCurrency(summary.monthlyTotal) },
    { label: "Daily average", value: formatCurrency(summary.dailyVariable) },
    { label: "Projected total", value: formatCurrency(summary.projectedVariable + summary.fixedTotal) },
    { label: "Fixed costs", value: formatCurrency(summary.fixedTotal) },
    { label: "Top category", value: topCategoryLabel },
    { label: "Expenses logged", value: String(summary.count) },
  ];

  return (
    <ThemedView className="flex-row flex-wrap gap-3">
      {panels.map(({ label, value }) => (
        <ThemedView
          key={label}
          type="backgroundElement"
          className="w-[47%] gap-1 rounded-2xl p-4"
        >
          <ThemedText type="small" themeColor="textSecondary">
            {label}
          </ThemedText>
          <ThemedText type="h2">{value}</ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
};

export default Overview;
