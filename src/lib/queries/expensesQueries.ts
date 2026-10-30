import { useQuery } from '@tanstack/react-query';

import type { Expense } from '@/payload-types';

/**
 * Loads one expense for the edit screen. Placeholder: resolves to null until the endpoint exists.
 *
 * @param id - The expense id. Undefined when adding a new expense; the query then stays idle.
 * @returns The react-query result holding the expense, or null.
 */
export function useExpenseQuery(id?: string) {
  return useQuery<Expense | null>({
    queryKey: ['expense', id],
    enabled: !!id,
    // shortcut: resolves to null instead of calling Payload, replace with the real fetch once the endpoint exists
    queryFn: async () => null,
  });
}

/**
 * Loads the expenses for one month. Placeholder: returns an empty list until the endpoint exists.
 *
 * @param year - Full year, e.g. 2026.
 * @param month - Zero-based month index (0 = January).
 * @returns The react-query result holding the month's expenses.
 */
export function useExpensesQuery(year: number, month: number) {
  return useQuery<Expense[]>({
    queryKey: ['expenses', year, month],
    // shortcut: returns [] instead of calling Payload, replace with the real fetch once the endpoint exists
    queryFn: async () => [],
  });
}
