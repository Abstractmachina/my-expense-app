import { useLocalSearchParams, useRouter } from "expo-router";

import EditView from "@/components/screens/edit-expense/EditView";
import { useExpenseQuery } from "@/lib/queries/expensesQueries";

/**
 * Add or edit an expense. `/edit-expense` adds a new one; `/edit-expense?id=<id>` edits that expense.
 *
 * @returns The route element, or null while an expense is loading.
 */
export default function ExpenseRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: existingDoc } = useExpenseQuery(id);

  // Deep links have no history to go back to, so fall back to the expenses list.
  const goBack = () => (router.canGoBack() ? router.back() : router.replace("/expenses"));

  return <EditView existingDoc={existingDoc ?? undefined} onSaved={goBack} onClose={goBack} />;
}
