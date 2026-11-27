import * as SecureStore from 'expo-secure-store';

import qs from 'qs';

import { fetchExpense, fetchExpenses } from '@/lib/fetchers/expensesFetchers';

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

    await expect(fetchExpense('559')).rejects.toThrow('Error fetching expense 559: Server Error');
  });
});

describe('fetchExpenses', () => {
  it('returns null when the year or month is not a number', async () => {
    await expect(fetchExpenses({ year: NaN, month: 0 })).resolves.toBeNull();
    await expect(fetchExpenses({ year: 2026, month: NaN })).resolves.toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('queries the month range with the stored key and returns docs', async () => {
    const docs = [{ id: '1' }, { id: '2' }];
    mockFetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ docs }) });

    const result = await fetchExpenses({ year: 2026, month: 9 });

    expect(result).toEqual(docs);
    const [url, init] = mockFetch.mock.calls[0];
    const query = qs.parse(url.split('?')[1]) as { where: { date: Record<string, string> } };
    expect(query.where.date.greater_than_equal).toBe(new Date(2026, 9, 1).toISOString());
    expect(query.where.date.less_than_equal).toBe(new Date(2026, 10, 0).toISOString());
    expect(url).toContain('/api/expenses?');
    expect(url).toContain('limit=false');
    expect(url).toContain('pagination=false');
    expect(init.headers.Authorization).toBe('users API-Key test-key');
  });

  it('throws when the request fails', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500, statusText: 'Server Error' });

    await expect(fetchExpenses({ year: 2026, month: 9 })).rejects.toThrow(
      'Error fetching expenses: Server Error',
    );
  });
});
