-- Utvid trips og departures med nye felter
alter table trips
  add column if not exists district text,
  add column if not exists tags text[],
  add column if not exists duration_nights int,
  add column if not exists difficulty_level text,
  add column if not exists meeting_point text,
  add column if not exists max_solo_travelers int,
  add column if not exists single_room_supplement_eur numeric,
  add column if not exists deposit_pct numeric default 30,
  add column if not exists agent_price_eur numeric,
  add column if not exists image_urls text[],
  add column if not exists is_private boolean default false,
  add column if not exists featured boolean default false,
  add column if not exists agent_visible boolean default true,
  add column if not exists updated_at timestamptz default now();

alter table departures
  add column if not exists price_eur numeric,
  add column if not exists guide_name text,
  add column if not exists notes text;

-- Seed: reiser
insert into trips (
  slug, title_no, tagline_no, description_no, category, district, tags,
  includes_no, excludes_no, min_persons, max_persons, base_price_eur,
  duration_days, duration_nights, difficulty_level, meeting_point,
  max_solo_travelers, single_room_supplement_eur, deposit_pct, agent_price_eur,
  image_url, image_urls, is_private, featured, agent_visible, status
) values
(
  'vin-vingarder-minervois',
  'Vin & vingårder i Minervois',
  'Små grupper, store smaksopplevelser blant vingårdene i Minervois.',
  'Fem dager med vingårdsbesøk, vinsmaking og lokale måltider i hjertet av Minervois. Vi besøker produsenter vi kjenner personlig, spiser godt og tar det i et tempo som gir plass til samtaler og inntrykk.',
  'Vin & gastronomi',
  'Minervois',
  array['vin', 'vingård', 'gastronomi'],
  array[
    '4 netter på charmerende overnatting',
    'Alle måltider med lokale råvarer',
    'Guidede vingårdsbesøk og smakinger',
    'Transport under reisen',
    'Norsk/svensk reiseleder'
  ],
  array[
    'Fly til/fra Frankrike',
    'Reiseforsikring',
    'Personlige utgifter og drikke til måltider'
  ],
  2, 8, 1950, 5, 4, 'lett', null,
  2, 350, 30, 1750,
  '/images/reiser/la%20liviniere.webp',
  array[
    '/images/reiser/la%20liviniere.webp',
    '/images/reiser/fontfroide.jpeg'
  ],
  false, true, true, 'active'
),
(
  'smak-languedoc',
  'Smak deg gjennom Languedoc',
  'En uke med mat, vin og mennesker – fra kyst til inland.',
  'Syv dager der vi smaker oss gjennom Languedoc: marked, ost, olivenolje, vin og hverdagsmaten du ikke finner i guidebøkene. Reisen kombinerer kulinariske høydepunkter med rolige ettermiddager og god tid til å bli kjent med regionen.',
  'Vin & gastronomi',
  'Languedoc',
  array['mat', 'vin', 'gastronomi', 'kultur'],
  array[
    '6 netter på utvalgte overnattingssteder',
    'Frokost og de fleste måltider',
    'Smakinger og matopplevelser',
    'Transport under reisen',
    'Norsk/svensk reiseleder'
  ],
  array[
    'Fly til/fra Frankrike',
    'Reiseforsikring',
    'Lunch på reisedager uten program',
    'Personlige utgifter'
  ],
  2, 8, 2650, 7, 6, 'lett', null,
  2, 400, 30, 2400,
  '/images/reiser/mat.jpg',
  array[
    '/images/reiser/mat.jpg',
    '/images/reiser/halles.jpg'
  ],
  false, true, true, 'active'
),
(
  'aktiv-gorges-herault',
  'Aktiv i Gorges du Hérault',
  'Vandring, bading og natur i et av Sør-Frankrikes vakreste landskap.',
  'Fem aktive dager i og rundt Gorges du Hérault. Vi vandrer stier med utsikt, tar svømmeturer i elven og avslutter dagene med enkle, gode måltider. Tempoet er moderat – du trenger ikke være supertrim, men god grunnform er en fordel.',
  'Aktiv natur',
  'Gorges du Hérault',
  array['vandring', 'natur', 'aktiv'],
  array[
    '4 netter på overnatting nær naturen',
    'Frokost og middag',
    'Guidede turer og aktiviteter',
    'Transport til aktivitetssteder',
    'Norsk/svensk reiseleder'
  ],
  array[
    'Fly til/from Frankrike',
    'Reiseforsikring',
    'Lunsj',
    'Personlig utstyr som vandresko'
  ],
  2, 10, 1750, 5, 4, 'middels', null,
  3, 300, 30, 1580,
  '/images/reiser/peyre.jpg',
  array[
    '/images/reiser/peyre.jpg',
    '/images/reiser/deux%20riviere%201.webp'
  ],
  false, false, true, 'active'
),
(
  'vindrueplukking-minervois',
  'Vindrueplukking i Minervois',
  'Opplev høsten i vingården – håndarbeid, fellesskap og ekte høststemning.',
  'Syv dager under høstens vendange i Minervois. Du plukker sammen med oss og våre venner blant vingårdene, lærer om druene og årstiden, og opplever landsbylivet når det er som mest levende. Oppmøte i Olonzac.',
  'Vin & gastronomi',
  'Minervois',
  array['vindrueplukking', 'vin', 'høst', 'Minervois'],
  array[
    '6 netter på enkel, koselig overnatting',
    'Måltider med lokale råvarer',
    'Dager i vingården med plukking',
    'Transport fra oppmøtested',
    'Norsk/svensk reiseleder'
  ],
  array[
    'Fly til/fra Frankrike',
    'Reiseforsikring',
    'Personlige utgifter'
  ],
  2, 12, 1600, 7, 6, 'middels', 'Olonzac',
  4, 250, 30, 1450,
  '/images/reiser/IMG_1611.webp',
  array[
    '/images/reiser/IMG_1611.webp',
    '/images/reiser/IMG_1592.webp'
  ],
  false, false, true, 'active'
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
  base_price_eur = excluded.base_price_eur,
  duration_days = excluded.duration_days,
  duration_nights = excluded.duration_nights,
  difficulty_level = excluded.difficulty_level,
  meeting_point = excluded.meeting_point,
  image_url = excluded.image_url,
  image_urls = excluded.image_urls,
  updated_at = now();

-- Seed: avganger (slett eksisterende for disse reisene først for idempotens)
delete from departures
where trip_id in (
  select id from trips where slug in (
    'vin-vingarder-minervois',
    'smak-languedoc',
    'aktiv-gorges-herault',
    'vindrueplukking-minervois'
  )
);

insert into departures (
  trip_id, start_date, end_date, available_spots, min_persons,
  price_eur, guide_name, notes, status
) values
(
  (select id from trips where slug = 'vin-vingarder-minervois'),
  '2025-09-12', '2025-09-16', 8, 2, 1950, 'Elisabeth', null, 'open'
),
(
  (select id from trips where slug = 'vin-vingarder-minervois'),
  '2025-10-03', '2025-10-07', 8, 2, 1950, 'Morten', null, 'open'
),
(
  (select id from trips where slug = 'smak-languedoc'),
  '2025-05-05', '2025-05-11', 6, 2, 2650, 'Elisabeth', null, 'open'
),
(
  (select id from trips where slug = 'aktiv-gorges-herault'),
  '2025-06-14', '2025-06-18', 10, 2, 1750, 'Morten', 'Moderat fysisk aktivitet.', 'open'
),
  (
  (select id from trips where slug = 'vindrueplukking-minervois'),
  '2025-09-20', '2025-09-26', 12, 2, 1600, 'Elisabeth', 'Oppmøte Olonzac kl. 16:00.', 'open'
);

-- Row Level Security: tillat offentlig lesing
alter table trips enable row level security;
alter table departures enable row level security;

drop policy if exists "Public can read active trips" on trips;
create policy "Public can read active trips"
  on trips for select
  using (status = 'active');

drop policy if exists "Public can read departures" on departures;
create policy "Public can read departures"
  on departures for select
  using (true);
