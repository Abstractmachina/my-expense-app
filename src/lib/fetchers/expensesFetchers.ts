import { Expense } from "@/payload-types";
import qs from "qs";
import * as SecureStore from "expo-secure-store";

/**
 * Fetches a single expense by id from Payload.
 *
 * @param id - The expense's Payload id.
 * @returns The expense, or null if Payload returns 404.
 * @throws If the request fails for any other reason.
 */
export async function fetchExpense(id: string): Promise<Expense | null> {
  const apiKey = await SecureStore.getItemAsync("backend_api_key");

    const queryString = qs.stringify(
    {
      // where: query,
      depth: 3,
    },
    { addQueryPrefix: true },
  );

  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/expenses/${encodeURIComponent(id)}${queryString}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `users API-Key ${apiKey}`,
      },
    },
  );

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Error fetching expense ${id}: ${res.statusText}`);
  }
  return (await res.json()) as Expense;
}


/**
 * Fetches all expenses in a month from Payload.
 *
 * @param args - The year and zero-based month to fetch.
 * @returns The month's expenses, or null for invalid input.
 */
export async function fetchExpenses(args: {
  year: number;
  month: number;
}): Promise<Expense[] | null> {
  const { year, month } = args;
  if (Number.isNaN(year) || Number.isNaN(month)) return null;

  const startISO = new Date(year, month, 1).toISOString();
  const endISO = new Date(year, month + 1, 0).toISOString();
  const range = { greater_than_equal: startISO, less_than_equal: endISO };

  const apiKey = await SecureStore.getItemAsync("backend_api_key");

  const query = {
    date: range,
  };

  const queryString = qs.stringify(
    {
      // sort: "-createdAt",
      where: query,
      // locale: locale ? locale : "en",
      depth: 3,
      limit: false,
      pagination: false,
    },
    { addQueryPrefix: true },
  );

  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/expenses${queryString}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `users API-Key ${apiKey}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Error fetching expenses: ${res.statusText}`);
  }
  const json = await res.json();

  return json["docs"] as Expense[];
}