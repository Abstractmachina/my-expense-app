import * as SecureStore from 'expo-secure-store';

import { fetchExpense } from '@/lib/fetchers/expensesFetchers';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
}));

const mockFetch = jest.fn();

beforeEach(() => {
  global.fetch = mockFetch as unknown as typeof fetch;
  mockFetch.mockReset();
  (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('test-key');
});

describe('fetchExpense', () => {
  it('returns the expense from GET /api/expenses/:id with the stored key', async () => {
    const doc = { id: '559', amount: 12.5 };
    mockFetch.mockResolvedValue({ ok: true, status: 200, json: async () => doc });

    const result = await fetchExpense('559');

    expect(result).toEqual(doc);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain('/api/expenses/559');
    expect(init.headers.Authorization).toBe('users API-Key test-key');
  });

  it('returns null when Payload responds 404', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found' });

    await expect(fetchExpense('missing')).resolves.toBeNull();
  });

  it('throws on other failures', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500, statusText: 'Server Error' });

    await expect(fetchExpense('559')).rejects.toThrow('Error fetching expense: Server Error');
  });
});
