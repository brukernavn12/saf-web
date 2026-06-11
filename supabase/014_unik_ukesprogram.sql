-- Smaken av Languedoc – signaturukesprogram
-- Kjør i Supabase SQL Editor.

alter table trips
  add column if not exists itinerary text[];

comment on column trips.itinerary is
  'Dagsprogram som text array, f.eks. "Dag 1: Ankomst …".';

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
  price_info,
  duration_days,
  duration_nights,
  difficulty_level,
  meeting_point,
  itinerary,
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
  'smaken-av-languedoc-ukesprogram',
  'Smaken av Languedoc – ukesprogram',
  'Alltid små grupper, maks 7 personer. Alt inkludert.',
  $desc$
Dette er signaturreisen vår. En hel uke i Minervois der du ikke trenger å tenke på noe som helst – vi har ordnet alt.

Du bor i Villa Belle eller L'Hirondelle, to store stenhus fra tidlig 1800-tall restaurert med moderne komfort. Du spiser frokost, lunsj og middag med vin inkludert. Du hentes på flyplassen og kjøres tilbake ved avreise.

Gruppen er aldri større enn 7 personer. Det er ikke tilfeldig – det er poenget.
$desc$,
  'vin-gastronomi',
  'Minervois',
  array['signatur', 'ukesprogram', 'vin', 'gastronomi', 'Minervois'],
  array[
    'Henting og bringing til flyplass eller togstasjon',
    'Overnatting på Villa Belle eller L''Hirondelle',
    'Alle måltider inkludert all drikke',
    'Alle utflukter og aktiviteter i programmet',
    'Transport under hele oppholdet',
    'Norske reiseledere med 18 års lokalkunnskap'
  ],
  array[
    'Flyreise',
    'Enkeltromstillegg',
    'Ekstra aktiviteter utenfor programmet',
    'Reiseforsikring'
  ],
  1,
  1,
  4,
  7,
  0,
  null,
  null,
  8,
  7,
  'lett',
  'Toulouse',
  array[
    'Dag 1: Ankomst og velkomstmiddag med franske tapas og lokal vin',
    'Dag 2: Carcassonne (UNESCO-verdensarv) og Cabrespine-grotten',
    'Dag 3: Vingårdsbesøk i Minervois og Cru La Livinière, lunsj blant vinrankene, forhistorisk dolmen',
    'Dag 4: Prisbelønt olivengård, lunsj ved Canal du Midi, rolig kanalbåttur',
    'Dag 5: Markedet i Olonzac, matlagingskurs med lokale råvarer, fellesmåltid',
    'Dag 6: Narbonne (katedral, Via Domitia, Les Halles), Fontfroide-klosteret',
    'Dag 7: Minerve, en av Frankrikes vakreste landsbyer, avsluttningsmiddag',
    'Dag 8: Avreise etter frokost'
  ],
  null,
  null,
  30,
  null,
  '/images/reiser/pontdugard.jpeg',
  array[
    '/images/reiser/pontdugard.jpeg',
    '/images/reiser/mat.jpg'
  ],
  false,
  true,
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
  duration_days = excluded.duration_days,
  duration_nights = excluded.duration_nights,
  difficulty_level = excluded.difficulty_level,
  meeting_point = excluded.meeting_point,
  itinerary = excluded.itinerary,
  image_url = excluded.image_url,
  image_urls = excluded.image_urls,
  is_private = excluded.is_private,
  featured = excluded.featured,
  agent_visible = excluded.agent_visible,
  interest_only = excluded.interest_only,
  status = excluded.status,
  updated_at = now();

delete from departures
where trip_id = (select id from trips where slug = 'smaken-av-languedoc-ukesprogram');
