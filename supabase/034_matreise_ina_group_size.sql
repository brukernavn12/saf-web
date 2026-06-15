-- Matreise med Ina: gruppestørrelse 6–12 deltagere
-- Kjør i Supabase SQL Editor.

update trips
set
  min_persons = 6,
  max_persons = 12,
  min_persons_to_confirm = 6,
  group_size_no = 'Opptil 12 deltagere',
  group_size_en = 'Up to 12 participants',
  updated_at = now()
where slug = 'matreise-med-ina';

update departures
set
  available_spots = 12,
  min_persons = 6
where trip_id = (select id from trips where slug = 'matreise-med-ina');
