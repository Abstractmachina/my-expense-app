const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const VERIFY_KEY_PATH = '/api/verify-user';

/**
 * Checks an API key against the Payload backend before it is stored.
 *
 * @param key - The API key entered by the user.
 * @returns `true` if the backend accepts the key, `false` if it rejects it.
 * @throws If `EXPO_PUBLIC_BACKEND_URL` is missing or the request cannot be sent.
 */
export async function verifyApiKey(key: string): Promise<boolean> {
  if (!BACKEND_URL) {
    throw new Error('EXPO_PUBLIC_BACKEND_URL is not set');
  }

  const endpoint = `${BACKEND_URL}${VERIFY_KEY_PATH}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey:key }),
  });

  if (!res.ok) {
    return false;
  }

  const result = await res.json();
  return result;
}
