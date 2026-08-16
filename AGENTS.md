# AGENTS.md

Guidance for agentic coding tools working in this repository.

## Project Overview

A dark-themed FX (foreign exchange) currency converter web app built with the
Next.js App Router. It shows live currency rates (ECB/EOD data from the
Frankfurter API) in a scrolling marquee and lets users convert between
currencies. There is no backend beyond Next.js server code; all data comes from
`https://api.frankfurter.dev/v2/rates`.

### Tech Stack

- **Framework**: Next.js 16 (App Router), React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/postcss`) with custom theme
  tokens in `@theme inline`
- **State**: Zustand (`features/CurrencyConverter/store/useCurrencyStore.ts`)
- **Data fetching**: TanStack Query (`@tanstack/react-query`), server-side
  fetches in `services/api.ts` (marked `"use server"`)
- **Marquee**: `react-fast-marquee`
- **Linting**: ESLint 9 flat config (`eslint.config.mjs`), using
  `eslint-config-next` (core-web-vitals + typescript)

## Commands

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build (runs type-checking) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint over the project (`eslint` with flat config) |
| `npx tsc --noEmit` | Type-check without emitting (no dedicated npm script) |

### Tests

There is **no test framework, test runner, or test files** in this repository
(no Jest, Vitest, Playwright, etc.). Do not assume one exists or invent a test
command. If you need to verify behavior, use `npm run build` (type-checks) and
`npm run lint`.

## Repository Structure

```
app/                         # Next.js App Router entry (page.tsx, layout.tsx, Providers.tsx, globals.css)
components/                  # Shared, feature-agnostic components (Header, Loader, LiveRate, ...)
features/CurrencyConverter/  # Feature-scoped code
  components/                #   Feature UI components
  store/                     #   Zustand store (useCurrencyStore.ts)
services/                    # Server-side data access ("use server", api.ts)
hooks/                       # Shared React hooks (useClickOutside.ts)
utils/                       # Pure helper functions (calcChangeRate, getDate, matchRates)
assets/data/                 # Static data (flags.ts)
Types.ts                     # Shared TypeScript types (root level, no folder)
public/                      # Static assets (images/, fonts/)
```

Components that belong to a feature live under `features/<Feature>/components/`,
not in the top-level `components/`. Shared types live in `Types.ts` at the root,
not in each file. Pure logic lives in `utils/`; server-side fetch logic lives in
`services/`.

## Code Style & Conventions

### General

- TypeScript with `strict: true`. All code must be typed; avoid `any`.
- Double quotes, semicolons, and trailing commas for multi-line statements
  (matches the default Prettier config used by `create-next-app`).
- Path alias `@/*` maps to project root (see `tsconfig.json`). Prefer `@/`
  imports over long relative paths; use relative imports for same-folder or
  sibling feature files (e.g. `import CurrencyOption from "./CurrencyOption"`).

### Imports

Conventional order: third-party libraries first, then `@/` aliases, then
relative imports. Sort within groups alphabetically. Example from
`ChangeCurrencyButton.tsx`:

```ts
"use client";

import Image from "next/image";
import downArrow from "@/public/images/icon-chevron-down.svg";
import { flags } from "@/assets/data/flags";
import { useCurrencyStore } from "../store/useCurrencyStore";
import CurrencyOption from "./CurrencyOption";
```

### Components & Directives

- Components use **PascalCase** names and are **default exported** as function
  declarations: `export default function ComponentName() { ... }`.
- Add `"use client"` as the **first line** of any component using hooks, event
  handlers, or browser-only APIs (state, effects, onClick, etc.). Components
  without it are treated as Server Components — keep them server-rendered when
  possible.
- Server-only logic files (e.g. `services/api.ts`) use `"use server"` as the
  first line.
- Destructure props inline in the function signature and type them inline, e.g.
  `export default function CurrencyField({ title }: { title: string })`.
- Files use PascalCase (e.g. `LiveRate.tsx`), kebab-case in `assets/data`
  (`flags.ts`).

### Types

- Shared types are declared in `Types.ts` and exported with the `type` keyword
  (`export type ...`). Import them via `import { RateTypes } from "@/Types"`.
- Use `type` for type aliases/unions; use interfaces only where genuinely
  needed (the codebase favors `type`).
- Local/component-specific types are declared at the top of the file they are
  used in (see `useCurrencyStore.ts`).
- Prefer literal union types over broad `string` where the set is fixed, e.g.
  `fieldType: "base" | "quote"`, `activeDropdown: "base" | "quote" | null`.

### Naming

- **Variables/functions**: `camelCase` (`handleSelect`, `isOpen`,
  `todayRates`).
- **Components/types**: `PascalCase` (`LiveMarkets`, `RateTypes`).
- **Constants**: `UPPER_SNAKE_CASE` for magic values (`baseUrl` in `api.ts` is
  an existing lowercase exception; prefer `UPPER_SNAKE_CASE` for new module
  constants).
- **Files**: PascalCase for components, camelCase for utils/hooks/services
  (`matchRates.ts`, `useClickOutside.ts`).
- **Event handlers**: prefix with `handle` (`handleSelect`, `handleClick`).
- React Query query keys are arrays of strings, e.g. `["rates", "today"]`.

### Error Handling

- `services/api.ts` uses `try/catch` with a `console.log(error)` and a
  `// TODO handle errors in error state` comment — error surfacing to the UI is
  **not yet implemented**. Follow this TODO pattern: leave a `// TODO` note
  rather than silently swallowing, and surface errors via the UI when
  implementing.
- `LiveRate.tsx` handles only the pending state (`isPending`) and has a
  `// TODO handle failed fetch process` comment for the error state. Keep this
  pattern when extending.

### Styling (Tailwind CSS v4)

- Use utility classes in JSX; do not create separate `.css` class files per
  component.
- Custom spacing/colors/breakpoints are defined as theme tokens in
  `app/globals.css` under `@theme inline`:
  - Spacing: `p-100`/`p-200`/`gap-125`/etc. (multiples of 8px, e.g. `p-200`
    = 16px). Use these tokens instead of arbitrary Tailwind spacing values.
  - Colors: semantic tokens like `bg-currency-field-bg`,
    `border-currency-field-stroke`, `bg-liveMarket-yellow-bg` (mapped to raw
    CSS vars `--neutral-*`, `--red-500`, `--green-500`, `--lime-500`, etc.).
    Reference raw vars inline when not tokenized:
    `text-[var(--green-500)]`.
  - Breakpoints: `mobile` (31.5rem), `tablet` (48rem), `desktop` (90rem),
    used with the `max-` prefix (`max-mobile:flex-col`,
    `max-tablet:text-[32px]`).
  - Arbitrary values are acceptable where tokens don't exist
    (`text-[14px]`, `rounded-[8px]`).
- The app is dark-themed; default text is white and the body background is
  black.

## Git Workflow

### Branching

- The only branch is `master`; work directly on it unless the task calls for a
  feature branch. Create feature branches with a short, descriptive kebab-case
  name (e.g. `feat/add-currency-field`).
- Do not force-push, rebase, or rewrite shared history on `master`. Always
  fetch before pulling to keep history linear.

### Committing

- Use Conventional Commits: `<type>(<scope>): <description>`, where the
  description is lowercase and imperative (e.g. `feat(live-rates): add live
  currency rates display with marquee animation`). The repo mixes plain
  `add ...` messages and scoped conventional commits; prefer the scoped
  conventional format for new work.
- **Types**: `feat` (new feature), `fix` (bug fix), `style` (formatting/CSS),
  `refactor`, `docs`, `chore` (tooling, dependencies), `perf`.
- **Scope** (optional): the feature or area being touched, e.g.
  `feat(converter):`, `style(css):`.
- Commit related changes together; make focused commits that each describe a
  single logical change. Do not mix unrelated edits in one commit.
- Keep the subject under ~72 characters. Body lines wrap at 72 characters.
  Use the body to explain the *why* when the subject isn't enough.
- Run `npm run lint` and `npm run build` before committing to make sure the
  change is clean.
- Do not commit generated artifacts (`node_modules/`, `.next/`, `*.tsbuildinfo`)
  — these are already in `.gitignore`.
- Do not commit secrets or `.env` files (also gitignored).

### Pulling / Pushing

- Pull with `git pull --ff-only` to avoid merge commits.
- Push feature branches with `git push -u origin <branch>` and open a PR via
  `gh pr create` when collaboration requires it; for solo work on `master`,
  push directly.

## Additional Notes

- The `next.config.ts` includes `allowedDevOrigins` for local-network dev; leave
  it alone unless you need to change dev origins.
- `Loader.tsx` animates using the `animate-loader` token defined in
  `globals.css`.
- When adding a new currency, update `assets/data/flags.ts` and ensure a
  matching flag image (`public/images/flags/<code>.webp`) exists.
- Verify changes with `npm run lint` and `npm run build` (build catches type
  errors). There is no dedicated typecheck script.
