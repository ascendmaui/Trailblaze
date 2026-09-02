# Trailblaze Construction

Responsive Trailblaze Construction marketing site and owner operations portal recreated from the supplied reference screens.

## Demo

Live demo: https://trailblaze-construction.john-mathews.chatgpt.site

Owner login:

```text
owner@trailblaze.demo
trailblaze
```

Employee login:

```text
employee@trailblaze.demo
trailblaze
```

The careers page includes an applicant flow, AI interview simulation, scorecard, and owner hiring dashboard inbox. Demo submissions are stored in browser local storage for review.

## Run locally

```bash
npm install
npm run dev
```

Public pages: `/`, `/about`, `/services`, `/work`, `/reviews`, `/careers`, `/contact`.

Portal: `/login`, then sign in to open `/app/overview`.

## Deploy

Build verification:

```bash
npm run build
```

Vercel import settings:

```text
Install command: npm install
Build command: npm run build
Output directory: dist/client
```

The included `vercel.json` applies these settings and rewrites app routes back to `index.html` for the client-side demo.
