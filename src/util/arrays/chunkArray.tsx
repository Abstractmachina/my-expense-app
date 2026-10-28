export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  if (chunkSize <= 0) {
    throw new Error('Chunk size must be greater than 0');
  }
  
  const buckets: T[][] = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    // slice extracts a section of the array without modifying the original
    buckets.push(array.slice(i, i + chunkSize));
  }

  return buckets;
}
