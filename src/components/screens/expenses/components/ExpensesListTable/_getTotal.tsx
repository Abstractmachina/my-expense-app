export function _getTotal(vals: number[]): number {
  return vals.reduce((accumulator, currentVal) => accumulator + currentVal, 0);
}
