import type { Expense } from '@/payload-types';
import * as SecureStore from 'expo-secure-store';

/**
 * Creates an expense in Payload.
 *
 * @param data - The expense fields to save.
 * @returns The created expense document.
 * @throws If the request fails or the backend responds with a non-OK status.
 */
export async function createExpense(data: Partial<Expense>): Promise<Expense> {
  const apiKey = await SecureStore.getItemAsync('backend_api_key');

  const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `users API-Key ${apiKey}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Error creating expense: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as { doc: Expense };

  console.log("post result", json);
  return json.doc;
}

/**
 * Placeholder for updating a single expense.
 *
 * @param _id - The expense id to update.
 * @param _data - The fields to change.
 * @throws Always, until the endpoint exists.
 */
export async function updateExpense(_id: string, _data: Partial<Expense>): Promise<Expense> {
  throw new Error('updateExpense: expenses endpoint not implemented yet');
}

/**
 * Placeholder for the batch update used by "Change Category".
 *
 * @param _where - Payload-style where clause selecting the expenses.
 * @param _data - The fields to set on each matching expense.
 * @returns Never resolves; see the throw.
 * @throws Always, until the endpoint exists.
 */
export async function updateExpenses(
  _where: Record<string, unknown>,
  _data: Partial<Expense>,
): Promise<{ docs: Expense[] }> {
  throw new Error('updateExpenses: expenses endpoint not implemented yet');
}
