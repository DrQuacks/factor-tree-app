import {
  isPrime,
  getFactorPair,
  isFullyFactored,
  generateFactorTree,
  getNextHint,
  validateFactorPair
} from '../lib/factorUtils';

describe('factorUtils', () => {
  test('isPrime', () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(3)).toBe(true);
    expect(isPrime(4)).toBe(false);
    expect(isPrime(17)).toBe(true);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(0)).toBe(false);
    expect(isPrime(-7)).toBe(false);
  });

  test('getFactorPair', () => {
    expect(getFactorPair(6)).toEqual([2, 3]);
    expect(getFactorPair(15)).toEqual([3, 5]);
    expect(getFactorPair(13)).toBeNull();
    expect(getFactorPair(1)).toBeNull();
  });

  test('isFullyFactored', () => {
    expect(isFullyFactored(2)).toBe(true);
    expect(isFullyFactored(9)).toBe(false);
  });

  test('generateFactorTree', () => {
    const tree = generateFactorTree(6);
    expect(tree.value).toBe(6);
    expect(tree.isPrime).toBe(false);
    expect(tree.children[0].value).toBe(2);
    expect(tree.children[1].value).toBe(3);
    expect(tree.children[0].isPrime).toBe(true);
    expect(tree.children[1].isPrime).toBe(true);
  });

  test('getNextHint', () => {
    const tree = generateFactorTree(6);
    expect(getNextHint(tree)).toMatch(/Factor 6 into 2 × 3/);
    const primeTree = generateFactorTree(13);
    expect(getNextHint(primeTree)).toMatch(/prime/);
  });

  test('validateFactorPair', () => {
    expect(validateFactorPair(6, 2, 3)).toBe(true);
    expect(validateFactorPair(6, 1, 6)).toBe(false);
    expect(validateFactorPair(6, 2, 4)).toBe(false);
  });
}); 