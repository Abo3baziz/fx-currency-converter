export type HistoryRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";

const RANGE_DAYS: Record<HistoryRange, number> = {
  // Frankfurter is EOD data (no intraday), so 1D fetches the most recent
  // available daily close rather than intraday ticks.
  "1D": 7,
  "1W": 7,
  "1M": 31,
  "3M": 92,
  "1Y": 366,
  "5Y": 1827,
};

function isoDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getRangeDates(
  range: HistoryRange,
): { start: string; end: string } {
  return {
    start: isoDate(RANGE_DAYS[range]),
    end: isoDate(0),
  };
}