# Stratifit — Full Project Description & Prompt File

> A single-file, exhaustive reference to the Stratifit project: from origin and intent, through stack, design tokens, architecture, services, CMS, admin dashboard, lead platform, AI chatbots, email system, security, deployment, and evolution. Use it as a one-shot prompt to onboard a new contributor, AI agent, or stakeholder.

---

## 1. Project Overview

**Stratifit** is a premium digital agency website that doubles as a full operating system: a multilingual marketing site, a CMS-backed content platform, a private admin dashboard, a lead pipeline with automated email follow-ups, and a portfolio of embedded AI assistants.

- **Domain:** Multi-service digital agency (brand design, website development, AI automation, growth marketing)
- **Target audience:** Ambitious startups and enterprises that want brand + design + engineering + growth under one roof
- **Operating model:** Showcases 4 service lines, a project portfolio, blog (insights), an "About" story, a marketplace of pre-built businesses for sale, and a 24/7 multilingual chatbot
- **Brand voice:** Premium, confident, technical, design-led. Black + amber palette. Heavy typography. Cinematic motion.

### Why it exists

Stratifit's website is the agency's flagship product. It is the only channel a prospect sees before deciding to engage. It must therefore be:
- **Fast** (Next.js 16, React 19, static + edge-friendly)
- **Beautiful** (Framer Motion, GSAP, Lenis smooth scroll, amber-glow accents)
- **Self-service for the team** (CMS-driven content, no code deploys to update copy)
- **Multilingual** (English, German, French, Spanish)
- **Measurable** (Supabase + Resend + Groq wired for full funnel observability)

---

## 2. Tech Stack

| Layer | Tech | Version / Notes |
|---|---|---|
| **Framework** | Next.js (App Router) | 16 |
| **UI runtime** | React | 19 |
| **Language** | TypeScript | strict mode |
| **Styling** | Tailwind CSS | v4 (tokens via `@theme inline` in `globals.css`) |
| **Animation** | Framer Motion + GSAP + Lenis (`@studio-freight/lenis`) | cinematic scroll + counter-ups |
| **Icons** | `react-icons/hi2` | Heroicons v2 outline |
| **Database / Auth / Realtime** | Supabase (`@supabase/supabase-js`) | anon + service-role clients, Postgres + Realtime |
| **Email** | Resend | transactional + templates |
| **LLM** | Groq SDK | `llama-3.3-70b-versatile` default, multi-prompt per surface |
| **Bot protection** | Cloudflare Turnstile | site-key + secret-key on contact form |
| **Validation** | Zod | contact-form server schema |
| **Hosting** | Vercel | cron `*/15 * * * *` on `/api/cron/followups` |
| **Lint / Format** | ESLint + Prettier | flat config |
| **Process** | bash + scripts/ | `smoke-test.sh`, `cms-migration.sql`, seed scripts |

### Dependencies (`package.json` runtime)

```
next, react, react-dom, typescript
@supabase/supabase-js
groq-sdk, resend
framer-motion, gsap, @studio-freight/lenis
react-icons, lucide-react (where used)
zod
```


---

## 3. Design System

### 3.1 Color tokens (`src/app/globals.css` → `@theme inline`)

| Token | Use |
|---|---|
| `--color-amber` | Primary brand / accent / CTAs |
| `--color-amber-light` | Hover state for amber |
| `--color-amber-dark` | Pressed / deep accent |
| `--color-amber-glow` | Radial glow / decorative blur |
| `--color-bg` (black) | Page background |
| `--color-card-dark` | Card surface (slightly lifted black) |
| `--color-border` (white/5) | Hairline borders |
| `--color-text` (white) | Primary text |
| `--color-text-muted` (gray-400/500) | Secondary text |
| `text-amber`, `bg-amber`, `border-amber/20` | Most-used utility palette |

The default theme is **dark-first**. The site never inverts to light — amber is the single accent against pure black.

### 3.2 Typography

- **Heading font:** `Satoshi` (with `Inter` fallback). Used for H1–H3, stat numbers, button labels, eyebrows.
- **Body font:** `Inter`. Used for paragraphs, captions, form inputs.
- **Eyebrow / micro labels:** uppercase, `tracking-[0.2em]`, `text-xs`, `font-bold`, color `text-amber`.
- **Font loading:** `next/font` in `src/app/layout.tsx`, applied via `--font-sans` and `--font-heading` CSS variables.
- **Display sizes:** H1 `text-4xl sm:text-5xl md:text-6xl lg:text-7xl`, body `text-base sm:text-lg md:text-xl`, eyebrow `text-xs`.

### 3.3 Motion language

- **Entrance:** `motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5–0.6 }}` — almost every section.
- **Scroll smoothing:** `<SmoothScroll>` (Lenis) wraps the root layout.
- **Counter-up:** Custom `IntersectionObserver` script in `layout.tsx` animates numeric stats on first view.
- **Sticky back button:** `position: fixed`, `top-16 lg:top-20`, `left-1`, `z-50`, blurred background.
- **Glow orbs:** `absolute` positioned `bg-amber-glow rounded-full blur-[120px] opacity-30`, decorative.
- **Section padding:** `pt-32 pb-16` (hero), `pb-20` (stat blocks), `mb-16` (vertical rhythm between content blocks).

### 3.4 Layout primitives

- `min-h-screen bg-black` on every page `<main>`.
- `max-w-7xl` for hero/wide, `max-w-4xl` for stat strips, `max-w-3xl` for editorial content.
- `grid-cols-2 md:grid-cols-4` for stat cards.
- `grid-cols-1 sm:grid-cols-2` for value cards.
- Cards: `bg-card-dark rounded-2xl border border-white/5 p-6 hover:border-amber/20 transition-all`.

---

## 4. File Tree

```
.
├── docs/                       # AUDIT.md, VERIFY.md, PROJECT.md (this file)
├── public/                     # Static assets
├── scripts/
│   ├── cms-migration.sql       # Supabase schema (idempotent, ~30 tables)
│   ├── cms-seed.sql            # Seed data for empty installs
│   ├── seed-*.sql              # Targeted seed scripts
│   └── smoke-test.sh           # Post-deploy verification (4 phases)
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public pages)      # /, /about, /services, /insights, /portfolio, /buy-business, /contact, /testimonials
│   │   ├── (legal)             # /privacy-policy, /terms-conditions, /cookie-policy
│   │   ├── admin/              # 27 admin pages (Dashboard, leads, CMS, bots, settings, ...)
│   │   ├── api/                # 13 API routes
│   │   ├── layout.tsx          # Root layout (fonts, providers, chatbot)
│   │   ├── not-found.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── admin/              # Sidebar, TopBar, Guard, nav-config, TranslatableFieldEditor
│   │   ├── chat/               # AIChatbot, DesktopChatbot, ContactChatbot, FaqAIChat, ComingSoonAIChat
│   │   ├── contact/            # ContactModal
│   │   ├── layout/             # Header, Footer, CookiePopup, LanguageDropdown, MarketingChrome, Flag
│   │   ├── providers/          # SmoothScroll (Lenis)
│   │   └── sections/           # 14 homepage/section components
│   ├── data/                   # Static fallback content (insights, projects, testimonials, FAQ, buy-business)
│   └── lib/                    # supabase, use-cms, cms-types, LanguageContext, stratifit-i18n, email, llm,
│                                # admin-auth, content-editor-config, slugify, faq-knowledge, chat-llm-client,
│                                # buy-business-ui, cms-adapters, lang
├── .commandcode/               # Local tooling configs
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind (via @theme in globals.css)   # no tailwind.config file — v4 inline tokens
├── tsconfig.json
└── vercel.json                 # cron schedule
```

---

## 5. Multilingual / i18n

- **Languages:** `en`, `de`, `fr`, `es` (typed as `Language` in `src/lib/cms-types.ts`).
- **Two parallel i18n layers:**
  1. **Static labels** (nav, footer, eyebrow strings) — `src/lib/stratifit-i18n.ts` (`labelTranslations`) and `tLabel()` helper.
  2. **Dynamic content** (any field that admins may edit) — `TranslatableString` (`Record<Language, string>`) and `TranslatableArray` (`Record<Language, string[]>`) stored as JSONB in Supabase, resolved at render time with `t(value, lang)` and `ta(value, lang)` helpers.
- **LanguageContext** (`src/lib/LanguageContext.tsx`): a React context with `lang`, `langCode`, `setLangCode`; persists to `localStorage`; hydrates after mount to avoid SSR mismatches; auto-detects via `Accept-Language` and falls back to `en`.
- **DB-level:** All content tables use `JSONB` columns with a fixed `en/de/fr/es` key set. Empty locales fall back to `en` via `t()`.
- **Helper conventions:**
  - `t(value, lang)` → string
  - `ta(value, lang)` → string[]
  - `emptyTranslatableString()` / `emptyTranslatableArray()` for new CMS rows
  - In admin forms, `setStringField(field, lang, value)` and `setArrayField(field, lang, raw)` always spread the existing record before overriding one key, so editing one language preserves the other 3.

---

## 6. CMS Architecture

### 6.1 Schema (`scripts/cms-migration.sql`)

- ~30 tables, all created with `CREATE TABLE IF NOT EXISTS ...` for idempotency.
- Every content table uses `JSONB` for translatable fields.
- `supabase_realtime` publication is added in a `DO $$ ... EXCEPTION WHEN duplicate_object ...` block (idempotent across re-runs).
- Core tables:
  - `site_settings`, `header_nav_links`, `footer_content`
  - `hero_content`, `core_services`, `process_steps`
  - `why_choose_us_content`, `why_choose_us_benefits`
  - `about_page_content`, `about_stats`, `about_values`
  - `service_packages`, `testimonials`, `faq_entries`
  - `projects` (with `slug TEXT NOT NULL DEFAULT ''` for `/portfolio/[slug]` lookup)
  - `insights` (with `slug` for `/insights/[slug]` lookup)
  - `buy_business_niches`, `niche_stats`, `niche_inclusions`, `buy_business_brands`
  - `service_page_content` (per-service page sections)
  - `contact_form_config`, `section_labels`
  - `leads`, `lead_followups`, `email_log`, `llm_log`, `notify_subscribers`
  - `legal_pages`, `cms_migrations` (audit)

### 6.2 `useCms<T>(section, options?)` hook

`src/lib/use-cms.ts`:
- Looks up the section key in `SECTION_TO_TABLE` (whitelisted; 17 tables currently).
- Fetches once on mount via `getSupabase()` (anon key, public read).
- Subscribes to `postgres_changes` on that table via Supabase Realtime — re-fetches on any UPDATE/INSERT/DELETE.
- Returns `{ data, loading, error, refetch }`.
- Accepts `{ fallback: T }` so local dev (no env vars) still renders sensible defaults.
- All 17 whitelisted sections are also allow-listed in `src/app/api/cms/[section]/route.ts` (`ALLOWED_TABLES`).

### 6.3 The "fallback-first" pattern

Every public section component follows this pattern:
```ts
const { data: cmsRows } = useCms<Row[]>("table-key", { fallback: FALLBACK });
const rows = (cmsRows ?? FALLBACK).slice().sort((a, b) => a.sort_order - b.sort_order);
```
- `useCms` returns the fallback as the initial `data` so the first paint is always meaningful.
- When Supabase returns, the data is replaced.
- Sorting by `sort_order` ensures stable admin-controlled ordering.
- For detail pages (`/insights/[slug]`, `/portfolio/[slug]`, `/buy-business/niches/[niche]/[brand]`), the page server-component only resolves t

---

## 7. Services (4 productized offerings)

Each service has its own page, CMS section, and header entry.

| Slug | Title | Subtitle (default) |
|---|---|---|
| `brand-design` | Brand Design | Identity systems, logo, brand guidelines, packaging |
| `website-development` | Website Development | Next.js, React, TypeScript, Tailwind. Conversion-first |
| `ai-automation` | AI Automation | Chatbots, lead routing, internal AI tooling, Groq-powered |
| `growth-marketing` | Growth Marketing | SEO, paid ads, lifecycle, analytics, A/B |

- **Service page sections** are stored in `service_page_content.sections` (JSONB array of `{title, content, bullet_points, image_url}` per locale).
- **Service page CTAs** open the `ContactModal` pre-filled with the chosen service.
- **Homepage services** come from `core_services` filtered by `is_active` and ordered by `sort_order`.

---

## 8. Public Site

### 8.1 Homepage (`/`) — sections in order

1. `<Hero />` — eyebrow, headline, subhead, dual CTA, trusted-by logos, stat row, tech stack grid, amber glow
2. `<CoreServices />` — 4 cards (brand / web / AI / growth) with hover lift
3. `<Process />` — numbered steps from `process_steps`
4. `<WhyChooseUs />` — benefits + content from `why_choose_us_*`
5. `<ToolsIntegrations />` — tech stack
6. `<AIAutomationService />` — showcase block
7. `<WebsiteDevelopment />` — showcase block
8. `<BrandDesign />` — showcase block
9. `<GrowthMarketing />` — showcase block
10. `<Portfolio />` — project cards (slug, category, short_metric)
11. `<Testimonials />` — star ratings + quotes
12. `<Packages />` — 3 pricing tiers from `service_packages`
13. `<BuyBusinessSection />` — featured brands carousel
14. `<Insights />` — latest blog cards
15. `<FAQ />` — categorized Q&A
16. `<Contact />` — form, contact info, lead funnel

A `<ComingSoonGate>` may overlay the homepage on production until a visitor enters the gate password (`site_settings.gate_password`).

### 8.2 Other public pages

| Path | Source |
|---|---|
| `/about` | `about_page_content` + `about_stats` + `about_values` (useCms + hardcoded fallback) |
| `/services` | service hub |
| `/services/brand-design` | `service_page_content` (slug = `brand-design`) |
| `/services/website-development` | same |
| `/services/ai-automation` | same |
| `/services/growth-marketing` | same |
| `/insights` | list from `insights` where `is_published` |
| `/insights/[slug]` | client component fetches CMS row by slug, falls back to `data/insights` |
| `/portfolio` | list from `projects` where `is_active` |
| `/portfolio/[slug]` | client component fetches CMS row by slug, falls back to `data/projects` |
| `/testimonials` | full testimonial list |
| `/buy-business` | listing of niches + brand counts computed live |
| `/buy-business/niches/[niche]` | niche + brands + `niche_stats` + `niche_inclusions` |
| `/buy-business/niches/[niche]/[brand]` | single brand detail |
| `/contact` | contact form (also embedded in homepage) |
| `/privacy-policy`, `/terms-conditions`, `/cookie-policy` | `legal_pages` (slug match) |
| `/login` | admin sign-in |
| `/not-found` | 404 |
| `/cookie-policy` (handled) | consent popup + privacy page |

---

## 9. Admin Dashboard (`/admin/*`)

**Auth:** cookie-based HMAC-SHA-256 signed session (`stratifit_admin` cookie). Secret from `ADMIN_SESSION_SECRET` (or `SUPABASE_SERVICE_ROLE_KEY` as dev fallback). Login email + password in env. `AdminGuard` wraps every admin layout. `/admin/layout.tsx` injects `body.admin-active` class so the public header/footer/chatbot auto-hide.

**Pages (27 total):**

- `/admin` — Dashboard with stats
- `/admin/activity` — Activity log
- `/admin/analytics` — Charts
- `/admin/leads`, `/admin/leads/[id]` — Lead pipeline (notes, status, send email, delete-with-confirm)
- `/admin/email-log` — Every email send attempt (queued/sent/failed)
- `/admin/llm-log` — Every LLM call
- `/admin/subscriptions` — Notify subscribers
- `/admin/notifications` — Broadcast email composer
- `/admin/content`, `/admin/content/[section]` — CMS editor (per table, JSONB-aware)
- `/admin/faq`, `/admin/faq/[id]` — FAQ CRUD
- `/admin/bots/faq`, `/admin/bots/faq/[id]` — FAQ bot training
- `/admin/bots/coming-soon`, `/admin/bots/coming-soon/[id]` — Coming-soon bot training
- `/admin/testimonials` — CRUD
- `/admin/team` — Team CRUD
- `/admin/packages` — Service package CRUD
- `/admin/portfolio`, `/admin/portfolio/[slug]` — Project CRUD (slug, sort_order, 4-locale fields)
- `/admin/insights`, `/admin/insights/[slug]` — Insight CRUD
- `/admin/buy-business` — Niches + brands + niche_stats + niche_inclusions
- `/admin/services` — Service page content editor
- `/admin/settings` — Site settings, gate password, logo, contact info

**Sidebar (`src/components/admin/Sidebar.tsx`)** with `nav-config.ts` defines the order and grouping. **`AdminTopBar`** shows the active user + logout.

---

## 10. API Routes (`src/app/api/`)

| Route | Method | Purpose |
|---|---|---|
| `/api/admin/login` | POST | Sign in → sets `stratifit_admin` cookie |
| `/api/admin/session` | GET/DELETE | Check or clear session |
| `/api/cms/[section]` | GET/PUT/POST/DELETE | Generic CMS proxy (whitelisted tables) |
| `/api/notify` | POST | Public newsletter signup → Resend broadcast |
| `/api/leads/public` | POST | Public contact form (Turnstile + honeypot + rate-limit + dedupe) |
| `/api/leads` | GET/POST | Admin leads list / create |
| `/api/leads/[id]` | GET/PATCH/DELETE | Admin lead detail (notes, status, delete) |
| `/api/leads/[id]/email` | POST | Admin → send manual email to lead |
| `/api/leads/[id]/followups` | GET/POST | Admin → follow-up list + manual trigger |
| `/api/email-log` | GET | Admin → email send history |
| `/api/llm-log` | GET | Admin → LLM call history |
| `/api/cron/followups` | GET | Vercel cron → process due `lead_followups` (every 15 min) |
| `/api/chat/llm` | POST | Public chatbot endpoint (multi-prompt) |


---

## 11. Lead Pipeline (end-to-end)

1. Visitor submits the contact form on `/` or `/contact`.
2. **Browser:** Turnstile token + form payload.
3. **`/api/leads/public`** validates:
   - Turnstile token via Cloudflare siteverify
   - Honeypot field (empty + JS-disabled detection)
   - Per-IP rate limit (5 / 10 min)
   - Per-email dedupe (60s)
   - `Zod` server schema
4. **Insert** row into `leads` (status `new`, all 4-locale fields, IP, UA).
5. **Schedule** `lead_followups` row at `NOW + 1 hour` (template `lead_followup_checkin`).
6. **Send instant confirmation** via Resend (template `lead_confirmation`, 4-locale).
7. **Respond 201** to the browser.
8. **15 min later (cron)**: `/api/cron/followups` runs, claims due rows atomically, sends the 1h check-in email via Resend (template `lead_followup_checkin`, 4-locale).
9. **Admin** can view in `/admin/leads`, edit notes/status, send manual email, delete (with confirmation modal).
10. **All sends** write a row to `email_log` (`queued` → `sent`/`failed`) regardless of Resend status.

---

## 12. AI Chatbots (4 surfaces)

All run through `src/lib/chat-llm-client.ts` → Groq (`llama-3.3-70b-versatile` default) with a surface-specific system prompt:

| Surface | Component | Knowledge |
|---|---|---|
| Floating desktop | `DesktopChatbot` | Whole site + recent insights |
| Contact-form assist | `ContactChatbot` | Service picker, FAQ, redirects to form |
| FAQ page | `FaqAIChat` | `faq_entries` + static `static-faq.ts` |
| Coming-soon gate | `ComingSoonAIChat` | Teaser, lead capture |

All LLM calls are logged to `llm_log` (admin viewable at `/admin/llm-log`). Bot training is editable at `/admin/bots/coming-soon` and `/admin/bots/faq`.

---

## 13. Email System (`src/lib/email.ts`)

- **Provider:** Resend, lazy-initialized via `getResend()`.
- **`sendEmail(input)`** — generic sender. Writes a `queued` row to `email_log` first, then attempts the Resend call, then updates the row to `sent` (with Resend ID) or `failed` (with error).
- **Templates** (all 4-locale, placeholders `{{var}}`):
  - `lead_confirmation` — instant on contact-form submit
  - `lead_followup_checkin` — 1h after submit
  - `lead_followup_value` — 24h after
  - `lead_followup_final` — 72h after
  - `admin_notification` — internal alert on new lead
  - `notify_welcome` — newsletter signup welcome
  - `custom` — admin-composed broadcasts from `/admin/notifications`
- **`pickRequestLanguage(body.lang, Accept-Language)`** — chooses the right locale for the email, with `en` as the final fallback.
- **Graceful degradation:** if `RESEND_API_KEY` is missing, `sendEmail` still writes the `email_log` row so admins can see the attempt; nothing throws.

---

## 14. Security & Abuse Protection

- **Turnstile** on `/api/leads/public` (server-side verification).
- **Honeypot** field (HTML-hidden, JS-empty-required).
- **Per-IP rate limit** (5 requests / 10 min) on `/api/leads/public`.
- **Per-email dedupe** (60s) on `/api/leads/public`.
- **Admin session** cookie = HMAC-SHA-256 signed JSON `{email, role, exp}`.
- **Service-role key** is server-only; anon key for public reads only.
- **RLS** is intentionally permissive for the whitelisted CMS tables (admin-managed, public-read). The 5 PII tables (`leads`, `lead_followups`, `email_log`, `llm_log`, `notify_subscribers`) are never added to `supabase_realtime` publication.
- **Cron auth:** `Authorization: Bearer ${CRON_SECRET}` OR a valid admin cookie.


---

## 15. Deployment

- **Host:** Vercel.
- **Cron:** `vercel.json` schedules `*/15 * * * *` on `/api/cron/followups`.
- **Env (Vercel dashboard):**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RESEND_API_KEY`
  - `MAIL_FROM` (e.g., `Stratifit <hello@stratifit.com>`)
  - `GROQ_API_KEY`
  - `GROQ_MODEL` (default `llama-3.3-70b-versatile`)
  - `ADMIN_SESSION_SECRET` (preferred; falls back to service-role key in dev)
  - `ADMIN_EMAIL`, `ADMIN_PASSWORD`
  - `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
  - `CRON_SECRET`
  - `AI_FALLBACK_TO_LLM` (optional)
- **Smoke test:** `bash scripts/smoke-test.sh https://<vercel-url>` validates 4 phases: cron dispatch, realtime propagation (manual), public contact ingest, admin viewer reachability.

---

## 16. Common Patterns & Conventions

### 16.1 `useCms` everywhere

```ts
const { data: rows, loading } = useCms<Row[]>("table_key", { fallback: FALLBACK_ROWS });
```

### 16.2 Translatable field editor (admin)

```ts
const [draft, setDraft] = useState<Row>({...emptyRow, title: { en: "", de: "", fr: "", es: "" }});
const setStringField = (field: string, lang: LangCode, value: string) =>
  setDraft((d) => ({ ...d, [field]: { ...(d[field] ?? {en:"",de:"",fr:"",es:""}), [lang]: value } }));
const setArrayField = (field: string, lang: LangCode, raw: string) =>
  setDraft((d) => ({ ...d, [field]: { ...(d[field] ?? {en:[],de:[],fr:[],es:[]}), [lang]: raw.split("\n").map(s => s.trim()).filter(Boolean) } }));
```

### 16.3 Slug generation

- `slugify()` from `src/lib/slugify.ts`.
- Admin forms: `slug = draft.slug.trim() || slugify(pickLocalized(draft.title, "en")) || "untitled"`.

### 16.4 Static fallback imports

Detail pages keep top-level imports of static arrays as a fallback:
```ts
import { insights as fallbackInsights } from "@/data/insights";
import { projects as fallbackProjects } from "@/data/projects";
```
This is a graceful degradation for local dev with no Supabase.

### 16.5 API error shape

All API routes respond with `{ ok: boolean, error?: string, data?: any }` for consistent client handling.

### 16.6 Commit message convention

Conventional commits with scope:
- `feat(cms): ...` — new CMS wiring
- `fix(admin): ...` — admin UI fix
- `fix(lint): ...` — lint cleanup
- `chore(smoke-test): ...` — tooling
- `feat(leads): ...` — lead pipeline

### 16.7 No `require()` in client components

Always use top-level `import` for static fallbacks. Tree-shake-friendly and bundler-safe.

### 16.8 Apostrophe escaping in JSX

Use `&apos;` or `{"’"}` in JSX text. Lint rule `react/no-unescaped-entities` is enforced.

---

## 17. Project Evolution (git log highlights)

The repository follows a feature-by-feature rollout:

1. **Foundation** — Next.js 16 scaffold, Tailwind v4 tokens, dark theme, Framer Motion, smooth scroll, Lenis.
2. **i18n layer** — LanguageContext, `tLabel()`, 4-locale static labels.
3. **Marketing site** — Hero, Services, Process, Why-Choose-Us, Tools, Portfolio, Testimonials, Packages, FAQ, Insights, Contact, Footer, Header, Cookie popup, Coming-soon gate.
4. **CMS** — `cms-migration.sql` (30 tables), `useCms` hook, Realtime wiring, admin dashboard skeleton.
5. **Admin auth** — HMAC cookies, login page, AdminGuard, body class hook for layout.
6. **CMS editor** — generic per-table editor with JSONB-aware form fields, per-language textareas.
7. **Lead pipeline (F1)** — Turnstile + honeypot + rate limit + dedupe + Resend + cron follow-ups + email_log.
8. **Lead admin** — list, detail, notes, status, send-email modal, delete with confirmation.
9. **Lead email templates** — 4-locale confirmation + 3 follow-up templates + admin notification.
10. **AI chatbots** — 4 surfaces, multi-prompt system, LLM logging.
11. **Buy-business marketplace** — niches, brands, niche_stats, niche_inclusions, deterministic accent/icon helpers, full admin CRUD.
12. **Detail-page Supabase wiring** — `/insights/[slug]`, `/portfolio/[slug]`, `/buy-business/*`, `/about` all fetch by slug from CMS with static fallback.
13. **Admin portfolio rewrite** — `/admin/portfolio` form aligned to `ProjectItem` schema; `projects.slug` column added.
14. **Lint & placeholder cleanup** — `{{var}}` lens labels stripped across 10 dashboard pages, 7 pre-existing ESLint errors resolved.

A full history is available via `git log --oneline`.

---

## 18. Design Principles (the "Stratifit way")

1. **No light mode.** Black + amber, full stop. The brand is the contrast.
2. **One accent.** Amber is sacred — used for CTAs, eyebrows, highlights, focus, hover borders. Never used for body text.
3. **Cinematic motion.** Every entrance has a motion. Every section has a glow. Every number counts up.
4. **Typography is the hero.** Massive black headings, generous letter-spacing on eyebrows, Inter for clarity.
5. **Self-service for the team.** The marketing site is editable from `/admin/*` without a deploy. Realtime makes edits visible in <2s.
6. **Multilingual by default.** Every user-facing string is in 4 languages or it's a bug.
7. **Observability first.** Every email send, every LLM call, every lead is logged. The dashboard surfaces funnel health at a glance.
8. **Graceful degradation.** Missing env vars? Static fallback renders. Missing Resend key? Email still logs. Missing Supabase? Static data still works. The site never goes blank.

---

## 19. Quick Reference — Common Tasks

| Task | Where |
|---|---|
| Add a new CMS section | New row in `cms-migration.sql`, add to `SECTION_TO_TABLE` in `use-cms.ts`, add to `ALLOWED_TABLES` in `api/cms/[section]/route.ts`, add to `content-editor-config.tsx` |
| Add a new email template | New entry in `EMAIL_TEMPLATES` (`src/lib/email.ts`), 4-locale body with `{{var}}` placeholders, helper function `send<Name>(input)` |
| Add a new page | New file in `src/app/<path>/page.tsx`, optional `[slug]/page.tsx` for dynamic |
| Add a new admin page | New file in `src/app/admin/<path>/page.tsx`, wrap in `<AdminGuard>`, add to `nav-config.ts` |
| Add a new AI bot | New component in `src/components/chat/`, new system prompt in `src/lib/llm.ts`, log via `llm_log` |
| Tweak a color | Edit `globals.css` `@theme inline` block |
| Tweak typography | Edit `globals.css` font tokens + `layout.tsx` `next/font` config |
| Add a new locale | Update `Language` type, `ALL_LANGUAGES`, `LANGUAGE_LABELS`, `LANGUAGE_FLAGS` in `cms-types.ts`; populate TranslatableString/Array in seed |
| Add a new service | New row in `service_page_content`, new entry in `core_services`, new header nav link |
| Add a new lead follow-up template | New entry in `EMAIL_TEMPLATES`, schedule `lead_followups` row with new template name |

---

## 20. Operational Health Checklist

Run these weekly:

- [ ] `/admin/leads` — new leads arriving, status updates happening
- [ ] `/admin/email-log` — confirmation + follow-up emails `sent` (not `failed`)
- [ ] `/admin/llm-log` — bot usage trending, no 5xx storms
- [ ] `/admin/subscriptions` — newsletter signups accumulating
- [ ] Supabase Realtime — admin edits visible on public site in <2s
- [ ] Vercel cron — `/api/cron/followups` firing every 15 min (check function logs)
- [ ] `scripts/smoke-test.sh <url>` — all 4 phases pass

---

**End of file.** This document is the canonical onboarding artifact. Keep it in sync when architecture changes.
