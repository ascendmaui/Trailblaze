# Trailblaze Construction

Trailblaze Construction marketing site and secure operations portal.

## Production services

- Supabase Auth with a bootstrap owner account and invitation-only employee access.
- Row Level Security on every production table.
- Live jobs, payouts, time entries, applicant records, notifications, and contact requests.
- Public contact and career application endpoints deployed as Supabase Edge Functions.

The owner bootstrap email is `hkirk@trailblazeconstruction.com`. The initial owner creates the account at `/login`; every other employee must be invited from the owner workspace before registering.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

The checked-in Supabase project fallback enables the deployed client to reach the production database. Use `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local` to override it for another environment.

Public pages: `/`, `/about`, `/services`, `/work`, `/reviews`, `/careers`, `/contact`.

Portal: `/login`, then sign in to open `/app/overview`.

## Deploy

```bash
npm run build:vercel
```

Vercel uses `vercel.json` to build the static client and preserve client-side routes.
