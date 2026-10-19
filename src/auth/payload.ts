const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// PLACEHOLDER: the backend endpoint doesn't exist yet. Replace the path and the
// response shape once it does.
const VERIFY_KEY_PATH = '/api/verify-key';

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

  const res = await fetch(`${BACKEND_URL}${VERIFY_KEY_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
  });

  if (!res.ok) {
    return false;
  }

  const body: { valid?: boolean } = await res.json();
  return body.valid === true;
}
