/**
 * Formats an amount with a currency symbol and two decimals, e.g. `€12.50`.
 *
 * @param val - The amount to format.
 * @param options - Optional settings.
 * @param options.currency - `"eur"` (default) or `"usd"`.
 * @param options.noSymbol - When true, omits the currency symbol.
 * @returns The symbol followed by the amount rounded to two decimals.
 */
export function formatCurrency(val: number, options: { currency?: "eur" | "usd", noSymbol?: boolean } = {}): string {
  const { currency = "eur", noSymbol = false } = options;
  const symbol = noSymbol ? "" : currency === "usd" ? "$" : "€";
  return symbol +  (Math.round(val * 100) / 100).toFixed(2);
}
