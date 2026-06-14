-- Krimreise: sett basepris i EUR (NO viser fortsatt price_nok 16 000).
-- Kjør i Supabase SQL Editor.

update trips
set
  base_price_eur = 1500,
  updated_at = now()
where slug = 'krim-og-languedoc-2027';
