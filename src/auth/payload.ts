import { VerifyResponseObject } from "@/lib/types/auth";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const VERIFY_KEY_PATH = "/api/verify-user";

/**
 * Checks an API key against the Payload backend before it is stored.
 *
 * @param key - The API key entered by the user.
 * @returns `true` if the backend accepts the key, `false` if it rejects it.
 * @throws If `EXPO_PUBLIC_BACKEND_URL` is missing or the request cannot be sent.
 */
export async function verifyApiKey(key: string): Promise<VerifyResponseObject> {
  if (!BACKEND_URL) {
    throw new Error("EXPO_PUBLIC_BACKEND_URL is not set");
  }

  const endpoint = `${BACKEND_URL}${VERIFY_KEY_PATH}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: key }),
  });

  if (!res.ok) {
    console.error("Failed to verify API key:", res.status, res.statusText);
    return {
      verified: false,
    };
  }

  const result = await res.json();

  if (!isVerifyResponse(result)) {
  throw new Error("Unexpected response from /api/verify-user");
  }
  
  return result;
}


function isVerifyResponse(body: unknown): body is VerifyResponseObject {
  return (
    typeof body === "object" &&
    body !== null &&
    typeof (body as { verified?: unknown }).verified === "boolean"
  );
}