// DEPRECATED: moved to __tests__/util/arrays/chunkArray.test.ts (Jest). This file imports vitest, which is not installed. Safe to delete manually.
import { describe, it, expect } from 'vitest';
import { chunkArray } from './chunkArray';

describe('chunkArray', () => {
  it('should split an array into equally sized chunks', () => {
    const input = [1, 2, 3, 4, 5, 6];
    const result = chunkArray(input, 2);
    
    expect(result).toEqual([
      [1, 2], 
      [3, 4], 
      [5, 6]
    ]);
  });

  it('should handle arrays that do not divide evenly by the chunk size', () => {
    const input = [1, 2, 3, 4, 5];
    const result = chunkArray(input, 2);
    
    expect(result).toEqual([
      [1, 2], 
      [3, 4], 
      [5]
    ]);
  });

  it('should return a single chunk if the chunk size is larger than the array length', () => {
    const input = [1, 2, 3];
    const result = chunkArray(input, 5);
    
    expect(result).toEqual([
      [1, 2, 3]
    ]);
  });

  it('should return a single chunk if the chunk size exactly matches the array length', () => {
    const input = [1, 2, 3];
    const result = chunkArray(input, 3);
    
    expect(result).toEqual([
      [1, 2, 3]
    ]);
  });

  it('should return an empty array if the input array is empty', () => {
    const result = chunkArray([], 2);
    
    expect(result).toEqual([]);
  });

  it('should work correctly with different data types (strings, objects)', () => {
    const input = ['a', 'b', 'c'];
    const result = chunkArray(input, 2);
    
    expect(result).toEqual([
      ['a', 'b'], 
      ['c']
    ]);
  });

  // // Note: Your current function will create an infinite loop if chunkSize <= 0.
  // // If you update your function to throw an error for 0 or negative chunk sizes, 
  // // this is how you would test it:
  it('should throw an error if chunkSize is 0 or negative', () => {
    expect(() => chunkArray([1, 2, 3], 0)).toThrow();
    expect(() => chunkArray([1, 2, 3], -1)).toThrow();
  });
});