# AI Prompts for VibeAthon 6.0 — Smart Restaurant Management System

Use these with any AI coding tool (Claude Code, Cursor, Windsurf, Copilot
Chat, etc.) once you've unzipped `suvai-os-smart-restaurant.zip` and run
`npm install`. Paste one prompt at a time, let the tool finish, then test
before moving to the next. Each one assumes the tool has the repo open.

---

## Setup prompt (run first)

```
This is a Next.js 14 App Router project called Suvai OS, a restaurant
management platform for a hackathon. Read README.md, then
lib/store.js, lib/auth.js, and lib/session.js to understand the data
model and auth pattern. Don't change the architecture — it uses an
in-memory store (globalThis) instead of a real database, signed cookie
sessions instead of NextAuth, and Tailwind with a "kitchen ticket"
charcoal/saffron/chili color palette defined in tailwind.config.js.
Confirm you understand the patterns before we start making changes.
```

---

## Bronze — User Story 1 (polish the UX)

```
Review the customer-facing pages (app/page.js, app/menu/page.js,
app/cart/page.js, app/reservations/page.js, app/track/[orderId]/page.js)
and the admin pages under app/admin/. Keep the existing charcoal/saffron
"kitchen ticket" visual language and Tailwind classes already in use.
Improve: loading states (skeleton placeholders instead of plain "Loading…"
text), empty states (e.g. empty cart, no orders yet) with a clear next
action, and mobile responsiveness below 400px width. Don't introduce a
new color palette or component library — extend what's already there.
```

```
Add subtle motion: a fade-in when menu items load, a small scale/bounce
on "Add to order", and a smooth transition when an order's status
advances on the tracking page. Keep it restrained — one or two
animated moments, not animation everywhere. Respect
prefers-reduced-motion (there's already a rule for this in
app/globals.css).
```

---

## Silver — User Story 2 (auth) and User Story 3 (digitize workflows)

```
The OTP flow in app/api/auth/otp/route.js currently returns the code
directly in the API response (marked "DEMO ONLY" in a comment) since no
email provider is configured. Wire up Resend (https://resend.com) to
actually email the code: add the `resend` package, read RESEND_API_KEY
from env, send a simple transactional email with the code, and stop
returning devCode in the response once this is live. Update
.env.example and README.md accordingly.
```

```
Add a "waitlist" feature to reservations: when app/api/reservations/route.js
can't find a table big enough (the 409 error case), instead of just
failing, add the guest to a waitlist array in lib/store.js with their
party size and requested time. Add a GET /api/waitlist endpoint (admin-only)
and a small "Join waitlist instead" button on the reservations page that
appears when booking fails. When a table becomes available (its status
changes to "available" in app/api/tables/[id]/route.js), check the
waitlist and auto-notify (just update a `notified: true` flag for now —
no real push notifications needed for the demo).
```

```
Add real-time customer notifications: when an admin advances an order's
status in app/api/orders/[id]/route.js, the customer's tracking page
(app/track/[orderId]/page.js) should show a toast/banner the moment it
changes, not just silently update the stepper. You can keep using the
existing polling approach (it already refetches every 5s) — just add a
visible, dismissible notification when the status changes between polls,
with a distinct message per stage (e.g. "Your order is ready!").
```

---

## Gold — User Story 4 (management dashboard)

```
Add a bulk actions bar to app/admin/orders/page.js: let staff select
multiple orders in the same status column with checkboxes and advance
them all at once with one click, instead of clicking each ticket
individually. Keep the existing kanban layout and API endpoints — this
is a frontend batching change, just call PATCH /api/orders/[id] once per
selected order.
```

```
Add a "Sales by category" breakdown to app/admin/page.js using the
existing Recharts setup: extend GET /api/analytics in
app/api/analytics/route.js to also group revenue by menu category
(Starters/Mains/Desserts/Beverages), and render it as a pie or donut
chart next to the existing revenue bar chart. Follow the same dark
theme colors already used in the bar chart (stroke #302922, saffron
#e0a72e, text #8a7c6b).
```

```
Add CSV export to the admin customers and orders pages: a "Export CSV"
button on app/admin/customers/page.js and app/admin/orders/page.js
that downloads the currently visible table as a .csv file, generated
client-side (no new backend route needed — just convert the already-
fetched JSON to CSV in the browser and trigger a download).
```

---

## Platinum — User Story 5 (intelligent operations)

```
Extend app/api/recommendations/route.js's heuristic fallback into real
demand forecasting: add a new GET /api/forecast endpoint (admin-only)
that looks at lib/store.js's salesLog array and, for each menu item,
estimates likely demand for the next day using a simple moving average
of recent order quantities (no ML library needed — plain JS math is
fine for the demo). Surface the top 3 "stock up on this" and bottom 3
"you're overstocked on this" items as a new card on app/admin/page.js,
styled consistently with the existing StatCard/low-stock-alert
components.
```

```
The recommendations endpoint already upgrades to a real Gemini API call
when GEMINI_API_KEY is set (see app/api/recommendations/route.js). Add
a second AI-powered feature using the same pattern: a "kitchen
assistant" chat widget for admin staff at app/admin/page.js that can
answer natural-language questions like "what's my best seller this
week?" or "which tables are free right now?" by calling the Gemini API
with the current analytics/inventory/tables data as context. Follow the
existing fallback pattern — if GEMINI_API_KEY isn't set, show a message
saying this feature needs an API key rather than breaking.
```

```
Add a smart low-stock-to-menu-availability pipeline: right now
app/api/inventory/route.js only re-enables a linked menu item when its
ingredient is restocked. Extend it so that when an ingredient's quantity
drops below its threshold, the system automatically sets any menu item
using more than 70% of that stock as "limited availability" (a new
status between available and sold out) rather than waiting for it to
hit zero. Show a distinct visual treatment (e.g. amber border instead of
grey) for "limited availability" items on app/menu/page.js.
```

---

## Bonus round (if you have time left)

```
Add a "split the bill" feature: on an order that's in "served" status,
let a customer or staff member split the total evenly across N people
or by specific items, and show each person's share. This can live as a
new section on app/track/[orderId]/page.js, calculating client-side from
the existing order data — no new backend route required unless you want
to persist the split.
```

```
Add a QR-code table ordering flow: generate a QR code (use the `qrcode`
npm package) for each table in app/admin/tables/page.js that encodes a
URL like /menu?table=T3. When a customer visits the menu with that query
param, pre-fill the table field on checkout so they don't have to type
it in manually. This is a strong "innovation" and "problem solving"
judging-criteria feature since it removes staff friction at order time.
```

```
Prepare the submission README: fill in Team Name, the actual list of
user stories you completed (Bronze through Platinum, be honest about
what's real vs stubbed), the hosted app URL once deployed, and a short
"AI Usage" section describing which parts were AI-assisted vs written by
hand. Keep it factual and specific — judges are evaluating problem
solving and code quality, not marketing copy.
```
