# 04 - Accessibility & UX

Status: pending
Priority: medium

## Goal

Make the app keyboard-navigable and screen-reader friendly: visible focus
styles, semantic HTML, ARIA live announcements, and reduced-motion support.

## Steps

1. Visible focus rings on all interactive elements (pickers, swap button, tabs,
   range controls, pin/favorite toggles, log delete/clear). Dark interfaces
   hide weak focus rings — use a high-contrast outline (e.g.
   `outline-[var(--lime-500)]`).
2. Full keyboard navigation:
   - Currency picker opens with Enter/Space and arrow-keys traverse options.
   - Swap button, tabs, chart range controls, and pin toggles are focusable and
     operable by keyboard.
3. Semantic HTML: use real `<ul>`/`<li>` for currency lists, favorites, and log
   entries; role `tablist`/`tab`/`tabpanel` for the tab switcher; `listbox`/
   `option` for the picker popover.
4. ARIA live regions (`aria-live="polite"`) announcing dynamic changes: the
   converted amount updating, a pair pinned/unpinned, a conversion logged.
5. Respect `prefers-reduced-motion`: disable the loader animation and marquee
   scroll under reduced-motion media query.
6. Confirm all interactive elements have accessible labels/names.

## Verify

- `npm run lint`
- `npm run build`
- Manual: navigate the entire app with only the keyboard; run a screen reader
  over the converter, tabs, and log; toggle reduced motion in devtools and
  confirm animations stop.

## Definition of done

- Every interactive element has a visible focus style.
- Full app is operable by keyboard alone.
- Tabs and lists use correct semantics; picker uses listbox/option roles.
- Dynamic changes are announced to screen readers.
- Lint and build pass.
