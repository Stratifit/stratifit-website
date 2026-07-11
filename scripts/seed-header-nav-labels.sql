-- Stratifit CMS - Populate Header Navigation labels
-- Run this in the Supabase SQL editor to fill the label JSONB for
-- every known header_nav_links row with proper translations in all
-- 4 languages (en/de/fr/es). The header's defensive tLabel()
-- fallback already covers empty labels, but this makes the CMS the
-- single source of truth.
--
-- Idempotent: safe to re-run. Each UPDATE only fires when a row
-- with the matching href exists, and skips itself if the label is
-- already fully filled in all 4 languages.
--
-- Labels mirror the translations in src/lib/stratifit-i18n.ts so
-- the CMS-driven labels stay in sync with the static fallback.

/* ---------------- Home ---------------- */
UPDATE header_nav_links
SET label = '{"en":"Home","de":"Startseite","fr":"Accueil","es":"Inicio"}'::jsonb
WHERE href = '/'
  AND (label->>'en' IS NULL OR label->>'en' = '');

/* ---------------- Services ---------------- */
UPDATE header_nav_links
SET label = '{"en":"Services","de":"Dienstleistungen","fr":"Services","es":"Servicios"}'::jsonb
WHERE href = '#services'
  AND (label->>'en' IS NULL OR label->>'en' = '');

/* ---------------- Work / Portfolio ---------------- */
UPDATE header_nav_links
SET label = '{"en":"Work","de":"Arbeit","fr":"Projets","es":"Trabajo"}'::jsonb
WHERE href = '/portfolio'
  AND (label->>'en' IS NULL OR label->>'en' = '');

/* ---------------- Insights ---------------- */
UPDATE header_nav_links
SET label = '{"en":"Insights","de":"Einblicke","fr":"Idées","es":"Ideas"}'::jsonb
WHERE href = '/insights'
  AND (label->>'en' IS NULL OR label->>'en' = '');

/* ---------------- About ---------------- */
UPDATE header_nav_links
SET label = '{"en":"About","de":"Über uns","fr":"À Propos","es":"Acerca de"}'::jsonb
WHERE href = '/about'
  AND (label->>'en' IS NULL OR label->>'en' = '');

/* ---------------- FAQ ---------------- */
UPDATE header_nav_links
SET label = '{"en":"FAQ","de":"FAQ","fr":"FAQ","es":"FAQ"}'::jsonb
WHERE href = '#faq'
  AND (label->>'en' IS NULL OR label->>'en' = '');

/* ---------------- Contact ---------------- */
UPDATE header_nav_links
SET label = '{"en":"Contact","de":"Kontakt","fr":"Contact","es":"Contacto"}'::jsonb
WHERE (action = 'contact' OR href = '#contact')
  AND (label->>'en' IS NULL OR label->>'en' = '');

/* ---------------- Buy a Business (legacy CMS row) ---------------- */
-- Buy a Business was removed from the FALLBACK_NAV in 2026, but
-- any pre-existing CMS row will still render. This UPDATE fills
-- its label for the 4 languages so the rendered link has proper
-- translated text instead of an empty label.
UPDATE header_nav_links
SET label = '{"en":"Buy a Business","de":"Unternehmen kaufen","fr":"Acheter une entreprise","es":"Comprar un negocio"}'::jsonb
WHERE href = '/buy-business'
  AND (label->>'en' IS NULL OR label->>'en' = '');

/* ---------------- Verify ---------------- */
SELECT sort_order,
       label->>'en' AS label_en,
       label->>'de' AS label_de,
       label->>'fr' AS label_fr,
       label->>'es' AS label_es,
       href,
       action,
       is_active
FROM header_nav_links
ORDER BY sort_order;
