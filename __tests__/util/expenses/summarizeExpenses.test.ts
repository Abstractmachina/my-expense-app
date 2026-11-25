import { summarizeExpenses } from '@/util/expenses/summarizeExpenses';
import type { Expense } from '@/payload-types';

const makeExpense = (category: Expense['category'], amount: number): Expense =>
  ({ id: "1", category, amount, date: "2026-10-01", updatedAt: "2026-10-01" });

// October 15th, 2026: 31 days in the month.
const TODAY = new Date(2026, 9, 15);

describe('summarizeExpenses', () => {
  it('splits taxes and business into fixed and everything else into variable', () => {
    const summary = summarizeExpenses(
      [makeExpense('food', 30), makeExpense('taxes', 70), makeExpense('business', 50)],
      TODAY,
    );

    expect(summary.fixedTotal).toBe(120);
    expect(summary.variableTotal).toBe(30);
    expect(summary.monthlyTotal).toBe(150);
  });

  it('calculates the daily average and projected variable spend from the day of the month', () => {
    const summary = summarizeExpenses([makeExpense('food', 30)], TODAY);

    expect(summary.dailyVariable).toBeCloseTo(2);
    expect(summary.projectedVariable).toBeCloseTo(62);
  });

  it('sums amounts across expenses in the same category', () => {
    const summary = summarizeExpenses(
      [makeExpense('food', 10), makeExpense('food', 15), makeExpense('transport', 5)],
      TODAY,
    );

    expect(summary.variableTotal).toBe(30);
    expect(summary.count).toBe(3);
  });

  it('picks the category with the largest total as the top category', () => {
    const summary = summarizeExpenses(
      [makeExpense('food', 10), makeExpense('food', 15), makeExpense('taxes', 20)],
      TODAY,
    );

    expect(summary.topCategory).toBe('food');
  });

  it('treats a missing amount as zero', () => {
    const summary = summarizeExpenses([{ ...makeExpense('food', 0), amount: null }], TODAY);

    expect(summary.monthlyTotal).toBe(0);
  });

  it('returns zeros and no top category for an empty list', () => {
    const summary = summarizeExpenses([], TODAY);

    expect(summary).toEqual({
      count: 0,
      monthlyTotal: 0,
      fixedTotal: 0,
      variableTotal: 0,
      dailyVariable: 0,
      projectedVariable: 0,
      topCategory: null,
    });
  });
});
