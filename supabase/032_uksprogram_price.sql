-- Smaken av Languedoc (signatur ukesprogram): NOK 36 900 / EUR 3 200
-- Kjør i Supabase SQL Editor.

update trips
set
  price_nok = 36900,
  base_price_eur = 3200,
  updated_at = now()
where slug = 'smaken-av-languedoc-ukesprogram';
