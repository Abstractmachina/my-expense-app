export function getTotal(input: number[]) {
  return input.reduce((acc, curr) => acc + curr, 0);
}