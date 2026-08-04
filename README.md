# A Builder Hut — website

Production website for **A Builder Hut**, a 24×7 air-conditioned gym with three branches
across Maheshtala and Budge Budge, Kolkata.

Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion,
GSAP + Lenis, shadcn/ui primitives, Embla, React Hook Form + Zod, and Leaflet.

---

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. That is the whole setup — no API keys, no database, no CMS
account. The site is fully functional before you configure anything.

```bash
npm run dev        # development server
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint
npm run typecheck  # TypeScript, no emit
npm run verify     # typecheck + lint + build, in that order
```

Requires Node 18.18 or newer. Node 20 LTS is recommended.

---

## What is on the site

| Route | Page |
| --- | --- |
| `/` | Home — hero slider, live Kolkata clock, stats, facilities, branches, method, plans, testimonials |
| `/about` | Story, the three-branch chronology, operating principles |
| `/branches` | All branches, plus a map with all three plotted |
| `/branches/[slug]` | Per-branch: address, hours, equipment, facilities, map, enquiry form |
| `/facilities` | All eleven facilities, marked per branch |
| `/membership` | Monthly / quarterly / half-yearly / yearly, plus membership FAQ |
| `/personal-training` | The 12-week method, PT packages, coaching roles |
| `/transformations` | The method, and member results once consent exists |
| `/gallery` | Masonry grid with a keyboard-navigable lightbox |
| `/bmi-calculator` | Metric and imperial, WHO and Asian-origin scales |
| `/testimonials` | Quotes plus links to the real Google listings |
| `/blog`, `/blog/[slug]` | Five articles written for this catchment |
| `/faq` | Sixteen questions, filterable, with FAQPage structured data |
| `/contact` | Call / WhatsApp / email, free-trial form, all three addresses and a map |

Also generated: `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/api/contact`,
a 404 page and a route-level error boundary.

---

## Editing content without touching components

Everything a non-developer would want to change lives in two places.

### `src/lib/site.ts`

Brand name, tagline, phone numbers, WhatsApp number, email, social profile URLs,
navigation, and the aggregate review figure.

### `src/content/*.ts`

| File | Holds |
| --- | --- |
| `branches.ts` | The three branches: addresses, coordinates, Google Place IDs, ratings, equipment |
| `facilities.ts` | The facility catalogue, and which branches each one is at |
| `membership.ts` | Plans, prices, perks, PT packages, headline stats |
| `programme.ts` | The 12-week method and the operating principles |
| `testimonials.ts` | Member quotes |
| `trainers.ts` | Coaching roles — replace with real staff once they consent |
| `transformations.ts` | Before/after results. Empty until you have written consent |
| `gallery.ts` | Gallery manifest, with the source page for each real photo |
| `faq.ts` | Questions and answers — also feeds the FAQPage structured data |
| `blog.ts` | Blog posts, as typed blocks rather than MDX |

Each file is plain TypeScript data with comments explaining the fields. Adding a blog post
means copying an entry in `blog.ts`; adding a facility means adding an object to
`facilities.ts`. No build step, no CMS login.

**Prices.** `src/content/membership.ts` starts with `PRICING_CONFIRMED = false`, and while
that is false the membership and PT pages show a line telling visitors to call for today's
rate. Put the real prices in, then set it to `true` to remove that line.

---

## Owner checklist before going live

Search the codebase for `OWNER ACTION` — each one is a decision only you can make.

1. **Phone and email.** `src/lib/site.ts` → `contact.email` is a placeholder. Set it to a
   mailbox you actually read.
2. **Prices.** `src/content/membership.ts` → replace every `price` and `strikePrice`, then
   set `PRICING_CONFIRMED = true`.
3. **Floor areas.** `src/content/branches.ts` → two branches have `areaSqft: null` because
   no public source lists them. Fill them in or leave them out.
4. **Photographs.** Follow `public/images/ASSETS.md`. The branch photos matter most.
5. **Logo.** Also in `public/images/ASSETS.md`.
6. **Trainers.** `src/content/trainers.ts` lists roles, not people. Add real names and
   photos once each trainer has agreed, and set `isRole: false`.
7. **Testimonials.** `src/content/testimonials.ts` entries are marked `isExample: true` and
   render with an "example" badge. Ask members for a written quote, then set the flag to
   false. (Republishing Google review text is not permitted by Google's terms; if you want
   live reviews, use the Places API with your own key and Google's attribution.)
8. **Transformations.** Only with written consent. See the notes in that file.
9. **Domain.** Set `NEXT_PUBLIC_SITE_URL` (below) — canonical tags, Open Graph and the
   sitemap all read from it.

---

## Environment variables

Copy `.env.example` to `.env.local`. All of them are optional; the site works with none.

| Variable | Effect if unset |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonicals and sitemap fall back to `https://abuilderhut.com` |
| `FORM_ENDPOINT` | The enquiry form falls back to opening WhatsApp with the details pre-filled |
| `NEXT_PUBLIC_GA_ID` | Analytics is skipped |

### How the enquiry form behaves

`/api/contact` validates every submission with the same Zod schema the browser uses, then:

- **`FORM_ENDPOINT` set** → forwards the enquiry as JSON. Anything that accepts a JSON POST
  works: Formspree, Web3Forms, a Google Apps Script, your CRM.
- **not set** → responds with a WhatsApp fallback, and the browser opens a pre-filled chat.

So no enquiry is ever silently lost, even on a freshly deployed site with nothing
configured. A hidden honeypot field rejects most bot submissions.

---

## Deploying to Vercel

1. Push the repository to GitHub.
2. In Vercel, **Add New → Project**, and import it. The framework is detected automatically.
3. Add `NEXT_PUBLIC_SITE_URL` (your real domain) under **Settings → Environment Variables**.
   Add `FORM_ENDPOINT` too if you have one.
4. Deploy.

`vercel.json` pins the deployment region to `bom1` (Mumbai), which is the closest region to
Kolkata and takes roughly 100–150 ms off every server response for local visitors.

The site is fully static apart from `/api/contact`, so it serves from the edge cache.

---

## SEO

- Per-page metadata through one helper (`src/lib/seo.ts`) — canonical URL, Open Graph,
  Twitter card and robots directives, so a change to the defaults propagates everywhere.
- Structured data in `src/lib/structured-data.ts`: `Organization`, `WebSite`, one
  `HealthAndBeautyBusiness` node per branch with real coordinates, opening hours and
  aggregate ratings, `Offer` nodes for the plans, `BreadcrumbList` on every page,
  `FAQPage` on the FAQ, and `Article` on each blog post.
- `sitemap.xml` is generated from the same nav array the header renders, plus every branch
  and blog post — so a new page is listed the moment it is added.
- Local-intent keywords ("gym in Maheshtala", "24 hours gym Kolkata") are applied site-wide
  from `baseKeywords`.

**After launch:** verify the domain in Google Search Console, submit the sitemap, and — far
more valuable for a gym — make sure all three Google Business Profiles are claimed, with
correct hours, photos and the website URL pointing here.

---

## Performance and accessibility

- Every image goes through `next/image` with AVIF/WebP, explicit `sizes` and lazy loading
  below the fold. The first hero slide is marked `priority`.
- Fonts load through `next/font` with `display: swap` and declared fallbacks, so no layout
  shift and no render-blocking request.
- Placeholders are the exact aspect ratio of the real photos, so swapping them in causes no
  cumulative layout shift.
- `prefers-reduced-motion` is honoured properly: the preloader is skipped, Lenis is never
  instantiated, GSAP timelines do not start, and carousel autoplay is not attached — not
  just an animation-duration override.
- Keyboard focus is visible everywhere, there is a skip link, the gallery lightbox is
  arrow-key navigable, and form errors are wired with `aria-invalid` and `aria-describedby`.
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`) are set in `next.config.mjs`; `/images/*` is cached immutably.

---

## Project structure

```
src/
├── app/                  routes, metadata, sitemap, robots, manifest, API
├── components/
│   ├── blog/             post body renderer
│   ├── branches/         branch card, Leaflet map + client-only loader
│   ├── common/           reveal, parallax, tilt, marquee, preloader, page hero, FAQ list
│   ├── forms/            enquiry form
│   ├── gallery/          masonry grid + lightbox
│   ├── home/             the home page sections
│   ├── layout/           header, footer, floating actions, smooth scroll
│   ├── tools/            BMI calculator
│   └── ui/               shadcn/ui primitives, restyled to the palette
├── content/              all editable content
├── hooks/                reduced motion, branch clock, scroll state
└── lib/                  utils, GSAP registration, motion variants, SEO, schema, validation
```

### Why Leaflet and not Google Maps

The Google Maps JavaScript API needs a billing-enabled key before it renders a single tile,
which would break the promise that this deploys with no additional setup. Leaflet with
OpenStreetMap tiles needs nothing. Directions links still open Google Maps against each
branch's real Place ID, so members get the routing they expect.

### How motion is divided

Framer Motion handles mount/unmount, hover, and the preloader. GSAP ScrollTrigger handles
anything tied to scroll position. Lenis owns the scroll position itself and is driven from
`gsap.ticker` so ScrollTrigger's measurements and the eased scroll stay on the same frame.
Keeping the three in separate lanes stops them fighting over the same transform.

---

## Troubleshooting the build

A Next.js production build compiles first, then type-checks — and it **stops at the first
type error**. Deploying to find them one at a time is a slow loop. Get the full list in one
go instead:

```bash
npm install
npx tsc --noEmit          # every type error at once
npm run lint              # lint errors also fail the build
```

If you need the site live before the types are perfect, this is a deliberate, temporary
escape hatch — the JavaScript compiles fine, only the type gate fails:

```js
// next.config.mjs
const nextConfig = {
  typescript: { ignoreBuildErrors: true },   // TEMPORARY — remove once tsc is clean
  // …
};
```

Remove it as soon as `npx tsc --noEmit` passes. Leaving it on means the next real type
error ships silently.

### Notes on two libraries

- **GSAP** — `gsap.core.globals()` exists at runtime but has never been in GSAP's published
  type definitions. Do not use it to guard plugin registration; `gsap.registerPlugin()` is
  already safe to call more than once.
- **tailwindcss-animate** — this plugin claims `duration-*` for `animation-duration`, which
  collides with Tailwind core's `transition-duration`. Tailwind then drops the class
  entirely and warns. Use `[transition-duration:1200ms]` instead of `duration-[1200ms]`.

---

## Content honesty

Several things on this site are deliberately marked rather than invented:

- **Trainers** are roles, not named people — no trainer's name or photo is public.
- **Testimonials** carry an "example" badge until real member quotes replace them.
- **Transformations** is empty until members give written consent.
- **Prices** show a "call for today's rate" line until you confirm them.
- **Images** are placeholders that name the public page the real photo should come from.

Each one flips automatically once you supply the real thing. Nothing needs a code change,
and nothing false ships in the meantime.
