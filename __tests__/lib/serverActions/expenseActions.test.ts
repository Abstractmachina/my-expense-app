import { createExpense, updateExpense, updateExpenses } from '@/lib/serverActions/expenseActions';

describe('expense server action placeholders', () => {
  it('createExpense rejects until the endpoint exists', async () => {
    await expect(createExpense({ amount: 1, category: 'food', date: '2026-10-25' })).rejects.toThrow(
      'createExpense: expenses endpoint not implemented yet',
    );
  });

  it('updateExpense rejects until the endpoint exists', async () => {
    await expect(updateExpense('abc', { amount: 2 })).rejects.toThrow(
      'updateExpense: expenses endpoint not implemented yet',
    );
  });

  it('updateExpenses rejects until the endpoint exists', async () => {
    await expect(updateExpenses({ category: { equals: 'food' } }, { category: 'health' })).rejects.toThrow(
      'updateExpenses: expenses endpoint not implemented yet',
    );
  });
});
