-- Mat og vin i Languedoc med Ina (matreise-med-ina)
-- Kjør i Supabase SQL Editor.
--
-- Pris: EUR 1 490 per person (price_nok ikke satt).
-- Avgang 19.–23. mai 2027 = 5 dager / 4 netter (siste dag avreise 23.).

insert into trips (
  slug,
  title_no,
  tagline_no,
  description_no,
  category,
  district,
  tags,
  includes_no,
  excludes_no,
  min_persons,
  max_persons,
  base_price_eur,
  price_nok,
  duration_days,
  duration_nights,
  difficulty_level,
  meeting_point,
  max_solo_travelers,
  single_room_supplement_eur,
  deposit_pct,
  agent_price_eur,
  image_url,
  image_urls,
  is_private,
  featured,
  agent_visible,
  status
)
values (
  'matreise-med-ina',
  'Mat og vin i Languedoc med Ina',
  'Fem dager i hjertet av Sør-Frankrike – med en TV-kokk som guide.',
  $desc$
Ina Therese Lindvik Nornes – kjent som Chez Ina og TV-kokk på Matkanalen – har en forkjærlighet for Frankrike som er vanskelig å skjule. Nå tar hun med seg den lidenskapen til Languedoc, i samarbeid med Smaken av Frankrike.

Fem dager der mat og vin ikke er underholdning, men selve poenget. Vi besøker markeder, møter produsentene, lager mat og spiser godt – i autentiske omgivelser som ingen hotellobby kan konkurrere med.

Ina deler sin kunnskap om råvarer, teknikker og det franske kjøkkenet. Vi deler vår lokalkunnskap om vinmarkene, restaurantene og menneskene bak. Resultatet er en reise der du kommer hjem med mer enn minner.
$desc$,
  'vin-gastronomi',
  'Minervois',
  array['mat', 'vin', 'gastronomi', 'Ina Therese Lindvik Nornes', 'Chez Ina', 'Minervois'],
  array[
    '4 netter på L''Hirondelle eller Villa Belle i Minervois',
    'Alle måltider inkludert drikke',
    'Matkurs med Ina',
    'Markedsbesøk og produsentsmaking',
    'All lokal transport',
    'Transfer til/fra Toulouse lufthavn'
  ],
  array[
    'Flyreise til/fra Frankrike',
    'Reiseforsikring',
    'Personlige utgifter'
  ],
  2,
  8,
  1490,
  null,
  5,
  4,
  'lett',
  'Toulouse',
  2,
  350,
  30,
  1340,
  '/images/reiser/mat.jpg',
  array[
    '/images/reiser/mat.jpg',
    '/images/reiser/halles.jpg'
  ],
  false,
  false,
  true,
  'active'
)
on conflict (slug) do update set
  title_no = excluded.title_no,
  tagline_no = excluded.tagline_no,
  description_no = excluded.description_no,
  category = excluded.category,
  district = excluded.district,
  tags = excluded.tags,
  includes_no = excluded.includes_no,
  excludes_no = excluded.excludes_no,
  min_persons = excluded.min_persons,
  max_persons = excluded.max_persons,
  base_price_eur = excluded.base_price_eur,
  price_nok = excluded.price_nok,
  duration_days = excluded.duration_days,
  duration_nights = excluded.duration_nights,
  difficulty_level = excluded.difficulty_level,
  meeting_point = excluded.meeting_point,
  max_solo_travelers = excluded.max_solo_travelers,
  single_room_supplement_eur = excluded.single_room_supplement_eur,
  deposit_pct = excluded.deposit_pct,
  agent_price_eur = excluded.agent_price_eur,
  image_url = excluded.image_url,
  image_urls = excluded.image_urls,
  is_private = excluded.is_private,
  featured = excluded.featured,
  agent_visible = excluded.agent_visible,
  status = excluded.status,
  updated_at = now();

delete from departures
where trip_id = (select id from trips where slug = 'matreise-med-ina');

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
values (
  (select id from trips where slug = 'matreise-med-ina'),
  '2027-05-19',
  '2027-05-23',
  8,
  2,
  1490,
  null,
  '19.–23. mai 2027 · 5 dager / 4 netter · Oppmøte Toulouse · Guide: Ina Therese Lindvik Nornes',
  'open'
);
