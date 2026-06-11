-- Vindrueplukkeopplevelse (vindrueplukkeopplevelse)
-- Kjør i Supabase SQL Editor.
--
-- Ingen avganger – reisen er interessebasert med priser i price_info.
-- Frontend: vis price_info og interesseskjema (ønsket antall netter + periode).

alter table trips
  add column if not exists price_info text,
  add column if not exists interest_only boolean default false;

comment on column trips.price_info is
  'Fritekst prisinfo når reisen ikke har fast pris per person (f.eks. pakkepriser i NOK).';

comment on column trips.interest_only is
  'Når true: ingen booking/Vipps – kun interesseskjema uten avganger.';

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
  price_info,
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
  'vindrueplukkeopplevelse',
  'Vindrueplukkeopplevelse',
  'Bli med på innhøstingen i hjertet av Sør-Frankrikes vinlandskap.',
  $desc$
Nå kan du bli med på en spesiell reise der vi får være med på innhøstingen i hjertet av Sør-Frankrikes vinlandskap. Gruppen er liten, og vi legger vekt på en trygg og oversiktlig gjennomføring.

Plukkingen foregår fra ca. kl. 08 til 12 på ukedager – dagen starter med kaffe og croissant før vi går ut i vinmarken. Lunsjen er sosial med god tid til samtale, og underveis får du muligheten til å bli med inn i vinkjelleren og se hva som skjer med druene etter innhøstingen.

Utenom plukkingen er det tid til avslapping, bading, lesing, utflukter og vinsmaking. Vi samarbeider med utvalgte produsenter, blant annet Domaine de la Senche og Famille Antech.

Innhøstingen styres av modning og værforhold – druene bestemmer.
$desc$,
  'vindrueplukking',
  'Minervois',
  array['vindrueplukking', 'innhøsting', 'vin', 'Minervois', 'Olonzac'],
  array[
    'Overnatting midt i Minervois',
    'Måltider',
    'Tilgang til produsenter og vinkjellere',
    'Faglig innhold',
    'Tilrettelegging og gjennomføring'
  ],
  array[
    'Flyreise til/fra Frankrike',
    'Transport til Olonzac',
    'Reiseforsikring',
    'Personlige utgifter'
  ],
  1,
  12,
  0,
  null,
  '3 netter delt dobbeltrom: kr 4.500 | 4 netter: kr 5.450 | 5 netter: kr 6.400. Enkeltrom: 3 netter kr 6.750 | 4 netter kr 8.450 | 5 netter kr 10.150',
  null,
  null,
  null,
  'Olonzac',
  null,
  null,
  null,
  null,
  '/images/reiser/IMG_1611.webp',
  array[
    '/images/reiser/IMG_1611.webp',
    '/images/reiser/IMG_1592.webp'
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
  max_persons = excluded.max_persons,
  base_price_eur = excluded.base_price_eur,
  price_nok = excluded.price_nok,
  price_info = excluded.price_info,
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

-- Ingen avganger for denne reisen
delete from departures
where trip_id = (select id from trips where slug = 'vindrueplukkeopplevelse');
