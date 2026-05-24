# 4Ever Inner Circle — Project Brief

> Read this file in full before doing any work on the project.
> It tells you what we're building, what's already done, what comes next, and how to behave while working with Annette.

---

## The product

**4Ever Inner Circle** is a private wedding concierge platform for booked clients of **4Ever Photos** (4everphotos.uk), a UK luxury wedding photography business owned by **Annette Burke**.

It sits behind the public 4Ever Photos website. When a couple books, they receive a magic-link invitation to the Inner Circle, where they:

- Add the key people in their wedding (bridal party, parents, suppliers) with role tags.
- Receive role-based automated messages (SMS, WhatsApp, email) at the right moments in their wedding journey — e.g. best man speech tips at 8 weeks, bridesmaid hair-and-makeup timings the day before, supplier shot-wish requests at 3 weeks.
- Browse a curated Shopify shop ("The Edit") for wedding essentials.
- Access "Calm Corner" — tapping sequences from Annette's sister business **Bodytap.co.uk** — with 5 voucher coins gifted.
- Build a shot planner and mood board for their day.
- Run a Prezola-style photography gift registry (extra hour of coverage, fine-art album, sunrise shoot) funded by guests.
- Upload guest photographs after the day to a shared album.

**The aesthetic is luxurious, editorial, calm.** Soft typography, generous spacing, the brand palette throughout. The underlying feeling is "we are looking after you."

**This is a Progressive Web App (PWA)**, not a native app. Couples install it to their home screen. Native app may come in Phase 3 if engagement data justifies it.

---

## Who Annette is

Annette is the owner of 4Ever Photos and Bodytap. She is **not technical**. She is using Claude Code (you) as her developer.

Her strengths: brand vision, content, customer empathy, premium positioning.
Her gaps: code, terminal commands, dev jargon.

**How to behave:**
- Always explain what you're doing and why, in plain English, as you go.
- Never assume she knows what a term means. If you say "environment variable" or "deploy", briefly say what it is.
- Before doing anything destructive (deleting files, force-pushing, modifying production), ask first.
- When you finish a meaningful piece of work, recap what changed and what to expect next.
- If something breaks, walk her through diagnosing it calmly. Paste errors back to her with explanation.
- Match her tone: warm, considered, never rushed.

---

## Brand identity (locked)

**Palette** (defined in `tailwind.config.ts`):

| Token | Hex | Use |
|---|---|---|
| `cream` | `#FAF4F0` | Primary background, warm ivory |
| `blush` | `#F0D5D0` | Signature soft pink |
| `blush-soft` | `#F5E2DD` | Lighter blush, alternate sections |
| `blush-deep` | `#E8C5BE` | Deeper blush, gradients |
| `plum` | `#4A1F3D` | Signature deep wine, dark sections |
| `plum-deep` | `#381530` | Footer, even darker plum |
| `mauve` | `#A86B85` | Signature accent, buttons, labels |
| `mauve-soft` | `#C49AAA` | Lighter mauve |
| `ink` | `#2E3528` | Dark green-charcoal, body headings |
| `charcoal` | `#3D4338` | Body text |

**Typography**:
- **Cormorant Garamond** — editorial serif, headings, italics. Variable: `--font-cormorant`. Tailwind: `font-serif`.
- **Inter** — clean sans, body and UI. Variable: `--font-inter`. Tailwind: `font-sans`.
- **Yellowtail** — brushy script, used as accent for "4ever"-style flourishes. Variable: `--font-yellowtail`. Tailwind: `font-script`. **Use sparingly** — single words like "Inner", "forever", "cared for". Not for long text.
- **Sacramento** — elegant signature font for Annette's sign-off. Variable: `--font-sacramento`. Tailwind: `font-signature`. Used only on Annette's signature.

**Voice**:
- Loud and luxurious. This platform is the result of years of experience and genuine passion — it should feel that way.
- Warm, exciting, alive. Annette is vibrant and present. The copy should be too.
- Never quiet, hushed, considered, hidden, or retreating. The brand is called Love Out Loud — it means it.
- Never corporate, brochure-like, or passively elegant. If it sounds like a luxury hotel leaflet, rewrite it.
- British English (colour not color, organised not organized, behaviour not behavior).
- No em-dashes (Annette's explicit instruction — use commas or line breaks instead).
- Italics for emotional emphasis, not bold.
- Use "we" when speaking on behalf of Annette/4Ever. Use "you" for the couple.
- Words to NEVER use: considered, quiet (as brand positioning), curated, crafted, intentional, hidden, hushed, retreat.
- Words that ARE Annette: real, alive, brilliant, exciting, love, together, vibrant, fabulous, genuine, years of experience, built for you.
- Test: would Annette say this out loud to a bride with a big smile on her face? If yes, keep it. If it sounds like someone else wrote it, rewrite it.

**Visual rules**:
- Plenty of whitespace. The mockup margins are generous; don't shrink them.
- Hairline 1px borders, never thick.
- Sections separated by `border-t border-hairline`.
- Buttons are bordered rectangles with letter-spacing, never filled colour blocks with rounded corners (unless explicitly the "filled CTA" variant on dark backgrounds).
- Never use box-shadows except for subtle elevation on dashboard cards (the existing `shadow-[0_30px_80px_-40px_rgba(74,31,61,0.18)]` is the only one).
- No emojis in production UI text (unless explicitly part of brand voice — Annette sometimes uses ✦ in messages).

---

## What's already built (Phase 1, session 1)

I (Annette's planning assistant in Cowork mode) prepared the foundation before this Claude Code session began. The current state:

### Files in place

```
4ever-inner-circle/
├── CLAUDE.md                                      ← you are reading this
├── README.md                                      ← setup & npm install instructions
├── package.json                                   ← dependencies (Next.js 14, React 18, Tailwind, Supabase)
├── next.config.js
├── tsconfig.json
├── postcss.config.js
├── tailwind.config.ts                             ← brand palette + fonts as Tailwind tokens
├── .gitignore
├── .env.local.example                             ← env var template
├── app/
│   ├── layout.tsx                                 ← root layout, fonts loaded, PWA meta
│   ├── globals.css                                ← Tailwind + base styles, brand variables
│   └── page.tsx                                   ← homepage, composes section components
├── components/
│   ├── Nav.tsx                                    ← fixed top nav with brand mark
│   ├── Footer.tsx                                 ← plum footer with wordmark
│   └── sections/
│       ├── HeroSection.tsx
│       ├── DashboardSection.tsx
│       ├── JourneySection.tsx
│       ├── PeopleSection.tsx
│       ├── MoodSection.tsx
│       ├── CalmSection.tsx
│       ├── EditSection.tsx
│       ├── RegistrySection.tsx
│       ├── GuestAlbumSection.tsx
│       └── SignatureBlock.tsx
├── lib/
│   └── supabase.ts                                ← Supabase client (placeholder, env vars not yet set)
├── content/
│   ├── roles.ts                                   ← role definitions (best man, bridesmaid, etc.)
│   └── messages.ts                                ← message templates in Annette's voice
└── public/
    ├── manifest.json                              ← PWA manifest
    └── icons/
        └── README.txt                             ← placeholder; real icons needed before production
```

### Not yet done

- `npm install` has not been run. **First task: run `npm install` in this folder.**
- The dev server has not been started.
- No GitHub repo exists for this project yet.
- No Vercel project is connected.
- No Supabase project exists.
- No real PNG icons in `/public/icons/` (just a README placeholder).
- The "you're looking at the homepage" content is the public marketing-style preview. The actual private dashboard (after a couple logs in) doesn't exist yet — that's session 4.

---

## Phase 1 sessions (the path)

Take these one at a time. Don't try to do more than one in a single session unless Annette explicitly asks.

| Session | Goal | Estimated time |
|---|---|---|
| **1** (current) | Foundation live: `npm install`, dev server runs, Git init, push to GitHub, deploy to Vercel, see homepage at a Vercel URL. | 2–4 hours |
| **2** | Polish all the homepage sections; fix anything that doesn't quite match the mockup; mobile responsive checks. | 2–3 hours |
| **3** | Connect Supabase. Build magic-link couple authentication. Couples receive an invitation email and click to log in. | 4–6 hours |
| **4** | Build the **private dashboard** at `/home` (different from the public landing page). Show countdown, the cards (People, Mood, Edit, Calm, Registry). | 3–5 hours |
| **5** | "Your People" — UI + Supabase table for adding/editing people with role tags. Use `content/roles.ts` for the role list. | 3–4 hours |
| **6** | Message scheduling engine. Use `content/messages.ts` templates. Calculate send times based on each person's role and the wedding date. Store scheduled sends in Supabase. | 5–7 hours |
| **7** | Sign up for Twilio. Wire up SMS sending. Test end-to-end with Annette's own phone. | 3–4 hours |
| **8** | Sign up for Resend. Wire up email sending. Send test welcome email. | 2–3 hours |
| **9** | Add Google Maps pin attachment per role-based message. | 2 hours |
| **10** | The Edit — Shopify Storefront API embed. Show 6–12 products in brand style. | 4–6 hours |
| **11** | GDPR: cookie consent, data export endpoint, account deletion flow. Accessibility audit. Performance polish. | 4–6 hours |
| **12** | Soft launch with one real booked couple. Onboarding flow polish. Watch how they use it. | 3–5 hours |

**WhatsApp Business approval should start in session 3** — it takes 4–8 weeks from Meta. Don't wait until session 7 to start.

---

## Conventions to follow

**Code style**:
- TypeScript everywhere. No `any` unless genuinely unavoidable.
- React Server Components by default. Add `'use client'` only when needed (state, effects, event handlers).
- Tailwind for styling. Avoid inline `style={}` except for one-off complex gradients.
- One component per file, named after the file.
- Section components live in `components/sections/`. Reusable UI lives in `components/`.

**Folder rules**:
- `app/` — routes, layouts, pages only.
- `components/` — UI components, no business logic.
- `lib/` — clients, utilities, business logic (supabase, twilio, resend, scheduling).
- `content/` — pure data (roles, message templates, copy). No code logic beyond simple helpers.
- `public/` — static files served at root.

**Git habits**:
- Commit frequently with clear messages. Format: `phase-1/session-N: short description`.
- Never commit `.env.local`.
- Branch only for risky experiments. Otherwise commit to `main` and let Vercel auto-deploy.

**Before deploying anything to production**:
- Run `npm run build` locally first. If it fails, fix before pushing.
- Test the change in `npm run dev` and click through it yourself.
- Show Annette a screenshot or ask her to look at the local preview before pushing.

**Things to never do without asking**:
- Delete or rename files in `content/` (those are Annette's words and structure).
- Change brand colours or fonts in `tailwind.config.ts`.
- Modify `CLAUDE.md` to remove guidance.
- Force-push to main.
- Run any command that touches her existing 4everphotos.uk domain settings.

---

## Reference documents

Annette has three companion files (the mockup, the roadmap, and the getting-started guide) that were created during planning. They live alongside this project in the same folder or one folder up. If you need to consult them:

- `4ever-inner-circle-mockup.html` — the visual design reference. Use this to check what each section should look like.
- `4ever-inner-circle-roadmap.html` — the phased build plan. Use this to understand context for each session.
- `4ever-inner-circle-getting-started.html` — the setup guide Annette is following.

If she hasn't moved them into this folder, ask her where they are.

---

## When you start a new session

1. Read this file first (you may already have it in context — re-skim for the conventions).
2. Ask Annette which session she'd like to tackle today.
3. Recap what was done in the previous session.
4. Propose what you'll do, in order, before starting.
5. Work step by step, explaining as you go.
6. At the end: recap, commit, push (so Vercel deploys), suggest the next session.

---

## North Star

> "The best wedding photographs begin long before we press the shutter."

This platform is the result of years of real experience, real love for what Annette does, and a genuine desire to make every couple feel like the most important people in the world. It should feel exciting to open, brilliant to use, and completely unique — because it is. Build with that energy. If a feature feels flat or generic, make it better. If copy sounds like anyone else wrote it, rewrite it in Annette's voice.
