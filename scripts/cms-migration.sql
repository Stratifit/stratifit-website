-- Stratifit CMS — Full Supabase Migration
-- Run this once in the Supabase SQL editor. It creates all 24 tables
-- used by the /api/cms/[section] route + admin/content editor.

/* ============================================================
   ARCHITECTURAL DOC (maintained for Phase 5)

   Schema naming rationale:
     The codebase uses GRANULAR, PER-SECTION table names
     (e.g. `hero_content`, `about_page_content`,
      `buy_business_niches`) rather than:
       (a) a single generic `cms_sections` table with JSONB
           payloads — rejected: loses FK integrity, type
           safety, and per-section indexing,
       (b) a `website_*` prefix (e.g. `website_hero_content`) —
           rejected: redundant with the schema being
           stratifit-specific.

     Each table mirrors one CMS editor section in
     src/lib/content-editor-config.tsx (see the
     `sectionEditorConfigs[<key>].table` mapping) so the
     editor and the read path always speak to a known shape.

   Table families:
     1. CMS content tables (24, all in `supabase_realtime`):
        site_settings, header_nav_links, footer_content,
        hero_content, core_services, service_page_content,
        process_steps, why_choose_us_content,
        why_choose_us_benefits, about_page_content,
        about_stats, about_values, service_packages,
        testimonials, faq_entries, projects, insights,
        buy_business_niches, niche_stats, niche_inclusions,
        buy_business_brands, legal_pages, contact_form_config,
        section_labels.
     2. Operational / PII tables (5, NEVER in the realtime
        publication):
        notify_subscribers (email-list subscribes),
        email_log (Resend recipient + subject + body),
        llm_log (chat queries + responses),
        leads (name + email + project notes),
        lead_followups (queued admin emails).

   Lineage (audit trail):
     Phase 1 — added email_log + Resend pipeline.
     Phase 2 — added llm_log + Groq AI brain.
     Phase 3 — added leads + lead_followups + Vercel cron.
     Phase 4 — added `supabase_realtime` publication on the
               24 public CMS tables.
     Phase 5 — pure cleanup pass: docs only, no schema
               changes from this migration; edits are in
               src/components and docs/.
   ============================================================ */

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/* ============================================================
   1.  site_settings (single row)
   ============================================================ */
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name JSONB NOT NULL DEFAULT '{"en":"Stratifit","de":"Stratifit","fr":"Stratifit","es":"Stratifit"}',
  site_tagline JSONB NOT NULL DEFAULT '{"en":"Digital Excellence","de":"Digitale Exzellenz","fr":"Excellence Numérique","es":"Excelencia Digital"}',
  logo_text TEXT NOT NULL DEFAULT 'SF',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO site_settings (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;

/* ============================================================
   2.  header_nav_links (list)
   ============================================================ */
CREATE TABLE IF NOT EXISTS header_nav_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sort_order INT NOT NULL DEFAULT 0,
  label JSONB NOT NULL DEFAULT '{}',
  href TEXT NOT NULL DEFAULT '#',
  action TEXT,
  is_cta BOOLEAN DEFAULT FALSE,
  cta_text JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE
);

/* Seed: add Buy a Business to the nav (idempotent; only inserts if no
   row with href = '/buy-business' already exists). Sits between About
   and Contact at sort_order 5. If the user already has another row at
   sort_order 5, reorder via /admin/content after running.
   To add this single row without re-running the full migration, run
   scripts/seed-buy-business-nav.sql in the Supabase SQL editor.

   NOTE: As of 2026, Buy a Business was removed from the header nav per
   product request. The /buy-business page itself still exists. This
   block is left in the migration for reference / easy re-adding. To
   re-enable the nav link, uncomment the INSERT below and run
   scripts/seed-buy-business-nav.sql. */
/* INSERT INTO header_nav_links (sort_order, label, href, is_cta, cta_text)
SELECT 5,
       '{"en":"Buy a Business","de":"Unternehmen kaufen","fr":"Acheter une entreprise","es":"Comprar un negocio"}'::jsonb,
       '/buy-business',
       FALSE,
       '{}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM header_nav_links WHERE href = '/buy-business'
); */

/* ============================================================
   3.  footer_content (single row; columns + social_links as JSONB)
   ============================================================ */
CREATE TABLE IF NOT EXISTS footer_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tagline JSONB NOT NULL DEFAULT '{}',
  columns JSONB NOT NULL DEFAULT '[]',
  social_links JSONB NOT NULL DEFAULT '[]'
);
INSERT INTO footer_content (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;

/* ============================================================
   4.  hero_content (single row)
   ============================================================ */
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  badge_text JSONB NOT NULL DEFAULT '{}',
  heading_line1 JSONB NOT NULL DEFAULT '{}',
  heading_line2 JSONB NOT NULL DEFAULT '{}',
  subheading JSONB NOT NULL DEFAULT '{}',
  cta_primary JSONB NOT NULL DEFAULT '{}',
  cta_secondary JSONB NOT NULL DEFAULT '{}',
  trusted_by_label JSONB NOT NULL DEFAULT '{}',
  trusted_companies JSONB NOT NULL DEFAULT '[]',
  stats JSONB NOT NULL DEFAULT '[]',
  tech_stack_label_prefix JSONB NOT NULL DEFAULT '{}',
  tech_stack_highlight JSONB NOT NULL DEFAULT '{}',
  tech_stack_label_suffix JSONB NOT NULL DEFAULT '{}',
  tech_stack_subtitle JSONB NOT NULL DEFAULT '{}',
  tech_stack_items JSONB NOT NULL DEFAULT '[]'
);
INSERT INTO hero_content (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;

/* ============================================================
   5.  core_services (list)
   ============================================================ */
CREATE TABLE IF NOT EXISTS core_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sort_order INT NOT NULL DEFAULT 0,
  icon TEXT NOT NULL DEFAULT 'MdDiamond',
  title JSONB NOT NULL DEFAULT '{}',
  description JSONB NOT NULL DEFAULT '{}',
  deliverables JSONB NOT NULL DEFAULT '{}',
  href TEXT NOT NULL DEFAULT '#',
  cta_text JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE
);

/* ============================================================
   6.  service_page_content (single per slug — brand-design, website-dev, ai-auto, growth-marketing)
   ============================================================ */
CREATE TABLE IF NOT EXISTS service_page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  hero_title JSONB NOT NULL DEFAULT '{}',
  hero_subtitle JSONB NOT NULL DEFAULT '{}',
  sections JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

/* ============================================================
   7.  process_steps (list)
   ============================================================ */
CREATE TABLE IF NOT EXISTS process_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  step_number INT NOT NULL DEFAULT 1,
  icon TEXT NOT NULL DEFAULT 'HiMagnifyingGlass',
  title JSONB NOT NULL DEFAULT '{}',
  description JSONB NOT NULL DEFAULT '{}'
);

/* ============================================================
   8.  why_choose_us_content (single row — section heading)
   ============================================================ */
CREATE TABLE IF NOT EXISTS why_choose_us_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_label JSONB NOT NULL DEFAULT '{}',
  section_title_prefix JSONB NOT NULL DEFAULT '{}',
  section_title_highlight JSONB NOT NULL DEFAULT '{}',
  section_title_suffix JSONB NOT NULL DEFAULT '{}',
  section_subtitle JSONB NOT NULL DEFAULT '{}'
);
INSERT INTO why_choose_us_content (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;

/* ============================================================
   9.  why_choose_us_benefits (list)
   ============================================================ */
CREATE TABLE IF NOT EXISTS why_choose_us_benefits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sort_order INT NOT NULL DEFAULT 0,
  icon TEXT NOT NULL DEFAULT 'HiShieldCheck',
  title JSONB NOT NULL DEFAULT '{}',
  description JSONB NOT NULL DEFAULT '{}',
  stat JSONB NOT NULL DEFAULT '{}',
  stat_label JSONB NOT NULL DEFAULT '{}'
);

/* ============================================================
   10. about_page_content (single row)
   ============================================================ */
CREATE TABLE IF NOT EXISTS about_page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_title_prefix JSONB NOT NULL DEFAULT '{}',
  hero_title_highlight JSONB NOT NULL DEFAULT '{}',
  hero_subtitle JSONB NOT NULL DEFAULT '{}',
  mission_text JSONB NOT NULL DEFAULT '{}',
  story_text JSONB NOT NULL DEFAULT '{}',
  team_text JSONB NOT NULL DEFAULT '{}',
  cta_title_prefix JSONB NOT NULL DEFAULT '{}',
  cta_title_highlight JSONB NOT NULL DEFAULT '{}',
  cta_subtitle JSONB NOT NULL DEFAULT '{}',
  cta_button_text JSONB NOT NULL DEFAULT '{}'
);
INSERT INTO about_page_content (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;

/* ============================================================
   11. about_stats (list)
   ============================================================ */
CREATE TABLE IF NOT EXISTS about_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sort_order INT NOT NULL DEFAULT 0,
  icon TEXT NOT NULL DEFAULT 'HiStar',
  stat TEXT NOT NULL DEFAULT '',
  label JSONB NOT NULL DEFAULT '{}'
);

/* ============================================================
   12. about_values (list)
   ============================================================ */
CREATE TABLE IF NOT EXISTS about_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sort_order INT NOT NULL DEFAULT 0,
  icon TEXT NOT NULL DEFAULT 'HiCube',
  title JSONB NOT NULL DEFAULT '{}',
  description JSONB NOT NULL DEFAULT '{}'
);

/* ============================================================
   13. service_packages (list)
   ============================================================ */
CREATE TABLE IF NOT EXISTS service_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sort_order INT NOT NULL DEFAULT 0,
  name JSONB NOT NULL DEFAULT '{}',
  price JSONB NOT NULL DEFAULT '{}',
  period JSONB NOT NULL DEFAULT '{}',
  description JSONB NOT NULL DEFAULT '{}',
  features JSONB NOT NULL DEFAULT '{}',
  cta_text JSONB NOT NULL DEFAULT '{}',
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE
);

/* ============================================================
   14. testimonials (list)
   ============================================================ */
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sort_order INT NOT NULL DEFAULT 0,
  name TEXT NOT NULL DEFAULT '',
  role JSONB NOT NULL DEFAULT '{}',
  initials TEXT NOT NULL DEFAULT '',
  rating INT NOT NULL DEFAULT 5,
  text JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE
);

/* ============================================================
   15. faq_entries (list)
   ============================================================ */
CREATE TABLE IF NOT EXISTS faq_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sort_order INT NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'general',
  question JSONB NOT NULL DEFAULT '{}',
  answer JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE
);

/* ============================================================
   16. projects (list — portfolio case studies)
   ============================================================ */
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sort_order INT NOT NULL DEFAULT 0,
  title JSONB NOT NULL DEFAULT '{}',
  category TEXT NOT NULL DEFAULT '',
  description JSONB NOT NULL DEFAULT '{}',
  image TEXT NOT NULL DEFAULT '',
  tags JSONB NOT NULL DEFAULT '{}',
  challenge JSONB NOT NULL DEFAULT '{}',
  solution JSONB NOT NULL DEFAULT '{}',
  results JSONB NOT NULL DEFAULT '{}',
  short_metric TEXT NOT NULL DEFAULT '',
  short_label JSONB NOT NULL DEFAULT '{}',
  client TEXT NOT NULL DEFAULT '',
  industry TEXT NOT NULL DEFAULT '',
  timeline TEXT NOT NULL DEFAULT '',
  services JSONB NOT NULL DEFAULT '{}',
  gallery JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE
);

/* ============================================================
   17. insights (list — blog posts)
   ============================================================ */
CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sort_order INT NOT NULL DEFAULT 0,
  slug TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  title JSONB NOT NULL DEFAULT '{}',
  excerpt JSONB NOT NULL DEFAULT '{}',
  image TEXT NOT NULL DEFAULT '',
  read_time TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  content JSONB NOT NULL DEFAULT '{}',
  is_published BOOLEAN DEFAULT TRUE
);

/* ============================================================
   18. buy_business_niches (list)
   ============================================================ */
CREATE TABLE IF NOT EXISTS buy_business_niches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sort_order INT NOT NULL DEFAULT 0,
  slug TEXT NOT NULL DEFAULT '',
  title JSONB NOT NULL DEFAULT '{}',
  description JSONB NOT NULL DEFAULT '{}',
  hero_description JSONB NOT NULL DEFAULT '{}',
  image TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE
);

/* ============================================================
   19. niche_stats (list — keyed to a niche)
   ============================================================ */
CREATE TABLE IF NOT EXISTS niche_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  niche_id UUID NOT NULL REFERENCES buy_business_niches(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  stat TEXT NOT NULL DEFAULT '',
  label JSONB NOT NULL DEFAULT '{}',
  sub JSONB NOT NULL DEFAULT '{}'
);

/* ============================================================
   20. niche_inclusions (list — keyed to a niche, "what's included" bullets)
   ============================================================ */
CREATE TABLE IF NOT EXISTS niche_inclusions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  niche_id UUID NOT NULL REFERENCES buy_business_niches(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  text JSONB NOT NULL DEFAULT '{}'
);

/* ============================================================
   21. buy_business_brands (list — keyed to a niche)
   ============================================================ */
CREATE TABLE IF NOT EXISTS buy_business_brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  niche_id UUID NOT NULL REFERENCES buy_business_niches(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  slug TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  revenue TEXT NOT NULL DEFAULT '',
  profit TEXT NOT NULL DEFAULT '',
  description JSONB NOT NULL DEFAULT '{}',
  image TEXT NOT NULL DEFAULT '',
  website_url TEXT NOT NULL DEFAULT '',
  logo TEXT NOT NULL DEFAULT '',
  tags JSONB NOT NULL DEFAULT '{}',
  highlights JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE
);

/* ============================================================
   22. legal_pages (list — privacy/terms/cookies)
   ============================================================ */
CREATE TABLE IF NOT EXISTS legal_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL DEFAULT '',
  title JSONB NOT NULL DEFAULT '{}',
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

/* ============================================================
   23. contact_form_config (single row)
   ============================================================ */
CREATE TABLE IF NOT EXISTS contact_form_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  heading JSONB NOT NULL DEFAULT '{}',
  subheading JSONB NOT NULL DEFAULT '{}',
  success_title JSONB NOT NULL DEFAULT '{}',
  success_message JSONB NOT NULL DEFAULT '{}',
  services_list JSONB NOT NULL DEFAULT '{}',
  budget_ranges JSONB NOT NULL DEFAULT '[]'
);
INSERT INTO contact_form_config (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;

/* ============================================================
   24. notify_subscribers (list — "Notify When It's Live" emails)
   ============================================================ */
CREATE TABLE IF NOT EXISTS notify_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'subscribed',
  source TEXT DEFAULT 'coming_soon_page',
  lang TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS notify_subscribers_created_at_idx
  ON notify_subscribers(created_at DESC);

/* ============================================================
   25. section_labels (single row — overrides for every section heading)
   ============================================================ */
CREATE TABLE IF NOT EXISTS section_labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  services_label JSONB NOT NULL DEFAULT '{}',
  services_title_prefix JSONB NOT NULL DEFAULT '{}',
  services_title_highlight JSONB NOT NULL DEFAULT '{}',
  services_subtitle JSONB NOT NULL DEFAULT '{}',
  process_label JSONB NOT NULL DEFAULT '{}',
  process_title_prefix JSONB NOT NULL DEFAULT '{}',
  process_title_highlight JSONB NOT NULL DEFAULT '{}',
  process_subtitle JSONB NOT NULL DEFAULT '{}',
  pricing_label JSONB NOT NULL DEFAULT '{}',
  pricing_title_prefix JSONB NOT NULL DEFAULT '{}',
  pricing_title_highlight JSONB NOT NULL DEFAULT '{}',
  pricing_subtitle JSONB NOT NULL DEFAULT '{}',
  portfolio_label JSONB NOT NULL DEFAULT '{}',
  portfolio_title_prefix JSONB NOT NULL DEFAULT '{}',
  portfolio_title_highlight JSONB NOT NULL DEFAULT '{}',
  portfolio_subtitle JSONB NOT NULL DEFAULT '{}',
  testimonials_label JSONB NOT NULL DEFAULT '{}',
  testimonials_title_prefix JSONB NOT NULL DEFAULT '{}',
  testimonials_title_highlight JSONB NOT NULL DEFAULT '{}',
  testimonials_subtitle JSONB NOT NULL DEFAULT '{}',
  insights_label JSONB NOT NULL DEFAULT '{}',
  insights_title_prefix JSONB NOT NULL DEFAULT '{}',
  insights_title_highlight JSONB NOT NULL DEFAULT '{}',
  insights_subtitle JSONB NOT NULL DEFAULT '{}',
  faq_label JSONB NOT NULL DEFAULT '{}',
  faq_title_prefix JSONB NOT NULL DEFAULT '{}',
  faq_title_highlight JSONB NOT NULL DEFAULT '{}',
  faq_subtitle JSONB NOT NULL DEFAULT '{}',
  contact_label JSONB NOT NULL DEFAULT '{}',
  contact_title_prefix JSONB NOT NULL DEFAULT '{}',
  contact_title_highlight JSONB NOT NULL DEFAULT '{}',
  contact_subtitle JSONB NOT NULL DEFAULT '{}'
);
INSERT INTO section_labels (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;

/* ============================================================
   26. email_log (list — Resend send audit trail)
   Append-only history of every transactional email sent by the
   app. status transitions queued -> sent | failed. Used by the
   /admin/email-log viewer. Indexes by created_at DESC (most
   recent first) and by status (for filtering dashboards).
   ============================================================ */
CREATE TABLE IF NOT EXISTS email_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  template_name TEXT NOT NULL DEFAULT 'unknown',
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'sent', 'failed')),
  resend_id TEXT,
  error TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  related_subscriber_id UUID REFERENCES notify_subscribers(id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS email_log_created_at_idx
  ON email_log(created_at DESC);
CREATE INDEX IF NOT EXISTS email_log_status_idx
  ON email_log(status);
CREATE INDEX IF NOT EXISTS email_log_template_idx
  ON email_log(template_name);

/* ============================================================
   27. llm_log (list — Groq chat-completion audit trail)
   Append-only history of every LLM call from any chatbot.
   status transitions: no_api_key | rate_limited | empty_response
                       | timeout | error | ok | disabled
   Indexes by created_at DESC (most recent first) + status + chatbot
   so the admin viewer and rate-limit guardrail both read cheaply.
   ============================================================ */
CREATE TABLE IF NOT EXISTS llm_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chatbot TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en',
  query TEXT NOT NULL,
  response TEXT,
  model TEXT NOT NULL,
  tokens_in INTEGER,
  tokens_out INTEGER,
  latency_ms INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ok'
    CHECK (status IN ('ok','no_api_key','rate_limited','empty_response','timeout','error','disabled')),
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS llm_log_created_at_idx
  ON llm_log(created_at DESC);
CREATE INDEX IF NOT EXISTS llm_log_status_idx
  ON llm_log(status);CREATE INDEX IF NOT EXISTS llm_log_chatbot_idx
  ON llm_log(chatbot);

/* ============================================================
   28. leads (list — captured leads)
   Lifecycle status = 'new' | 'qualified' | 'in-review' | 'won' | 'lost'.
   NOT used by the cron directly — cron reads lead_followups (below).
   ============================================================ */
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  service TEXT DEFAULT '',
  source TEXT DEFAULT 'admin_manual',
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','qualified','in-review','won','lost')),
  budget TEXT DEFAULT '',
  lang TEXT DEFAULT 'en',
  metadata JSONB NOT NULL DEFAULT '{}',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS leads_status_idx
  ON leads(status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx
  ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_email_idx
  ON leads(email);

/* ============================================================
   29. lead_followups (list — scheduled outbound emails per lead)
   Cron reads WHERE status='scheduled' AND scheduled_for <= NOW(),
   atomically claims rows by flipping status='processing', dispatches
   Resend, then flips to 'completed' or 'failed'. This is the actual
   table the Phase 3 cron operates on.
   ============================================================ */
CREATE TABLE IF NOT EXISTS lead_followups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  topic TEXT NOT NULL DEFAULT 'Check-in',
  -- which email template to render
  template TEXT NOT NULL DEFAULT 'lead_followup_checkin'
    CHECK (template IN (
      'lead_followup_checkin',
      'lead_followup_welcome',
      'lead_followup_proposal',
      'lead_followup_thanks'
    )),
  lang TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled','processing','completed','failed','cancelled')),
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  email_log_id UUID,
  -- who/what scheduled it (admin email, 'contact_form', 'import', etc.)
  scheduled_by TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Cron hot path: "find rows ready to fire that no one is currently working on"
CREATE INDEX IF NOT EXISTS lead_followups_due_idx
  ON lead_followups(status, scheduled_for)
  WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS lead_followups_lead_idx
  ON lead_followups(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS lead_followups_status_idx
  ON lead_followups(status);

/* ============================================================
   Seed data — 2 leads + 2 follow-ups so the admin viewer shows
   something on first run. Safe to re-run (no-op if rows exist).
   ============================================================ */
DO $$
DECLARE
  s1_id UUID;
  s2_id UUID;
  f1_id UUID;
  f2_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM leads WHERE email = 'ada@stratifit-seed.com') THEN
    INSERT INTO leads (name, email, service, source, status, budget, lang, notes)
    VALUES ('Ada Lovelace (seed)', 'ada@stratifit-seed.com', 'Brand Design', 'seed', 'qualified', '$3,000 – $5,000', 'en', 'Seed lead so the admin viewer shows something on first run.')
    RETURNING id INTO s1_id;
  ELSE
    SELECT id INTO s1_id FROM leads WHERE email = 'ada@stratifit-seed.com';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM leads WHERE email = 'grace@stratifit-seed.com') THEN
    INSERT INTO leads (name, email, service, source, status, budget, lang, notes)
    VALUES ('Grace Hopper (seed)', 'grace@stratifit-seed.com', 'AI Automation', 'seed', 'new', '$5,000 – $10,000', 'en', 'Seed lead so the cron / dashboard can show a scheduled follow-up in flight.')
    RETURNING id INTO s2_id;
  ELSE
    SELECT id INTO s2_id FROM leads WHERE email = 'grace@stratifit-seed.com';
  END IF;

  IF s1_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lead_followups WHERE lead_id = s1_id AND topic = 'Discovery call') THEN
    INSERT INTO lead_followups (lead_id, topic, template, lang, status, scheduled_for, scheduled_by)
    VALUES (s1_id, 'Discovery call', 'lead_followup_checkin', 'en', 'scheduled', NOW() + INTERVAL '2 hours', 'admin')
    RETURNING id INTO f1_id;
  END IF;

  IF s2_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lead_followups WHERE lead_id = s2_id AND topic = 'Welcome packet') THEN
    INSERT INTO lead_followups (lead_id, topic, template, lang, status, scheduled_for, scheduled_by)
    VALUES (s2_id, 'Welcome packet', 'lead_followup_welcome', 'en', 'scheduled', NOW() + INTERVAL '1 day', 'admin')
    RETURNING id INTO f2_id;
  END IF;
END $$;

/* ============================================================
   30. supabase_realtime publication (Phase 4)

   Supabase creates the `supabase_realtime` publication by default on
   every new project. We explicitly add ONLY the 24 public-facing CMS
   tables so the website can subscribe to live changes via
   src/lib/use-cms.ts.

   EXPLICITLY EXCLUDED (PII / admin-only):
     - notify_subscribers  (email-list signups)
     - email_log           (recipient + subject + body)
     - llm_log             (chat queries + responses)
     - leads               (name + email + project notes)
     - lead_followups      (recipient + topic + scheduled body)

   These tables must NEVER be added to a client-side publication \u2014
   any anonymous visitor could otherwise stream every email address
   and message body that flows through the app. If you add new PII
   columns to the admin-only tables above, keep them out of this
   publication; if you add new PUBLIC CMS tables, append them here.

   Note: the current schema doesn't define RLS on these tables, so
   Realtime publishes full row payloads to anon subscribers \u2014 same
   data the public /api/cms/[section] route already returns. When
   you add RLS, Realtime honors it automatically and stops leaking
   rows that don't match the policy.
   ============================================================ */
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    -- Idempotent guard: ALTER PUBLICATION ... ADD TABLE raises duplicate_object
    -- (SQLSTATE 42710) when one or more of the listed tables is already a member
    -- of the publication. The sub-BEGIN/EXCEPTION block scopes the catch so we
    -- silently no-op on re-runs while still propagating any other error.
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE
        site_settings,
        header_nav_links,
        footer_content,
        hero_content,
        core_services,
        service_page_content,
        process_steps,
        why_choose_us_content,
        why_choose_us_benefits,
        about_page_content,
        about_stats,
        about_values,
        service_packages,
        testimonials,
        faq_entries,
        projects,
        insights,
        buy_business_niches,
        niche_stats,
        niche_inclusions,
        buy_business_brands,
        legal_pages,
        contact_form_config,
        section_labels;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  ELSE
    RAISE NOTICE 'supabase_realtime publication not found (non-Supabase host?). Skip Realtime setup.';
  END IF;
END $$;
