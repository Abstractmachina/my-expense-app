// DEPRECATED: replaced by src/app/edit-expense.tsx. Flagged for manual removal (do not rely on this file).
import { useLocalSearchParams, useRouter } from "expo-router";

import EditView from "@/components/screens/edit-expense/EditView";
import { useExpenseQuery } from "@/lib/queries/expensesQueries";

/**
 * Add or edit an expense. `/expense` adds a new one; `/expense/<id>` edits that expense.
 *
 * @returns The route element, or null while an expense is loading.
 */
export default function ExpenseRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string[] }>();
  const expenseId = id?.[0];
  const { data: existingDoc } = useExpenseQuery(expenseId);

  // Deep links have no history to go back to, so fall back to the expenses list.
  const goBack = () => (router.canGoBack() ? router.back() : router.replace("/expenses"));


  return <EditView existingDoc={existingDoc ?? undefined} onSaved={goBack} onClose={goBack} />;

}
