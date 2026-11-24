import * as SecureStore from 'expo-secure-store';

import { createExpense, updateExpense, updateExpenses } from '@/lib/serverActions/expenseActions';

// The key store is replaced so the tests do not need a device.
jest.mock('expo-secure-store', () => ({ getItemAsync: jest.fn() }));

const BACKEND = 'https://payload.test';
const newExpense = { amount: 1, category: 'food', date: '2026-10-25' } as const;

describe('createExpense', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    process.env.EXPO_PUBLIC_BACKEND_URL = BACKEND;
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('secret-key');
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POSTs the expense to the Payload collection with the stored key', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ doc: { id: '1' } }) });

    await createExpense(newExpense);

    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('backend_api_key');
    expect(fetchMock).toHaveBeenCalledWith(`${BACKEND}/api/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'users API-Key secret-key',
      },
      body: JSON.stringify(newExpense),
    });
  });

  it('returns the created document from the response', async () => {
    const doc = { id: '1', amount: 1 };
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ doc }) });

    await expect(createExpense(newExpense)).resolves.toEqual(doc);
  });

  it('throws with the status when the backend rejects the request', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 403, statusText: 'Forbidden' });

    await expect(createExpense(newExpense)).rejects.toThrow(
      'Error creating expense: 403 Forbidden',
    );
  });
});

describe('expense server action placeholders', () => {
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
