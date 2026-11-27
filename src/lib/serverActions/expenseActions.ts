import type { Expense } from '@/payload-types';
import * as SecureStore from 'expo-secure-store';

/**
 * Converts a populated `tag` into the id Payload accepts. Payload rejects full objects.
 *
 * @param data - The expense fields about to be sent.
 * @returns A copy of `data` with a full `tag` document replaced by its id; otherwise `data` unchanged.
 */
export function toPayloadExpense(data: Partial<Expense>): Partial<Expense> {
  if (typeof data.tag !== 'object' || data.tag === null) return data;
  return { ...data, tag: data.tag.id };
}

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
    body: JSON.stringify(toPayloadExpense(data)),
  });

  if (!res.ok) {
    throw new Error(`Error creating expense: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as { doc: Expense };

  console.log("post result", json);
  return json.doc;
}

/**
 * Updates a single expense in Payload.
 *
 * @param id - The expense's Payload id.
 * @param data - The fields to change.
 * @returns The updated expense document.
 * @throws If the request fails or the backend responds with a non-OK status.
 */
export async function updateExpense(id: string, data: Partial<Expense>): Promise<Expense> {
  const apiKey = await SecureStore.getItemAsync('backend_api_key');

  

  const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/expenses/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `users API-Key ${apiKey}`,
    },
    body: JSON.stringify(toPayloadExpense(data)),
  });

  if (!res.ok) {
    throw new Error(`Error updating expense: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as { doc: Expense };
  return json.doc;
}

/**
 * Deletes a single expense in Payload.
 *
 * @param id - The expense's Payload id.
 * @returns Resolves once Payload confirms the delete.
 * @throws If the request fails or the backend responds with a non-OK status.
 */
export async function deleteExpense(id: string): Promise<void> {
  const apiKey = await SecureStore.getItemAsync('backend_api_key');

  const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/expenses/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `users API-Key ${apiKey}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Error deleting expense: ${res.status} ${res.statusText}`);
  }
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
