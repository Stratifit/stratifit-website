-- Stratifit CMS - Add Buy a Business to header_nav_links
-- Idempotent: safe to re-run. Only inserts if /buy-business is missing.
-- Run this in the Supabase SQL editor to add Buy a Business right now.
-- (This is the Buy a Business excerpt from scripts/cms-migration.sql,
--  isolated for users who don't want to re-run the full migration.)
-- After running, manage the nav at /admin/content.
--
-- DEPRECATED: As of 2026, Buy a Business was removed from the header
-- nav per product request. The /buy-business page itself still exists
-- and can still be reached directly. Keep this file as reference for
-- easy re-adding. Uncomment the INSERT below to re-enable.

/* INSERT INTO header_nav_links (sort_order, label, href, is_cta, cta_text)
SELECT 5,
       '{"en":"Buy a Business","de":"Unternehmen kaufen","fr":"Acheter une entreprise","es":"Comprar un negocio"}'::jsonb,
       '/buy-business',
       FALSE,
       '{}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM header_nav_links WHERE href = '/buy-business'
);

-- Verify
SELECT sort_order, label->>'en' AS label_en, href
FROM header_nav_links
WHERE href = '/buy-business'; */
