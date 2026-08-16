# 01 - Converter & Picker

Status: done
Priority: high

## Goal

Make the converter actually convert: real-time two-way conversion, a working
swap button, a visible live rate line with favorite toggle, and a searchable,
grouped currency picker with a selected check mark.

## Steps

1. `utils/convertCurrency.ts`: `convert(amount, base, quote, rate)` base->quote
   and `convertReverse` quote->base by reciprocal.
2. `features/CurrencyConverter/components/CurrencyField.tsx`: make the input
   controlled (bound to store `amount`); "send" is editable, "receive" shows
   the converted result; both fields editable and convert in both directions;
   format with `Intl.NumberFormat`.
3. `features/CurrencyConverter/components/SwapCurrencies.tsx`: wire `onClick`
   to swap base/quote and the send/receive amounts; use
   `icon-exchange-vertical.svg`.
4. Show a live rate line under the fields (e.g. "1 USD = 0.8530 EUR") fed by
   `getPairRate(base, quote)`, with a favorite (star) toggle for the active
   pair.
5. Rebuild the picker (`ChangeCurrencyButton.tsx` + `CurrencyOption.tsx`):
   - Search box (`icon-search.svg`) filtering by code or name.
   - Sections "Popular" and "Other currencies" from `group`.
   - Check mark (`icon-check.svg`) on the currently selected row.
   - Enable `useClickOutside(ref, closeDropdown)` (currently commented out).
   - `aria-haspopup="listbox"` / `aria-expanded` on the trigger.

## Verify

- `npm run lint`
- `npm run build`
- Manual: type 100 in "send", see converted value in "receive"; swap flips
  currencies and values; picker searches by code and name; click outside
  closes the picker.

## Definition of done

- Conversion updates in real time in both directions.
- Swap button swaps pair and amounts.
- Rate line and favorite star work for the active pair.
- Picker supports search, grouping, and selected check mark.
- Lint and build pass.
