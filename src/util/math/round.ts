export function roundToDecimal(num: number, decimal?: number) : string {

  return (Math.round(num * 100) / 100).toFixed(decimal || 2);
}