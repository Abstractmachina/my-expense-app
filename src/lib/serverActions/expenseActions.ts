import type { Expense } from '@/payload-types';

/**
 * Placeholder for the Payload expense endpoints. Each call rejects until the API is wired up,
 * so a save shows an error instead of silently dropping data.
 *
 * @throws Always, with a message that the endpoint is not implemented yet.
 */
export async function createExpense(_data: Partial<Expense>): Promise<Expense> {
  throw new Error('createExpense: expenses endpoint not implemented yet');
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
