/**
 * Formats an amount with a currency symbol and two decimals, e.g. `€ 12.50`.
 *
 * @param val - The amount to format.
 * @param currency - `"eur"` (default) or `"usd"`.
 * @returns The symbol, a space, and the amount rounded to two decimals.
 */
export function formatCurrency(val: number, currency: "eur" | "usd" = "eur"): string {
  const symbol = currency === "usd" ? "$" : "€";
  return symbol +  (Math.round(val * 100) / 100).toFixed(2);
}
