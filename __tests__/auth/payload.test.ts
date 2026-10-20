const BACKEND_URL = 'https://backend.test';

/**
 * Loads `verifyApiKey` fresh so the module reads the `EXPO_PUBLIC_BACKEND_URL` value set for that test.
 *
 * @param url - The backend URL to expose to the module, or `undefined` to leave it unset.
 * @returns The `verifyApiKey` function from a freshly loaded module.
 */
function loadVerifyApiKey(url: string | undefined): typeof import('@/auth/payload').verifyApiKey {
  if (url === undefined) {
    delete process.env.EXPO_PUBLIC_BACKEND_URL;
  } else {
    process.env.EXPO_PUBLIC_BACKEND_URL = url;
  }

  let verifyApiKey!: typeof import('@/auth/payload').verifyApiKey;
  jest.isolateModules(() => {
    ({ verifyApiKey } = require('@/auth/payload'));
  });
  return verifyApiKey;
}

/**
 * Mocks `fetch` to return a response with the given status and body.
 *
 * @param ok - Whether the mocked response reports success.
 * @param body - The JSON body the mocked response returns.
 * @returns The mocked `fetch` function.
 */
function mockFetch(ok: boolean, body: unknown): jest.Mock {
  const fetchMock = jest.fn().mockResolvedValue({ ok, json: async () => body });
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

describe('verifyApiKey', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('posts the key as apiKey to the verify endpoint and returns the parsed body', async () => {
    const verifyApiKey = loadVerifyApiKey(BACKEND_URL);
    const fetchMock = mockFetch(true, { valid: true });

    await expect(verifyApiKey('secret')).resolves.toEqual({ valid: true });
    expect(fetchMock).toHaveBeenCalledWith(
      `${BACKEND_URL}/api/verify-user`,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ apiKey: 'secret' }) })
    );
  });

  it('returns false when the backend responds with an error status', async () => {
    const verifyApiKey = loadVerifyApiKey(BACKEND_URL);
    mockFetch(false, { valid: true });

    await expect(verifyApiKey('secret')).resolves.toBe(false);
  });

  it('returns the response body as-is when the key is not marked valid', async () => {
    const verifyApiKey = loadVerifyApiKey(BACKEND_URL);
    mockFetch(true, { valid: 'yes' });

    await expect(verifyApiKey('secret')).resolves.toEqual({ valid: 'yes' });
  });

  it('throws when EXPO_PUBLIC_BACKEND_URL is not set', async () => {
    const verifyApiKey = loadVerifyApiKey(undefined);
    const fetchMock = mockFetch(true, { valid: true });

    await expect(verifyApiKey('secret')).rejects.toThrow('EXPO_PUBLIC_BACKEND_URL is not set');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
