export function isPrime(n: number): boolean {
  if (n <= 1) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

export function getFactorPair(n: number): [number, number] | null {
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return [i, n / i];
  }
  return null;
}

export function isFullyFactored(n: number): boolean {
  return isPrime(n);
}

export function generateFactorTree(n: number): FactorTreeNode {
  if (isPrime(n)) {
    return { value: n, isPrime: true, children: [] };
  }
  
  const factorPair = getFactorPair(n);
  if (!factorPair) {
    return { value: n, isPrime: true, children: [] };
  }
  
  return {
    value: n,
    isPrime: false,
    children: [
      generateFactorTree(factorPair[0]),
      generateFactorTree(factorPair[1])
    ]
  };
}

export function getNextHint(currentTree: FactorTreeNode): string {
  if (currentTree.isPrime) {
    return "This number is prime - click 'Fully Factored'";
  }
  
  const factorPair = getFactorPair(currentTree.value);
  if (factorPair) {
    return `Factor ${currentTree.value} into ${factorPair[0]} × ${factorPair[1]}`;
  }
  
  return "This number should be prime - click 'Fully Factored'";
}

export function validateFactorPair(n: number, factor1: number, factor2: number): boolean {
  return factor1 * factor2 === n && factor1 > 1 && factor2 > 1;
}

export interface FactorTreeNode {
  value: number;
  isPrime: boolean;
  children: FactorTreeNode[];
}
