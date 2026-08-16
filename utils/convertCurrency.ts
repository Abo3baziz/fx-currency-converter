export default function convertCurrency(
  amount: number,
  rate: number,
): number {
  return amount * rate;
}

export function convertReverse(
  amount: number,
  rate: number,
): number {
  return amount / rate;
}