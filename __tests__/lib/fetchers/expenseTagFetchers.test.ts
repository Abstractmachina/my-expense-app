import * as SecureStore from 'expo-secure-store';

import { fetchExpenseTags } from '@/lib/fetchers/expenseTagFetchers';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
}));

const mockFetch = jest.fn();

beforeEach(() => {
  global.fetch = mockFetch as unknown as typeof fetch;
  mockFetch.mockReset();
  (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('test-key');
});

describe('fetchExpenseTags', () => {
  it('GETs the tags sorted by count with the stored key and returns docs', async () => {
    const docs = [{ id: 't1', name: 'food' }];
    mockFetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ docs }) });

    const result = await fetchExpenseTags();

    expect(result).toEqual(docs);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain('/api/expenseTags?');
    expect(url).toContain('sort=-count');
    expect(url).toContain('limit=false');
    expect(url).toContain('pagination=false');
    expect(init.method).toBe('GET');
    expect(init.headers.Authorization).toBe('users API-Key test-key');
  });

  it('throws when the request fails', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500, statusText: 'Server Error' });

    await expect(fetchExpenseTags()).rejects.toThrow('Error fetching expenses: Server Error');
  });
});
