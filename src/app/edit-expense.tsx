import { useLocalSearchParams, useRouter } from "expo-router";

import EditView from "@/components/screens/edit-expense/EditView";

/**
 * Add or edit an expense. `/edit-expense` adds a new one; `/edit-expense?id=<id>` edits that expense.
 *
 * @returns The edit view for the expense in the query string, or a new one.
 */
export default function ExpenseRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  // Deep links have no history to go back to, so fall back to the expenses list.
  const goBack = () => (router.canGoBack() ? router.back() : router.replace("/expenses"));

  return <EditView id={id} onSaved={goBack} onClose={goBack} />;
}
