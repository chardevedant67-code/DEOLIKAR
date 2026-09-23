# Deolikar Mutual Funds and Investment Services — website

Bilingual (English / हिंदी) marketing site with SIP and SWP calculators, built with Next.js (App Router), React, TypeScript and Tailwind CSS v4. No UI, chart or animation libraries — charts, counters, scroll effects and the loader are custom and dependency-free (only `lucide-react` icons are used).

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
npm run test:calc  # independent checks of the SIP / SWP maths and Indian formatting
```

## Where things live

| What | Where |
| --- | --- |
| **All copy, English and Hindi** (typed — the compiler enforces that Hindi is complete) | `src/lib/i18n/dictionary.ts` |
| Language store + `<html lang>` / title sync | `src/lib/i18n/` |
| SIP / SWP maths, slider scales | `src/lib/calculators.ts` |
| Indian ₹ formatting, lakh/crore words | `src/lib/format.ts` |
| Phone, email, ARN, WhatsApp / mailto helpers | `src/lib/contact.ts` |
| Calculator limits (min / max / defaults) | `SIP_LIMITS` / `SWP_LIMITS` in `src/components/calculator/` |
| Design tokens, animations, reduced-motion rules | `src/app/globals.css` |
| Page sections | `src/components/` (`Hero`, `TrustBar`, `Services`, `WhyChooseUs`, `About`, `FinancialJourney` = "Our Approach", `calculator/`, `GoalPlanner`, `CTASection`, `Questions`, `Contact`, `Disclaimer`, `Footer`) |
| Contact form API | `src/app/api/contact/route.ts` |
| SEO: metadata + JSON-LD, sitemap, robots | `src/app/layout.tsx`, `sitemap.ts`, `robots.ts` |

## Brand assets

The real logo is `public/brand/deolikar-logo.jpeg` (it ships on its own navy tile, so it is shown as a rounded tile and never recoloured, cropped or stretched). The favicon / app icon come from `public/brand/deolikar-mark.png` via `src/app/icon.png`. Replace these files to update the logo — no code changes needed.

## Contact form email delivery

The form validates in the browser and again on the server. To have submissions emailed to `info@deolikarwealth.com`:

1. Create a [Resend](https://resend.com) account and copy `.env.example` to `.env.local`.
2. Set `RESEND_API_KEY` (and `CONTACT_FROM_EMAIL` once a sending domain is verified).

**Without the key, the form is honest about it:** instead of saying "request received", it shows the visitor a one-tap *Send on WhatsApp* / *Send by email* hand-off with their details pre-filled, so no enquiry is silently lost. Secrets are only ever read on the server.

## Content rules this site follows

- Business copy (services, About, Approach, disclaimers, contact details) is used exactly as supplied.
- No testimonials, client counts, AUM, awards, ratings, certifications or return claims. The 25 % calculator maximum is only an input limit, labelled as an illustrative assumption.
- The disclaimer and the calculator disclaimers are shown in full in both languages.

## Notes

- Language choice is stored in `localStorage` (`deolikar-lang`). A tiny inline script in `layout.tsx` restores it before first paint, and hides the English server render for Hindi visitors until the page has switched over.
- Loader: pure CSS, ~1.2 s, shown once per browser session, and reduced to a short fade with `prefers-reduced-motion`.
- The Devanagari font is only downloaded when Hindi text is on screen.
