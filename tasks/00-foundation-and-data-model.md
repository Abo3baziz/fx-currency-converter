# 00 - Foundation & Data Model

Status: done
Priority: high

## Goal

Baseline the repository: commit in-flight work, expand the currency catalog to
all 60 flags with names and popularity groups, rebuild the API layer around the
Frankfurter endpoints the challenge recommends, and redesign the store with
persisted favorites/log/tab state.

## Steps

1. Commit current uncommitted work (app/, components/, features/, assets/,
   hooks/, AGENTS.md) with a conventional commit.
2. `assets/data/flags.ts`: expand to all 60 currencies present in
   `public/images/flags/`; add `name` (e.g. "US Dollar") and
   `group: "popular" | "other"` to every entry; keep `flag` filename mapping.
3. `Types.ts`: add a `Currency` type (`{ currency, flag, name, group }`); add
   types for API responses (`LatestRates`, `HistoryPoint`, `RateSeries`).
4. `services/api.ts`: replace the current `?date=` array fetch with typed
   functions that throw on `!res.ok` and surface errors via the UI:
   - `getCurrencies()` -> `GET /v2/currencies`
   - `getLatest(base)` -> `GET /v2/latest?base=...` (object form)
   - `getPairRate(base, quote)` -> `GET /v2/latest?base&symbols=...`
   - `getHistory(base, quote, start, end)` -> `GET /v2/{start}..{end}?base&symbols`
   - `getTickerRates()` -> today + previous business day for the 24h marquee
5. `features/CurrencyConverter/store/useCurrencyStore.ts`: add `amount` +
   `setAmount` + `swap` action; wire `zustand/middleware` `persist` for
   `favorites`, `conversionLog`, and `activeTab` (localStorage).
6. `features/CurrencyConverter/components/CurrencyOption.tsx`: remove the stray
   `console.log` on line 18.

## Verify

- `npm run lint`
- `npm run build`
- Manual: `npm run dev` — currency dropdown lists 60 entries with names; API
  calls return real Frankfurter data; store survives a reload.

## Definition of done

- flags.ts has 60 currencies, each with flag, name, and group; header copy
  updated to match (60 currencies).
- API layer is typed and throws on non-OK responses; no `?date=` array fetch
  remains.
- Store persists favorites/log/tab across reloads.
- Lint and build pass.
