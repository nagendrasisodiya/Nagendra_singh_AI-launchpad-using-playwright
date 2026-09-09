export function parseMoney(amountText: string): number {
  return Number(amountText.replace(/[^0-9.-]/g, ''));
}

export function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function areClose(actual: number, expected: number, tolerance = 0.01): boolean {
  return Math.abs(actual - expected) <= tolerance;
}

