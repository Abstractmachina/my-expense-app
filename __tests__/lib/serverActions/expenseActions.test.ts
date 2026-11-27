import * as SecureStore from 'expo-secure-store';

import {
  createExpense,
  deleteExpense,
  toPayloadExpense,
  updateExpense,
  updateExpenses,
} from '@/lib/serverActions/expenseActions';

// The key store is replaced so the tests do not need a device.
jest.mock('expo-secure-store', () => ({ getItemAsync: jest.fn() }));

const BACKEND = 'https://payload.test';
const newExpense = { amount: 1, category: 'food', date: '2026-10-25' } as const;
const fullTag = { id: 'tag-1', name: 'groceries' };

describe('toPayloadExpense', () => {
  it('replaces a populated tag object with its id', () => {
    expect(toPayloadExpense({ amount: 1, tag: fullTag })).toEqual({ amount: 1, tag: 'tag-1' });
  });

  it('leaves a tag id unchanged', () => {
    expect(toPayloadExpense({ tag: 'tag-1' })).toEqual({ tag: 'tag-1' });
  });

  it('leaves a null tag unchanged', () => {
    expect(toPayloadExpense({ tag: null })).toEqual({ tag: null });
  });

  it('leaves a missing tag unchanged', () => {
    expect(toPayloadExpense({ amount: 1 })).toEqual({ amount: 1 });
  });

  it('does not mutate the input', () => {
    const input = { tag: fullTag };
    toPayloadExpense(input);
    expect(input.tag).toBe(fullTag);
  });
});

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

  it('sends a populated tag as its id', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ doc: { id: '1' } }) });

    await createExpense({ ...newExpense, tag: fullTag });

    expect(fetchMock.mock.calls[0][1].body).toBe(JSON.stringify({ ...newExpense, tag: 'tag-1' }));
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

describe('updateExpense', () => {
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

  it('PATCHes the expense by id with the stored key', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ doc: { id: '559' } }) });

    await updateExpense('559', { amount: 2 });

    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('backend_api_key');
    expect(fetchMock).toHaveBeenCalledWith(`${BACKEND}/api/expenses/559`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'users API-Key secret-key',
      },
      body: JSON.stringify({ amount: 2 }),
    });
  });

  it('sends a populated tag as its id', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ doc: { id: '559' } }) });

    await updateExpense('559', { amount: 2, tag: fullTag });

    expect(fetchMock.mock.calls[0][1].body).toBe(JSON.stringify({ amount: 2, tag: 'tag-1' }));
  });

  it('encodes the id in the URL', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ doc: {} }) });

    await updateExpense('a/b', { amount: 2 });

    expect(fetchMock.mock.calls[0][0]).toBe(`${BACKEND}/api/expenses/a%2Fb`);
  });

  it('returns the updated document from the response', async () => {
    const doc = { id: '559', amount: 2 };
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ doc }) });

    await expect(updateExpense('559', { amount: 2 })).resolves.toEqual(doc);
  });

  it('throws with the status when the backend rejects the request', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found' });

    await expect(updateExpense('559', { amount: 2 })).rejects.toThrow(
      'Error updating expense: 404 Not Found',
    );
  });
});

describe('deleteExpense', () => {
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

  it('DELETEs the expense by id with the stored key', async () => {
    fetchMock.mockResolvedValue({ ok: true });

    await deleteExpense('559');

    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('backend_api_key');
    expect(fetchMock).toHaveBeenCalledWith(`${BACKEND}/api/expenses/559`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'users API-Key secret-key',
      },
    });
  });

  it('encodes the id in the URL', async () => {
    fetchMock.mockResolvedValue({ ok: true });

    await deleteExpense('a/b');

    expect(fetchMock.mock.calls[0][0]).toBe(`${BACKEND}/api/expenses/a%2Fb`);
  });

  it('throws with the status when the backend rejects the request', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 403, statusText: 'Forbidden' });

    await expect(deleteExpense('559')).rejects.toThrow('Error deleting expense: 403 Forbidden');
  });
});

describe('expense server action placeholders', () => {
  it('updateExpenses rejects until the endpoint exists', async () => {
    await expect(updateExpenses({ category: { equals: 'food' } }, { category: 'health' })).rejects.toThrow(
      'updateExpenses: expenses endpoint not implemented yet',
    );
  });
});
