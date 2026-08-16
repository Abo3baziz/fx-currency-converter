# 06 - Performance, Caching & Publish

Status: done (deployment complete; hackathon submission remains a manual step)
Priority: medium

## Goal

Optimize data fetching, clean up dev-only config, deploy to production, and
ship the hackathon entry.

## Steps

1. TanStack Query: configure sensible `staleTime`/`gcTime` and retry settings in
   `app/Providers.tsx` (or per query) so rates aren't refetched on every mount.
2. `services/api.ts`: add server-side caching/revalidation (`next: {
   revalidate: 3600 }`) so repeated fetches hit the data cache; dedupe the
   today/yesterday ticker requests so they share one round-trip where possible.
3. `next.config.ts`: remove the dev-only `allowedDevOrigins: ["192.168.1.4"]`.
4. Deployment:
   - Push to the GitHub repo.
   - Deploy to Vercel (`vercel --prod` or via the dashboard / GitHub
     integration).
5. Final release pass: `npm run lint` && `npm run build`, manual smoke test of
   every section (converter, picker, ticker, history, compare, favorites, log)
   on desktop and mobile.
6. Submit the hackathon entry (per challenge instructions) after the live site
   and repo are up.

## Verify

- `npm run lint`
- `npm run build`
- Manual: confirm rates reuse cached data (devtools network tab), verify the
  production URL loads all sections, smoke-test responsive layout.

## Definition of done

- Queries are cached/deduplicated; build is clean.
- No dev-only config ships to production.
- App is live on Vercel with the README-linked repo.
- All sections pass the smoke test on desktop and mobile.