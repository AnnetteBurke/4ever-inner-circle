# 4Ever Inner Circle

A private wedding concierge platform for booked clients of **4Ever Photos**.

> See `CLAUDE.md` for the full project brief — it is the primary reference for anyone (or anything) working on this codebase.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and fill in values (skip for now if you don't have them yet)
cp .env.local.example .env.local

# 3. Run the dev server
npm run dev

# 4. Open http://localhost:3000 in your browser
```

That's it for the first run. The homepage will load with all sections from the mockup, fonts pulled from Google, and the brand styling fully applied. No env vars needed for this first view — Supabase and the other services aren't required until later sessions.

---

## Tech stack

- **Next.js 14** (App Router) — React framework
- **TypeScript** — type safety
- **Tailwind CSS** — styling (brand palette in `tailwind.config.ts`)
- **Supabase** — auth, database, file storage (Phase 1 session 3 onwards)
- **Twilio** — SMS (session 7) and WhatsApp Business (Phase 2)
- **Resend** — email (session 8)
- **Shopify Storefront API** — The Edit shop (session 10)
- **Stripe** — gift registry payments (Phase 2)
- **Vercel** — hosting (auto-deploys from GitHub)

---

## Scripts

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build (run this before deploying)
npm run start        # Run production build locally
npm run lint         # ESLint
npm run type-check   # TypeScript without emitting
```

---

## Folder structure

```
app/              # Next.js App Router — routes, layouts, pages
components/       # Reusable UI components
components/sections/   # Homepage section components
content/          # Pure data (roles, message templates)
lib/              # Clients & business logic (Supabase, scheduling)
public/           # Static files (icons, manifest, images)
```

---

## Deploying

The site is hosted on Vercel and connected to this GitHub repo. Pushing to `main` triggers an automatic production deploy. Pushing to any other branch triggers a preview deploy.

**Before pushing**:
1. Run `npm run build` locally to catch errors.
2. Run `npm run dev` and click through the change in the browser.
3. Commit with a descriptive message: `phase-1/session-N: what changed`.

---

## Environment variables

See `.env.local.example` for the full list. The minimum needed to run the site locally with no functionality is **none** — the homepage works without any env vars.

To enable each piece of functionality:
- Couple log-in (session 3) → `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- SMS (session 7) → `TWILIO_*`
- Email (session 8) → `RESEND_API_KEY`
- Maps (session 9) → `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- The Edit shop (session 10) → `SHOPIFY_*`
- Gift registry (Phase 2) → `STRIPE_*`

Never commit `.env.local`. It's in `.gitignore` already.

---

## Brand colours, at a glance

| Colour | Hex | Tailwind |
|---|---|---|
| Cream (warm ivory) | `#FAF4F0` | `cream` |
| Blush (signature pink) | `#F0D5D0` | `blush` |
| Plum (signature wine) | `#4A1F3D` | `plum` |
| Mauve (signature accent) | `#A86B85` | `mauve` |
| Ink (dark green-charcoal) | `#2E3528` | `ink` |

Full palette and rationale in `CLAUDE.md`.

---

## Questions or stuck?

For product questions, brand decisions, content writing → talk to Annette's planning assistant (Cowork mode).
For code, deployment, technical questions → talk to Claude Code (this CLI).
