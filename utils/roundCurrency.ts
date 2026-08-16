export default function roundCurrency(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}