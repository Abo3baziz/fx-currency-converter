# 05 - SEO & Deployment

Status: done
Priority: medium

## Goal

Replace the create-next-app boilerplate metadata with real FX Checker metadata
and rewrite the README so the Frontend Mentor submission counts as valid.

## Steps

1. `app/layout.tsx`: replace boilerplate metadata (title "Create Next App") with
   FX Checker metadata: title, description, `viewport`, and Open Graph / Twitter
   tags using `preview.jpg` as the OG image.
2. Confirm the document `<html lang="en">` and that the page has a single
   meaningful `h1`.
3. Rewrite `README.md` (use the Frontend Mentor template structure): project
   overview, screenshot, links (live site + repo), features, tech stack, how to
   run locally, and credits. This README is required for a valid hackathon
   submission.
4. Remove any remaining placeholder content ("55 CURRENCIES" header copy should
   already be updated in task 00; verify it reads 60).
   Note: the header renders the real `flags.length` (57) — 3 flag images
   (cy/hm/hr) have no Frankfurter-backed currency, so the truthful count stays
   57. Metadata/README copy reflects 57.

## Verify

- `npm run lint`
- `npm run build`
- Manual: check the rendered `<title>` and social-preview tags in devtools.

## Definition of done

- Metadata reflects FX Checker, not create-next-app.
- README is complete and submission-ready.
- Lint and build pass.
