# Stratifit — Post-deploy Verification Guide

> Companion to `docs/AUDIT.md`. Read that first for the per-requirement verdict; this doc is the **recipe you run after pushing to Vercel** to confirm reality matches the audit.

## 1. Pre-flight

1. **Push commit `676ac81` to `main`** (already done if you shipped Phase 5).
2. **Vercel Project Settings -> Environment Variables**. Set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` (64-char hex)
   - `RESEND_API_KEY`, `MAIL_FROM`
   - `GROQ_API_KEY`, `GROQ_MODEL` (=`llama-3.3-70b-versatile`), `AI_FALLBACK_TO_LLM=true`
   - `CRON_SECRET` (64-char hex)
3. **Apply the Supabase migration**. In the Supabase SQL editor, paste `scripts/cms-migration.sql` (29 tables + Realtime publication + seed). Confirm: 29 tables exist, 2 rows in `leads`, 2 rows in `lead_followups`.
4. **Wait for Vercel cron to register** — Vercel project -> Settings -> Crons. The `*/15 * * * *` entry points at `/api/cron/followups`. Takes ~1 minute after first deploy.

## 2. Run the smoke-test script

```
BASE_URL=https://stratifit.com ./scripts/smoke-test.sh
```

The script runs **4 checks** mirroring the audit's outstanding items.

### Check 1 — Cron dispatch + Resend pipeline

- **What it does**: `POST /api/cron/followups` with `Authorization: Bearer $CRON_SECRET`.
- **Expected response**: HTTP 200, JSON body `{ processed, sent, failed, errors, remainingDue, limit, ranAt }`.
- **Pass criteria**: `sent >= 0` (zero is fine if no follow-ups are due; non-zero proves Resend dispatched). Email arrives at the recipient listed in `email_log` rows.
- **If FAIL**: check (a) `CRON_SECRET` matches env on Vercel, (b) the seed follow-ups in `lead_followups` have `scheduled_for <= NOW()` (the seed runs `NOW() + INTERVAL '2 hours'` so run smoke-test ~2 hours after migrate), (c) `RESEND_API_KEY` and `MAIL_FROM` are set, (d) the Resend sender domain is verified.

### Check 2 — Realtime propagation (manual)

- **What it does**: 2-tab browser test (no curl-equivalent; WebSocket subscription).
- **How to run**:
  1. Tab A: log in at `/admin`, navigate to `/admin/content`, edit the **hero** section. Change `heading_line1.en` to `Smoke Test {timestamp}` and click Save.
  2. Tab B: open `/` on the public site, in the **same browser** (cookies for Supabase Realtime are scoped per-domain).
  3. Within ~1 second the headline should change to your new copy **without a refresh**.
- **Pass criteria**: Visible refresh in <1s. **No console errors** like `Realtime subscription CLOSED` or `permission denied for table`.
- **If FAIL**: open browser DevTools -> Console. Common causes:
  - The `supabase_realtime` publication was not added (Phase 4 migration block). Check in Supabase with `SELECT * FROM pg_publication_tables WHERE pubname='supabase_realtime'` — should list 24 CMS tables.
  - The Realtime publication includes PII (regression). It should NOT include `notify_subscribers`, `email_log`, `llm_log`, `leads`, `lead_followups`.
  - The anon key used by the browser is wrong (RLS strict). Confirm `NEXT_PUBLIC_SUPABASE_ANON_KEY` matches the Supabase project's anon key (not service role).

### Check 3 — Contact form submission (manual)

> **Warning:** `ContactModal.tsx` currently sets `submitted=true` locally and renders the success card. It does **NOT** POST to a backend. This is **F1 in the audit** (`Outstanding non-blocking follow-ups`). The smoke test below verifies the UI today; persisting leads to the `leads` table ships with F1.

- **How to run**:
  1. Open `/contact`, fill Name + Email + Company + a message, click **Send Message**.
  2. The success card ("Message Sent!") should render.
- **Pass criteria today**: success card appears within ~300ms; modal closes after the back arrow.
- **After F1 lands**: row appears in `leads` table + a `lead_followups` row scheduled for `NOW() + 1 hour` + Resend welcome email arrives.

### Check 4 — Admin viewer reachability

- **What it does**: `GET /admin/email-log`, `/admin/llm-log`, `/admin/leads` with the session cookie from the smoke-test script's login.
- **Expected response**:
  - **200**: page renders. `/admin/leads` should show the 2 seed rows (Ada + Grace).
  - **307**: redirect to `/login` (cookie expired / not present). To fix: re-login with `ADMIN_EMAIL` + `ADMIN_PASSWORD` payload to `/api/admin/login`.
- **Pass criteria**: each route returns 200 OR a 307 redirect to `/login`. A 200 means the cookie was accepted.
- **If FAIL with 500**: check Supabase RLS errors. Confirm that the called tables (`email_log`, `llm_log`, `leads`) have RLS disabled or a permissive policy. Currently no RLS is set up — `getSupabaseAdmin()` uses the service role key which bypasses RLS, so 500s here are usually schema-shaped.

## 3. Verify the admin viewers independently

1. Open `/admin/email-log` in a browser (after logging in).
2. After Check 1 above, this view should show >=1 row with `status='sent'` (or `'failed'` if Resend was not configured when Check 1 ran).
3. Open `/admin/leads`. Confirm the 2 seed rows (Ada Lovelace + Grace Hopper) and their follow-up counts.
4. Click into each lead. The follow-up list under the right column should show 1 scheduling row each with timestamps from the seed.

## 4. Interpreting a failed check

| Symptom                                              | Most likely cause                                                                                |
|------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| Check 1: 401 "Unauthorized — admin login required"   | Script did not curl `/api/admin/login` before the call. Cron auth also accepts the admin cookie. |
| Check 1: 503 "Supabase not configured"                | `SUPABASE_*` env missing on Vercel. Re-add.                                                       |
| Check 1: `sent=0` and `processed=0`                   | Seed follow-ups' `scheduled_for` still in the future. Wait `2 hours` or update the seed.        |
| Check 2: tab B never updates                          | Migration block ran but publication missing. Re-run sql block migration. Confirm with the SQL query above. |
| Check 2: console warns Realtime CLOSED                | Anon key missing or `section` not in the `SECTION_TO_TABLE` map inside `use-cms.ts`.              |
| Check 4: 500 on every admin viewer                    | Service-role key missing or wrong project. Check Vercel function logs.                            |

## 5. Full system outcome

If all 4 checks PASS:

- Resend pipeline dispatches cron-driven follow-ups to recipients and writes an audit row.
- Supabase Realtime pushes admin CMS edits to public visitors in <1s with no console warnings.
- Contact modal closes on submit; lead persistence is documented as F1 (ship separately).
- Admin viewers authenticate via signed cookie and render seeded rows.

The system matches `docs/AUDIT.md`.

## 6. If something is broken

1. Check Vercel Function Logs (Project -> Logs) for the failing route. The `console.warn` lines from Phase 1 + 2 + 4 are the canonical signal.
2. Hit `/api/leads` to see what the cron would do (admin-only).
3. If a specific chatbot is failing: `/admin/llm-log` shows every LLM call with `chatbot`, `status`, `error` columns.

## 7. Recipe versioning

This doc captures the verification recipe for the system as of commit **`676ac81`**. When you ship F1 (public `/api/leads`), or Phase 3 follow-up retry strategy, or move to RLS-protected tables, update this doc alongside the audit.
