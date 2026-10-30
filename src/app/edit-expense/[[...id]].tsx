import { useLocalSearchParams, useRouter } from "expo-router";

import EditView from "@/components/screens/edit-expense/EditView";
import { useExpenseQuery } from "@/lib/queries/expensesQueries";
import { ThemedView } from "@/components/styled-components/themed-view";
import { ThemedText } from "@/components/styled-components/themed-text";

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

  // Render nothing rather than an empty add form while an existing expense loads.
  // if (expenseId && !existingDoc) return <EditView existingDoc={existingDoc ?? undefined} onSaved={goBack} onClose={goBack} />;

  return <EditView existingDoc={existingDoc ?? undefined} onSaved={goBack} onClose={goBack} />;
  // return <ThemedView >
  //   <ThemedText>Edit Expense</ThemedText>
  // </ThemedView>;
}
