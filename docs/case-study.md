---
title: 'FX Checker — a dark-themed live currency converter with ECB/EOD data'
slug: 'fx-currency-converter'
description: 'FX Checker converts 57 currencies against live ECB/EOD rates from the Frankfurter API, with a scrolling ticker, historical charts, pair comparison, favorites, and a conversion log. Built with Next.js 16, React 19, Zustand, and TanStack Query.'
tags: [typescript, next.js, react, tailwindcss, zustand, tanstack-query, recharts, currency-converter, frontend-mentor, vercel]
image: 'public/preview.jpg'
github: 'https://github.com/Abo3baziz/fx-currency-converter'
demo: 'https://fx-currency-converter-nine.vercel.app'
date: '2026-06-19'
visible: true
featured: true
---

# FX Checker — Case Study

## Overview

FX Checker is a dark-themed foreign-exchange converter. A scrolling "LIVE
MARKETS" marquee streams ECB end-of-day rates, the centerpiece converter turns
an amount in one currency into any of 57 others, and a tabbed panel beneath it
adds a rate-history chart, a pair comparison list, favorites, and a conversion
log.

The application is intentionally **frontend-first**: there is no database and
no application backend beyond Next.js server functions. Every rate comes from
the public Frankfurter API (ECB reference data), and persistent user data
(favorites, log entries, the open tab) lives in the browser via
localStorage. It is a single static route (`/`) prerendered by Next.js and
deployed on Vercel.

## The Problem

**From the user's perspective:** checking "how much is my money worth today?"
usually means bouncing between a search engine, a finance tab, and a mental
multiplication step. Currency apps aimed at travelers often pack in widgets,
ads, and intraday noise. The user wants one screen: live rates at a glance,
an instant conversion in both directions, and a quick way to pin the pairs
they actually care about — all with a UI that is legible at night.

**The technical challenge:** the data source (ECB daily reference rates)
updates at most once per business day, yet the UI is expected to feel "live."
That pushes the architecture in two directions at once — freshness signals
(ticker, change badges) and cache discipline (don't hammer an upstream API
for data that barely moves). Add to that: a two-way converter that must not
feedback-loop on itself, a 60+ currency catalog of flags and names that must
stay in sync with the API, and a fully keyboard-operable, screen-reader-safe
interface — and the "simple converter" becomes a seat of interesting
engineering decisions.

## The Solution

FX Checker splits the app into three cooperating layers:

1. **A thin data boundary.** All upstream requests are funneled through
   server functions in `services/api.ts` (marked `"use server"`). Clients
   never call Frankfurter directly; they import typed functions that Next.js
   turns into server actions, revalidating responses in a server-side cache
   for one hour.
2. **A single client-side source of truth.** A Zustand store holds the
   selected pair, both amounts, which field is being edited, the picker's
   open state, favorites, log entries, and the active tab — with partial
   persistence to localStorage. React Query supplies every rate value, and
   the store orchestrates conversion math.
3. **Feature-scoped UI.** Components are grouped by feature
   (`features/CurrencyConverter/`, `features/RateHistory/`, `features/Compare/`,
   `features/Favorites/`, `features/Log/`), sharing only curated pieces
   (`components/`, `utils/`, `Types.ts`) from the root.

The result is an app where no component talks to the network directly, no
state handshake is duplicated, and the "live" feel comes from marquees,
badges, and charts layered over genuinely cached data.

## Key Features

### Live Rates Marquee

**All visitors** see a continuously scrolling marquee of currency pairs —
each showing today's ECB rate plus a green/red change badge versus the
previous business day.

- Pauses on hover so a specific pair can be read.
- Respects `prefers-reduced-motion`: the marquee collapses to a
  horizontally scrollable strip instead.
- Loading and error states render a shimmer loader or a retry button
  respectively.

**Why it matters:** it turns "rates are available" into a visible, animated
signal within the first second of page load, and it does so without hurting
users who have reduced-motion enabled.

### Two-Way Converter with Swap

**Any user** can type into either field and the other updates automatically
with the current pair rate.

- Focus switches which field "drives" the conversion (send multiply / receive
  divide) without a feedback loop.
- The swap button flips the pair *and* the amounts in one click.
- A searchable picker groups 57 currencies into "Popular" and "Other", with
  flag, code, and full name per row.
- A screen-reader announcement (`aria-live="polite"`) states each new
  conversion result.

**Why it matters:** the two-way behavior matches how people actually think
("I have 500 dollars — how many yen is that?" or "I need 10,000 yen — how
much is that in dollars?") and the swap eliminates the most common friction
of currency tools.

### Rate History Chart

**Anyone** can open the Chart tab to see the pair's trend across six ranges
(1D, 1W, 1M, 3M, 1Y, 5Y).

- Recharts area chart with a lime gradient fill matching the app theme.
- Open / Last / Change / % stats computed from the series endpoints.

**Why it matters:** a single number gives no context; a six-year trend line
tells the user whether the pair is "expensive" relative to its own history.

### Compare, Favorites & Log

**Users who track pairs** get three tabbed tools:

- **Compare** — every quote currency against the current base, converted at
  the user's entered amount, with a quick pin (star) on each row.
- **Favorites** — pinned pairs with today's rate and a day-over-day change
  badge; tapping a favorite loads it into the converter.
- **Log** — a manual "Log current conversion" button records the pair and
  amounts with relative timestamps; entries are individually deletable and
  clearable.

All three persist across reloads because the underlying arrays are stored in
localStorage.

**Why it matters:** conversion is a repeated, personal task; remembering which
pairs matter and what was converted is what turns a calculator into a tool.

## User Experience

1. **Land.** The page renders instantly (statically prerendered); the header
   states coverage ("57 CURRENCIES · EOD · ECB DATA") and the ticker starts
   animating as rates arrive.
2. **Convert.** The pair defaults to EUR → USD with `100` prefilled. The
   user can type over the send amount, focus the receive field to invert the
   math, swap the pair, or open the picker and search for a currency by code
   or name.
3. **Dig deeper.** The Chart tab defaults to 1M; the user switches ranges and
   reads open/last/change stats. The Compare tab lists all quotes converted
   at their amount. Stars pin pairs to Favorites, and the Log tab records
   conversions for later reference.
4. **Come back.** Favorites, the active tab, and the conversion log survive a
   reload; the pair rate, when stale, refreshes silently in the background.

<Mermaid>{`
flowchart LR
    A[User opens app] --> B[Static shell renders instantly]
    B --> C[Ticker streams live ECB rates]
    C --> D[Convert with two-way fields]
    D --> E[Swap or search a currency]
    E --> F[Check Chart / Compare]
    F --> G[Pin favorites / log a conversion]
    G --> H[Return later - state persists]
`}</Mermaid>

## How It Works

Every rate in the app flows through the same funnel. A client component
declares a TanStack Query hook whose `queryFn` is an imported server function
from `services/api.ts`. Because that file carries the `"use server"`
directive, Next.js compiles each export into a server action and the client
fetch is dispatched as a POST to the server, which performs the actual
upstream HTTP GET to Frankfurter. Responses are cached server-side with
`next: { revalidate: 3600 }`, so a page with a ticker, a pair rate, a chart,
and a compare list reuses cached data instead of multiplying upstream calls.

<Mermaid>{`
sequenceDiagram
    participant U as User (browser)
    participant C as Client (React Query + Zustand)
    participant S as Next.js server (services/api.ts)
    participant F as Frankfurter API (ECB/EOD)

    U->>C: types amount into send field
    C->>S: server action getPairRate("EUR","USD")
    S->>F: GET /v2/rate/EUR/USD (cached 1h)
    F-->>S: { base, quote, rate }
    S-->>C: current pair rate
    C->>C: derive receive amount (roundCurrency)
    C-->>U: receive field + aria-live update
`}</Mermaid>

### Two-Way Conversion

The converter's trick is avoiding feedback. Both fields share the same pair
rate; if every change recalculated both fields, typing would ping-pong
forever. The store tracks `editingField: "send" | "receive"` and a
`derivePending` flag:

- `setSendAmount` / `setReceiveAmount` update only that field.
- `setBase` / `setQuote` / the swap set `derivePending = true`.
- A `useEffect` in `ConverterSection` waits for the pair rate to arrive (or
  change), then converts **once** in the direction of `editingField` and
  clears `derivePending`.

Focusing the receive field flips `editingField` to `"receive"`, and since the
focus handler converts the *current* amount before typing, the next keystroke
divides instead of multiplies — without ever creating a loop.

### The Ticker's Single Round-Trip

The ticker needs two values per pair (today and the previous business day) to
draw change badges. Instead of issuing two requests, `getTickerRates` makes
one range request (`/rates?from=<7 days ago>&to=<today>`), collects the
distinct business dates present in the response, and splits the flat result
into "latest date" and "second-latest date" arrays before joining them with
`matchRates`. The 7-day window guarantees a previous business day exists even
after weekends and holidays.

## Architecture

<Mermaid>{`
flowchart TB
    subgraph UI["Client UI"]
        A["app/page.tsx (static shell)"]
        B["components/ (Header, LiveMarkets, Tabs...)"]
        C["features/ (Converter, RateHistory, Compare, Favorites, Log)"]
    end

    subgraph State["Client state"]
        D["Zustand store (+ persist to localStorage)"]
        E["TanStack Query cache (staleTime 5m, gcTime 30m)"]
    end

    subgraph Data["Data boundary"]
        F["services/api.ts (server actions)"]
        G["Fetch cache (revalidate 3600s)"]
    end

    subgraph Upstream["Upstream"]
        H["Frankfurter API v2 (ECB/EOD)"]
    end

    A --> B
    B --> C
    C --> D
    C --> E
    E --> F
    F --> G
    G --> H

    D -.persisted subset (favorites, log, tab).-> E
`}</Mermaid>

- **Page shell (`app/`)** — Next.js App Router entry: `layout.tsx` (fonts,
  metadata, viewport) and `page.tsx` which composes Header, LiveMarkets, the
  ConverterSection, and TabsSection inside a `Providers` wrapper.
- **Shared components (`components/`)** — feature-agnostic UI: `Header`,
  `LiveMarkets`, `LiveRate` (marquee), `SingleLiveRate`, `Tabs`,
  `TabsSection`, `Loader`.
- **Feature components (`features/<Feature>/components/`)** — each feature
  owns its UI: the converter (two `CurrencyField`s, `SwapCurrencies`, the
  `ChangeCurrencyButton` + `CurrencyOption` listbox), the chart
  (`RateHistoryChart`), `CompareList`, `FavoritesList`, `ConversionLog`.
- **State (`features/CurrencyConverter/store/`)** — the sole Zustand store,
  persisted with `zustand/middleware`'s `persist` and
  `partialize`d to favorites/log/activeTab.
- **Data boundary (`services/`)** — typed server functions. `getCurrencies`
  exists in the API layer but the catalog actually consumed by the UI is
  `assets/data/flags.ts`; the rest of the functions back the app's queries.
- **Utilities (`utils/`)** — pure functions (`roundCurrency`, `calcChangeRate`,
  `matchRates`, `getRange`, formatters). **Hooks (`hooks/`)** — `useClickOutside`
  and `useReducedMotion`.
- **Shared types (`Types.ts`)** — `RateTypes`, `CurrencyRate`, `Currency`,
  `CurrencyInfo`, `LatestRates`.

## Technical Implementation

### API Surface

All functions in `services/api.ts` (server actions, `"use server"`).

| Function | Endpoint | Responsibility |
| --- | --- | --- |
| `getPairRate(base, quote)` | `GET /v2/rate/{base}/{quote}` | Pair rate for the converter |
| `getLatest(base)` | `GET /v2/rates?base={base}` | All quotes for the Compare tab |
| `getHistory(base, quote, from, to)` | `GET /v2/rates?from&to&base&quotes` | Chart series and favorites change |
| `getTickerRates()` | `GET /v2/rates?from&to` (one call) | Today + previous business day for the marquee |
| `getCurrencies()` | `GET /v2/currencies` | Defined but not currently consumed (flag catalog is `assets/data/flags.ts`) |

Requests throw on `!res.ok`, log the error, and rethrow so the calling React
Query hook can surface `isError` in the UI (each data component renders a short
message and a Retry button that calls `refetch()`).

### Data Flow

React Query is the request engine for every fetch:

- `["rates", "pair", base, quote]` → converter
- `["rates", "latest", base]` → compare
- `["rates", "history", base, quote, range]` → chart
- `["rates", "ticker"]` → marquee
- `["rates", "favorites-change", joinedKey]` → favorites (keyed on the
  concatenated favorite list so pinning/unpinning re-derives)

Query defaults: `staleTime` 5 minutes, `gcTime` 30 minutes, `retry: 2`,
`refetchOnWindowFocus: false`. Upstream fetches revalidate every hour server-side.

### State Management

Zustand owns all interaction state. Amounts and the editing-field cursor are
transient; `favorites`, `conversionLog`, and `activeTab` are
`partialize`d into localStorage under the key `fx-currency-converter` by
`zustand/middleware`'s `persist`, surviving reloads without any backend.

### The Data Model (No Database)

This project has **no database and no backend storage**. The only "model" is
client-side: the persisted store slice (`favorites: FavoritePair[]`,
`conversionLog: ConversionLogEntry[]`, `activeTab: TabId`) rehydrated from
localStorage, plus the static currency catalog in `assets/data/flags.ts`. An
entity-relationship diagram does not apply; the component/data-flow diagram in
[Architecture](#architecture) describes the system's seams instead.

**Persisted schema (localStorage, key `fx-currency-converter`):**

```ts
type FavoritePair = { base: string; quote: string };
type ConversionLogEntry = {
  id: string;            // crypto.randomUUID()
  base: string;
  quote: string;
  sendAmount: number;
  receiveAmount: number;
  timestamp: number;
  relativeTime: string;  // "5m ago"
};
type TabId = "chart" | "compare" | "favorites" | "log";
```

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. Theme tokens are declared inline
in `app/globals.css` under `@theme inline`:

- **Spacing** — a strict 8px grid (`p-100` = 8px, `p-200` = 16px, ... up to
  `p-1800`), used in place of arbitrary values throughout.
- **Colors** — raw CSS vars (`--neutral-50`…`--neutral-900`, `--lime-500`,
  `--red-500`, `--green-500`) surface as semantic utilities
  (`bg-currency-field-bg`, `border-currency-field-stroke`,
  `bg-liveMarket-yellow-bg`).
- **Breakpoints** — `mobile` (31.5rem), `tablet` (48rem), `desktop` (90rem),
  used with the `max-` prefix for mobile-first layouts.
- **Font** — JetBrains Mono via `next/font/local`, globally applied.

### Accessibility

- Roving-tabindex tablists (converter tabs and chart ranges) with arrow /
  Home / End key navigation.
- The currency picker is a real `combobox`/`listbox`/`option`: opens on
  click, focuses the search field, arrow-keys traverse options, Escape closes
  and returns focus.
- `aria-live="polite"` announcements for conversions, favorite toggles, and
  log actions.
- `:focus-visible` rings in the brand lime across all interactive elements.
- `prefers-reduced-motion`: the loader's CSS animation is disabled and the
  marquee is replaced by a scrollable strip via the `useReducedMotion` hook.

### Validation and Error Handling

- Amount inputs are `type="number"` with `min={1}`; store actions guard
  derived math with `Number(...) || 0` and the log button is `disabled`
  until both amounts are finite and positive.
- Each query renders `isPending` / `isError` states, with a Retry button
  wired to `refetch()` (`LiveRate`, `RateLine`, `RateHistoryChart`,
  `CompareList`, `FavoritesList`).
- Response payloads are cast to typed interfaces; non-OK responses throw
  before any UI consumes them.

### Performance

- **Server-side fetch cache** — every upstream call carries
  `next: { revalidate: 3600 }`, so the marquee, pair rate, chart, and compare
  fetches hit one cached response per URL.
- **Client query cache** — 5-minute `staleTime` prevents refetch-on-mount
  churn; window-focus refetching is disabled.
- **Ticker deduplication** — today + yesterday fetched in a single
  round-trip (see How It Works).
- **Static hoisting** — the shell (header, layout, fonts) is prerendered;
  only the rate-dependent components wait on queries.
- **Formatting** — formatters are `Intl.NumberFormat` instances created once
  at module scope (`formatRate`, `formatAmount`).

## Architecture Decision Records

### ADR-001: Server Actions as the Data Boundary

**Status:** Accepted
**Context:** The app is Next.js-only and calls a third-party FX API from
client components via React Query.
**Decision:** Mark `services/api.ts` `"use server"` and import its typed
functions directly into `queryFn`s; no Route Handlers or API routes.
**Why:** Server actions give typed, colocated I/O with zero route boilerplate,
and the fetch cache (`next.revalidate`) applies at the data boundary.
**Alternatives Considered:** Next.js Route Handlers (`app/api/...`), a
standalone backend service, or direct client-side fetches to Frankfurter.
**Trade-offs:** Server actions only run when a client triggers them — fine for
this single route, but unsuitable if the same data were needed by other
services. Direct client fetch was rejected because it would expose the data
layer, skip caching, and complicate error handling.

### ADR-002: Zustand + localStorage as the Persistence Layer (No Database)

**Status:** Accepted
**Context:** Favorites, conversion log, and tab state should survive reloads,
but the product has no accounts and no backend.
**Decision:** Centralize all client state in one Zustand store and persist a
`partialize`d slice via `zustand/middleware`'s `persist` (localStorage).
**Why:** A one-store model eliminates cross-component prop drilling and the
persist middleware is a two-line upgrade; user data stays private on the
device and the server's attack surface stays zero.
**Alternatives Considered:** Context + `useReducer`, a full database
(Postgres/Supabase), IndexedDB.
**Trade-offs:** No sync across devices, and localStorage is opaque to search;
acceptable for a zero-login tool. Context was rejected for the frequent,
fine-grained store reads the converter requires.

### ADR-003: Tailwind v4 Inline Theme Tokens on an 8px Grid

**Status:** Accepted
**Context:** The design system centers on a dark palette, a lime accent, and
tight, consistent spacing.
**Decision:** Declare spacing tokens as 8px multiples and map raw CSS vars to
semantic utilities inside `@theme inline` in `globals.css`.
**Why:** `p-200`/`gap-300` communicate absolute values at a glance, and the
semantic color names (`bg-currency-field-bg`) insulate components from
palette changes.
**Alternatives Considered:** Default Tailwind spacing scale, arbitrary values
everywhere, a separate `.css` class file per component.
**Trade-offs:** New spacing steps require touching the token table; custom
values still appear inline (`rounded-[8px]`, `text-[40px]`) when a token
doesn't exist.

### ADR-004: Single-Round-Trip Ticker with Business-Day Splitting

**Status:** Accepted
**Context:** The marquee needs today's and the previous business day's rates
per pair; two `?date=` calls returned inconsistent windows after weekends.
**Decision:** Fetch a 7-day range once and split the flat response by distinct
date into "latest" and "second-latest" business days before joining pairs.
**Why:** One upstream call instead of two, identical cache key stability, and
correct day-over-day deltas even across weekends and holidays.
**Alternatives Considered:** Two `?date=` calls (previous behavior), per-pair
history calls.
**Trade-offs:** The range payload is larger than a single-date response; the
increase is absorbed by the 1-hour cache and never affects the client.

## Challenges and Solutions

### Challenge: The Two-Way Converter Feedback Loop

**Problem:** Both fields derive from the same pair rate. Naively recalculating
on every change makes the fields overwrite each other in an infinite loop,
and inverting the math when the user switches fields was getting out of sync.
**Solution:** The store tracks `editingField` and `derivePending`. Only the
driven field is recalculated, and only once per rate/pair change, inside a
guarded `useEffect`. Focusing the other field converts the current value
exactly once before `editingField` flips.
**Result:** Typing in either field is always responsive and loop-free; swap
preserves both amounts across the reversed pair.

### Challenge: The Ticketing "Yesterday" Had No Stable Meaning

**Problem:** Comparing `?date=today` against `?date=calendar-yesterday` mixed
per-currency publication dates, producing 0.00% badges for many pairs and
inconsistent windows on weekends.
**Solution:** One range request per ticker build, split by the distinct
business dates actually present in the response, then joined per pair. The
7-day window guarantees a real previous business day exists.
**Result:** Single round-trip, stable windows, and meaningful change badges.

### Challenge: "57 vs 60" Currency Count Drift

**Problem:** Design copy claimed 60 currencies, but only 57 flag images map
to currencies the Frankfurter API actually serves; the other three flags
(`cy`, `hm`, `hr`) back legacy/non-tradeable codes.
**Solution:** Render the header count from `flags.length` so the copy always
mirrors the real catalog, and align README/metadata copy with the true 57.
**Result:** No placeholder copy anywhere; the number a user sees is always
the number a user can pick.

### Challenge: Keyboard-Only Use of a "Simple" Converter

**Problem:** The dropdown picker, tabs, chart ranges, and toggles needed WAI-ARIA
patterns, not just focusable buttons.
**Solution:** Implemented a combobox/listbox pattern with roving focus and
search autofocus, roving-tabindex tablists (`ArrowLeft/Right`, Home, End),
`aria-live` regions for dynamic results, and reduced-motion fallbacks.
**Result:** The full journey (swap, pick, convert, pin, log) is operable with
keyboard alone and announced by screen readers.

## Technology Stack

| Technology | Purpose |
| --- | --- |
| Next.js 16.2.9 (App Router, Turbopack) | Framework, server actions, static prerender |
| React 19.2.4 | UI runtime |
| TypeScript 5 (strict) | Language & types (`Types.ts`, `tsconfig.json`) |
| Tailwind CSS 4 (`@tailwindcss/postcss`) | Styling with inline theme tokens |
| Zustand 5.0.14 (`zustand/middleware`) | Client state + localStorage persistence |
| TanStack Query 5.101.0 | Server-state fetching, caching, retries |
| Recharts 3.10.1 | Rate-history area chart |
| `react-fast-marquee` 1.6.5 | Live rates ticker |
| ESLint 9 + `eslint-config-next` | Linting (flat config) |
| Frankfurter API v2 | ECB/EOD exchange-rate data |
| Vercel | Production hosting |

## Project Structure

```
app/
  layout.tsx            # Root layout: fonts, metadata/OG, viewport, lang
  page.tsx              # Composes Header, LiveMarkets, Converter, Tabs
  Providers.tsx         # QueryClientProvider + query defaults
  globals.css           # Tailwind v4 + @theme inline tokens + focus styles
  icon.svg              # Favicon (square lime FX mark)
components/             # Shared, feature-agnostic UI
  Header.tsx            # Logo + "57 CURRENCIES · EOD · ECB DATA"
  LiveMarkets.tsx       # "LIVE MARKETS" badge + ticker strip
  LiveRate.tsx          # Marquee wrapper (reduced-motion aware)
  SingleLiveRate.tsx    # One ticker item (rate + change badge)
  Tabs.tsx / TabsSection.tsx  # Roving-tabindex tab switcher + panel
  Loader.tsx            # Shimmer loader (animate-loader token)
features/
  CurrencyConverter/
    components/         # CurrencyField, SwapCurrencies, ChangeCurrencyButton, CurrencyOption
    store/useCurrencyStore.ts  # Single Zustand store (persisted)
  RateHistory/components/RateHistoryChart.tsx  # Recharts area + range tabs
  Compare/components/CompareList.tsx           # All quotes at your amount
  Favorites/components/FavoritesList.tsx       # Pinned pairs + change %
  Log/components/ConversionLog.tsx             # Manual log + clear/delete
services/
  api.ts                # "use server" typed Frankfurter client (cached 1h)
hooks/
  useClickOutside.ts    # Close dropdown on outside mousedown
  useReducedMotion.ts   # prefers-reduced-motion for marquee
utils/                  # Pure logic: roundCurrency, matchRates, calcChangeRate,
                        # getRange, getDate, getRelativeTime, formatRate, formatAmount
assets/data/flags.ts    # 57-currency static catalog (code, flag, name, group)
Types.ts                # Shared types (RateTypes, CurrencyRate, Currency, ...)
public/
  images/flags/         # 60 flag WebP images (57 in use)
  preview.jpg           # 1200x630 OG/social preview
tasks/                  # Task specs 00-06 (all complete)
```

## Deployment and Configuration

The project has **no required environment variables** — the Frankfurter base
URL is a module constant in `services/api.ts`. Deployment is standard Next.js:

```bash
npm install
npm run dev        # local development
npm run lint       # ESLint (flat config)
npm run build      # type-checked production build
npm run start      # serve the production build
```

Production is hosted on **Vercel** (`vercel deploy --prod`), which runs the
build pipeline on its own infra. The site is statically prerendered at
build time (routes: `/`, `/_not-found`, `/icon.svg`); rate data is fetched
at runtime on the client through server actions and cached server-side. The
Vercel project is linked to this repository, so the live URL
(`https://fx-currency-converter-nine.vercel.app`) points at the deployed
`master` build.

**No test framework is present** (no Jest/Vitest/Playwright). Verification
relies on `npm run build` (catches type errors) and `npm run lint`, plus the
manual smoke test documented in the task specs.

## What This Project Demonstrates

### Product and Business Perspective

- Taking a ubiquitous daily task (currency conversion) and reducing it to a
  single dark, glanceable screen — no ads, no widgets, no logins.
- "Live" as a design signal: a marquee ticker and day-over-day badges
  communicate freshness even though the underlying data is daily.
- Retention mechanics without accounts: localStorage persists favorites, the
  log, and even the open tab, so returning users resume where they left off.
- Honest copy: the header's currency count is rendered from real data, never
  a hard-coded promise.

### Engineering Perspective

- **Server actions as a typed I/O boundary** — React Query consuming
  `"use server"` functions yields a single, cacheable data path with zero
  API-route boilerplate.
- **Two-way derivation without feedback loops** — an `editingField` +
  `derivePending` effect protocol, a reusable pattern well beyond currency
  math.
- **Cache discipline across two layers** — server-side `revalidate` plus
  client `staleTime`/`gcTime` keeps an "always-fresh-feeling" UI friendly to
  a third-party upstream.
- **Feature-first organization** — feature-scoped folders, shared types in
  `Types.ts`, pure logic in `utils/`, and a single store; a layout that
  scales without sprawling.
- **Production-grade polish** — WAI-ARIA combobox/tab patterns, aria-live
  announcements, reduced-motion support, per-query error recovery, and
  `Intl`-based formatting, all passing `lint` + typed `build`.

## Scope Notes

- **No authentication, accounts, or backend storage.** Persistence is
  browser-local only (localStorage).
- **No database.** See the "Data Model" section above; state is a persisted
  client slice plus a static catalog.
- **No test framework.** Type-checking (`npm run build`) and lint are the
  automated gates.
- **EOD data only.** ECB reference rates are daily; there is no intraday or
  delayed-live trading data, and the 1D chart range deliberately fetches the
  most recent daily close rather than intraday ticks.
- **57 convertible currencies.** 60 flag images ship in `public/images/flags/`,
  but three (`cy`, `hm`, `hr`) correspond to legacy/non-served ISO codes and
  are intentionally excluded from the pickable catalog so pair conversion
  never yields a dead end.
- **`getCurrencies()` is defined but unused.** The picker reads
  `assets/data/flags.ts` (curated names and popularity groups) rather than
  the API's 165-code list; the function remains for future use.
- **Marquee coverage.** The ticker shows only pairs present in both the
  latest and previous business day's response windows, so its visible set
  varies slightly day to day.
- **Metadata base URL** is not hard-coded; the deployed site resolves
  Open Graph/Twitter image URLs against its own origin.