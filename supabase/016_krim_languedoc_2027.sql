-- Krim & Languedoc – en uke for forfattere (mai 2027)
-- Kjør i Supabase SQL Editor.
--
-- Ingen avganger – interessebasert reise med fast pris i NOK.
-- Frontend: vis pris og interesseskjema (ingen Vipps/booking).

alter table trips
  add column if not exists price_nok numeric,
  add column if not exists interest_only boolean default false;

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
  min_persons_per_booking,
  min_persons_to_confirm,
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
  interest_only,
  status
)
values (
  'krim-og-languedoc-2027',
  'Krim & Languedoc – en uke for forfattere',
  'Sene kvelder, god vin og historier som ikke tåler dagslys.',
  $desc$
Agnes Matre og Geir Tangen – to av Norges fremste krimforfattere og kjennere av det mørke og det vakre – inviterer sine kollegaer til Languedoc i mai 2027. Dette er ikke en vanlig reise. Det er fem dager der dagene tilhører Sør-Frankrike – markeder, vingårder, middelalderby og varm stein – og kveldene tilhører forfatterne selv. Vi leser for hverandre. Vi leser hverandres verk. Vi snakker om det vi egentlig driver med. Maten er god. Vinen er bedre. Nettene er lange. Elisabeth og Morten er vertskap og guider. Agnes og Geir er med hele veien.
$desc$,
  'kultur',
  'Minervois',
  array['krim', 'forfattere', 'kultur', 'Minervois', 'mai 2027', 'Agnes Matre', 'Geir Tangen'],
  array[
    '4 netter på L''Hirondelle eller Villa Belle',
    'Alle måltider inkludert drikke',
    'All lokal transport',
    'To guider og vertskap hele veien',
    'Kulturelle utflukter tilpasset gruppen'
  ],
  array[
    'Flyreise',
    'Reiseforsikring',
    '5. natt (kr 5.000 tillegg ved ønske)'
  ],
  1,
  1,
  0,
  12,
  0,
  16000,
  5,
  4,
  'lett',
  'Toulouse',
  null,
  null,
  null,
  null,
  '/images/reiser/fontfroide.jpeg',
  array[
    '/images/reiser/fontfroide.jpeg',
    '/images/reiser/caunes minervois.jpeg'
  ],
  false,
  false,
  true,
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
  min_persons_per_booking = excluded.min_persons_per_booking,
  min_persons_to_confirm = excluded.min_persons_to_confirm,
  max_persons = excluded.max_persons,
  base_price_eur = excluded.base_price_eur,
  price_nok = excluded.price_nok,
  duration_days = excluded.duration_days,
  duration_nights = excluded.duration_nights,
  difficulty_level = excluded.difficulty_level,
  meeting_point = excluded.meeting_point,
  image_url = excluded.image_url,
  image_urls = excluded.image_urls,
  is_private = excluded.is_private,
  featured = excluded.featured,
  agent_visible = excluded.agent_visible,
  interest_only = excluded.interest_only,
  status = excluded.status,
  updated_at = now();

delete from departures
where trip_id = (select id from trips where slug = 'krim-og-languedoc-2027');

-- Verifiser (skal returnere én rad):
-- select slug, status, interest_only, price_nok from trips where slug = 'krim-og-languedoc-2027';
