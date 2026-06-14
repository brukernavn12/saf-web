-- Matreise med Ina: sett NOK-pris (EN viser fortsatt base_price_eur 1 490).
-- Kjør i Supabase SQL Editor.

update trips
set
  price_nok = 17500,
  updated_at = now()
where slug = 'matreise-med-ina';
