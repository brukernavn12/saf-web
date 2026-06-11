-- Vinreise med Anne Fredrikstad: ny avgang 2027 + oppdatert tagline
-- Kjør i Supabase SQL Editor.

update trips
set
  tagline_no = 'Vi gjentar suksessen fra 2026 – fem dager blant menneskene bak vinene i hjertet av Languedoc.',
  updated_at = now()
where slug = 'vin-vingarder-minervois';

insert into departures (
  trip_id,
  start_date,
  end_date,
  available_spots,
  min_persons,
  price_eur,
  guide_name,
  notes,
  status
)
select
  t.id,
  '2027-04-30',
  '2027-05-04',
  8,
  2,
  t.base_price_eur,
  'Anne Fredrikstad og Morten',
  '30. april – 4. mai 2027 · 5 dager / 4 netter · Oppmøte Toulouse',
  'open'
from trips t
where t.slug = 'vin-vingarder-minervois'
  and not exists (
    select 1
    from departures d
    where d.trip_id = t.id
      and d.start_date = '2027-04-30'
      and d.end_date = '2027-05-04'
  );
