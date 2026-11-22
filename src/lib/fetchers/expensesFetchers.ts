import { Expense } from "@/payload-types";
import qs from "qs";
import * as SecureStore from "expo-secure-store";

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