import { ExpenseTag } from "@/payload-types";
import qs from "qs";
import * as SecureStore from "expo-secure-store";

export async function fetchExpenseTags(): Promise<ExpenseTag[] | null> {
  const apiKey = await SecureStore.getItemAsync("backend_api_key");

  const query = {
    // date: range,
  };

  const queryString = qs.stringify(
    {
      sort: '-count',
      where: query,
      // depth: 3,
      limit: false,
      pagination: false,
    },
    { addQueryPrefix: true },
  );

  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/expenseTags${queryString}`,
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

  return json["docs"] as ExpenseTag[];
}