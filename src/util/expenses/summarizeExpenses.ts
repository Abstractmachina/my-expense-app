import type { Expense } from "@/payload-types";

export type ExpenseSummary = {
  count: number;
  monthlyTotal: number;
  fixedTotal: number;
  variableTotal: number;
  dailyVariable: number;
  projectedVariable: number;
  topCategory: Expense["category"] | null;
};

// Categories counted as fixed costs. Everything else is variable.
const FIXED_CATEGORIES: ReadonlyArray<Expense["category"]> = ["taxes", "business"];

/**
 * Summarizes one month of expenses into totals, daily and projected figures, and the largest category.
 * Daily and projected figures are based on the day of the month of `today`.
 *
 * @param expenses - The expenses for the month.
 * @param today - The reference date for the day-of-month and days-in-month.
 * @returns The summary figures.
 */
export function summarizeExpenses(expenses: Expense[], today: Date): ExpenseSummary {
  const totals = new Map<Expense["category"], number>();
  for (const doc of expenses) {
    totals.set(doc.category, (totals.get(doc.category) ?? 0) + (doc.amount || 0));
  }

  let fixedTotal = 0;
  let variableTotal = 0;
  let topCategory: Expense["category"] | null = null;
  let topAmount = -Infinity;
  for (const [category, amount] of totals) {
    if (FIXED_CATEGORIES.includes(category)) fixedTotal += amount;
    else variableTotal += amount;
    if (amount > topAmount) {
      topAmount = amount;
      topCategory = category;
    }
  }

  const dayOfMonth = today.getDate();
  // Day 0 of the next month is the last day of this month.
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const dailyVariable = variableTotal / dayOfMonth;

  return {
    count: expenses.length,
    monthlyTotal: fixedTotal + variableTotal,
    fixedTotal,
    variableTotal,
    dailyVariable,
    projectedVariable: dailyVariable * daysInMonth,
    topCategory,
  };
}
