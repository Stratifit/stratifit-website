-- Stratifit CMS — Full Supabase Migration
-- Run this once in the Supabase SQL editor. It creates all 24 tables
-- used by the /api/cms/[section] route + admin/content editor.

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
   24. section_labels (single row — overrides for every section heading)
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

-- ============================================================
--  Done. After running this migration, sign in at /admin, go to
--  /admin/content, and start filling each section in all 4 languages.
-- ============================================================
