const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6,
  minimumFractionDigits: 0,
});

export default function formatAmount(value: number): string {
  return numberFormatter.format(value);
}