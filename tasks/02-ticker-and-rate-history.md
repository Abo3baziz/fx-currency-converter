# 02 - Ticker & Rate History

Status: pending
Priority: high

## Goal

Fix the live-markets ticker math and add the rate-history section: a line/area
chart with 1D/1W/1M/3M/1Y/5Y range tabs and open/last/change stats, plus a
friendly chart error state.

## Steps

1. `utils/calcChangeRate.ts`: fix the percentage to a true percent change
   (`(today - yesterday) / yesterday * 100`) instead of a raw difference; keep
   the sign formatting and `positiveChange` flag.
2. Install `recharts` (`npm install recharts`).
3. `features/RateHistory/`: new feature folder with:
   - `RateHistoryChart.tsx`: Recharts `AreaChart`/`LineChart` in a
     `ResponsiveContainer`, dark-themed tooltip, gradient fill from
     `--lime-500`.
   - Range tabs `1D | 1W | 1M | 3M | 1Y | 5Y` -> computes `start`/`end` and
     calls `getHistory(base, quote, start, end)` via `useQuery`.
   - Stats row: open, last, absolute change, percentage change for the
     selected range.
   - Error state: friendly "Chart error" message when the query fails (per
     challenge spec).
   - Note: Frankfurter is EOD data (no intraday), so the `1D` tab shows the
     best-effort recent daily point rather than intraday ticks.
4. Wire `RateHistoryChart` into the main page behind a tab (see task 03 for the
   tab component).

## Verify

- `npm run lint`
- `npm run build`
- Manual: switch ranges and confirm the series, stats, and axis update; trigger
  a fetch failure (offline) and confirm the error message renders.

## Definition of done

- Ticker percentages are mathematically correct.
- Chart renders for every range with correct stats.
- Chart error state shows a friendly message, not a broken chart.
- Lint and build pass.
