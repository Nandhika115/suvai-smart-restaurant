# Suvai OS — Smart Restaurant Management System

Built for VibeAthon 6.0 (2K26) — Problem Statement: Smart Restaurant Management System.

A full-stack restaurant platform: a live customer-facing digital menu and
reservation flow, plus a management dashboard for orders, inventory, tables,
staff, and analytics.

## Tech stack

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend:** Next.js API routes (Node.js)
- **Data store:** in-memory JS store, seeded with demo data (swap for
  Postgres/Supabase/MongoDB when you move past the hackathon — every
  function in `lib/store.js` is already shaped like a repository)
- **Auth:** email/password with scrypt hashing, email OTP (simulated —
  see below), and a real Google OAuth code flow
- **Charts:** Recharts
- **AI:** heuristic recommendation engine with an optional real Gemini API
  upgrade path

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

**Demo accounts** (seeded automatically):
- Admin: `admin@smartbistro.app` / `admin123` → redirects to `/admin`
- Customer: `guest@smartbistro.app` / `demo123`

## What's implemented, mapped to the problem statement's user stories

**Bronze — User Story 1 (UX):** distinct customer site (`/`, `/menu`,
`/reservations`, `/cart`, `/track/[id]`) and management console (`/admin/*`),
both built around a "kitchen ticket" visual language — order tickets,
perforated edges, live status stepper.

**Silver — User Story 2 (Auth):**
- Email/password login (`/login`), signup (`/signup`)
- Email OTP as an alternative sign-in path (demo mode returns the code on
  screen since no email provider is wired up — see "OTP in production" below)
- Google OAuth — real authorization-code flow (`/api/auth/google` →
  `/api/auth/google/callback`); needs your own Google credentials, see below
- Role-based access: `/admin/*` redirects non-admins to `/login`

**Silver — User Story 3 (Digitize workflows):** digital menu with live
availability (`/menu`, polls every 8s), smart reservations with automatic
table-matching (`/reservations`), order management with a kitchen-flow
status pipeline (`received → preparing → ready → served → billed`), queue
management via the tables board, billing totals on every order, and
order-status tracking for the customer (`/track/[orderId]`).

**Gold — User Story 4 (Management dashboard):** `/admin` — orders board
(kanban by status), menu editor (price/stock/availability), inventory with
low-stock alerts and restocking, table floor plan, staff roster, customer
CRM, and analytics (revenue chart, top sellers, occupancy).

**Platinum — User Story 5 (Intelligent features):** `/api/recommendations`
returns personalized dish picks based on order history. It works instantly
with zero setup (deterministic heuristic) and upgrades automatically to a
real Gemini API call if you set `GEMINI_API_KEY` — a good example of
"ship the deterministic version first, layer AI on top" for your demo.
Low-stock alerts on the dashboard are a simple version of inventory
prediction; extending that into real demand forecasting (e.g. a small
moving-average or regression over `salesLog`) is a good bonus feature to
build live during judging.

## Wiring up real Google OAuth (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs &
   Services → Credentials → Create Credentials → OAuth Client ID → Web app.
2. Authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
   (and your deployed URL + `/api/auth/google/callback` once hosted).
3. Copy the Client ID and Secret into `.env.local`.
4. Click "Continue with Google" on `/login`.

## OTP in production

Right now `/api/auth/otp` generates a 6-digit code and returns it directly
in the response so you can demo without any email account. Before judging,
either keep it as-is and mention this clearly in your README/demo (a lot of
teams do this for hackathons), or wire in a real provider — a few lines with
[Resend](https://resend.com) or [Nodemailer](https://nodemailer.com) in
`app/api/auth/otp/route.js` where the comment says "DEMO ONLY".

## Deployment

**For this in-memory demo store, prefer Render or Railway over Vercel.**
Both run your app as one long-lived Node process, so the seeded data and
anything created during judging (orders, reservations, menu edits) stays
consistent across every request. Vercel runs API routes as separate
serverless functions that can cold-start on different instances, which can
make the in-memory store look like it "forgets" things mid-demo.

Render/Railway: connect your GitHub repo, set build command `npm run build`,
start command `npm start`, and add the environment variables below.

If you'd rather use Vercel anyway (e.g. for its speed and free tier), it
still works — just be aware of the caveat above, and consider it as a
strong reason to swap `lib/store.js` for Supabase (a few hours of extra
work, and a great "we know the roadmap" line for judges).

```bash
npm i -g vercel
vercel
```

Then set the same environment variables from `.env.local` in your Vercel
project settings.

**Note on the in-memory store:** data resets whenever the server restarts
(e.g. on every new serverless deployment/cold start on Vercel). That's fine
for a hackathon demo. For a persistent version, move `lib/store.js`'s
functions onto Supabase or MongoDB — the function signatures are already
written so the rest of the app doesn't need to change.

## Project structure

```
app/
  page.js                 → homepage
  menu/page.js             → live digital menu + recommendations
  cart/page.js              → checkout
  reservations/page.js      → book a table
  track/[orderId]/page.js   → order status tracking
  orders/page.js             → customer order history
  login/, signup/page.js     → auth
  admin/                      → management console (protected)
    page.js                    → analytics overview
    orders/page.js              → kitchen order board
    menu/page.js                 → menu CRUD
    inventory/page.js             → stock + restocking
    tables/page.js                 → floor plan + reservations queue
    staff/page.js                   → roster
    customers/page.js                → CRM
  api/                          → all backend routes (see below)
lib/
  store.js    → in-memory database + seed data
  auth.js     → password hashing, session signing, OTP
  session.js  → read the logged-in user in a route handler
components/    → shared UI (Navbar, cart context, stat cards, etc.)
```

## Submission checklist (per the problem statement)

- [ ] Deploy and get a public URL (Vercel/Netlify/Render)
- [ ] Push this repo to a **public** GitHub repository
- [ ] Fill in the README's Team Name, and list which user stories you
      completed (this file already documents Bronze–Platinum coverage —
      trim/expand based on what you actually finish)
- [ ] Note any AI usage (this README already documents the AI-assisted
      build and the Gemini-powered recommendations feature)
- [ ] Add your hosted application link here once deployed
