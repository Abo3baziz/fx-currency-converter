# 03 - Compare, Favorites & Log

Status: pending
Priority: high

## Goal

Add the remaining app sections: multi-currency Compare with pin/unpin,
persisted Favorites that load back into the converter, an auto-logged
Conversion Log with clear/delete, and a persisted tab switcher.

## Steps

1. `features/Compare/`: `CompareList.tsx` — converts the send amount into a
   range of currencies at once using `getLatest(base)`; each row shows the
   reference rate and a pin/unpin toggle (`icon-star*.svg`); empty-state prompt
   ("enter an amount") when the amount is empty.
2. `features/Favorites/`: `FavoritesList.tsx` — pinned pairs from the store
   with live rate + 24h change (`getTickerRates`); click a row to load it into
   the converter; unpin removes it; empty-state prompt to pin a pair.
3. `features/Log/`: `ConversionLog.tsx` — conversions logged automatically on
   convert (pair, send/receive amounts, timestamp); relative time via new
   `utils/getRelativeTime.ts`; clear-all button and per-entry delete
   (`icon-delete*.svg`); empty-state prompt explaining conversions are recorded
   automatically.
4. `components/Tabs.tsx`: shared tab switcher for Chart / Compare / Favorites /
   Log; persist `activeTab` in the store so the last tab reopens.
5. Favorites + log already persist via the store `persist` middleware from task
   00; verify both survive reload.

## Verify

- `npm run lint`
- `npm run build`
- Manual: pin a pair, reload — still pinned; convert a few amounts, see the log
  entries with relative times; delete one, clear all; click a favorite row and
  it loads into the converter; empty states show prompts.

## Definition of done

- Compare shows multi-currency conversion with pin/unpin and empty state.
- Favorites persist, load into the converter, and show live rates.
- Log records conversions automatically, supports delete + clear, and shows
  relative time.
- Tabs persist across reloads.
- Lint and build pass.
