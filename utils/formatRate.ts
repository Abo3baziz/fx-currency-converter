const rateFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
  minimumFractionDigits: 4,
});

export default function formatRate(value: number): string {
  return rateFormatter.format(value);
}