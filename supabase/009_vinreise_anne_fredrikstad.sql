-- Vinreise med Anne Fredrikstad (vin-vingarder-minervois)
-- Kjør i Supabase SQL Editor.
--
-- Pris: 19 200 NOK lagres i price_nok.
-- base_price_eur / departure price_eur er omregnet med ECB-kurs 10,9520 (2026-06-10):
--   19 200 / 10,9520 ≈ 1 753 EUR (avrundet heltall for eksisterende betalingsflyt).

alter table trips
  add column if not exists price_nok numeric;

comment on column trips.price_nok is
  'Totalpris per person i NOK når reisen prises i norske kroner. base_price_eur brukes fortsatt i Vipps/betaling.';

update trips
set
  title_no = 'Vinreise med Anne Fredrikstad',
  tagline_no = 'Fem dager blant menneskene bak vinene – i hjertet av Languedoc.',
  description_no = $desc$
Dette er ikke en vinreise der du sitter i et klasserom og lærer om druer. Dette er en reise der du møter Françoise Antech – femte generasjon vinmaker i Limoux, stedet der Frankrikes første musserende vin ble laget i 1544. Der du spiser lunsj i vinmarkene hos Tove og Arnstein på Domaine de la Senche i La Livinière. Der du vandrer inne i Carcassonne la Cité en maidag uten turistbusser, og avslutter kvelden i hagen med vin fra nabovinmarken.

Anne Fredrikstad leder vinformidlingen. Vi leder resten. Resultatet er fem dager der vin, mat og mennesker flettes naturlig sammen – uten prestasjon, uten hastverk.

«Vin skal nytes – ikke bare drikkes.» Det er Annes motto. Vi er enige.
$desc$,
  category = 'vin-gastronomi',
  district = 'Minervois',
  tags = array['vin', 'vingård', 'gastronomi', 'Anne Fredrikstad', 'Minervois'],
  includes_no = array[
    '4 netter på eiendommen i Minervois',
    'Alle måltider på programmet',
    'Vin til alle måltider',
    'Besøk og smaking hos Famille Antech, Vins de Fontfroide og Domaine de la Senche',
    'Tre-retters lunsj i vinmarkene',
    'Guidet omvisning i Carcassonne la Cité',
    'Besøk i Les Halles de Narbonne',
    'All lokal transport',
    'Transfer til/fra Toulouse lufthavn'
  ],
  excludes_no = array[
    'Flyreise til/fra Frankrike',
    'Reiseforsikring',
    'Personlige utgifter'
  ],
  duration_days = 5,
  duration_nights = 4,
  difficulty_level = 'lett',
  meeting_point = 'Toulouse',
  price_nok = 19200,
  base_price_eur = round(19200 / 10.9520),
  updated_at = now()
where slug = 'vin-vingarder-minervois';

-- Erstatt avganger for denne reisen med én avgang våren 2026
delete from departures
where trip_id = (select id from trips where slug = 'vin-vingarder-minervois');

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
  (select id from trips where slug = 'vin-vingarder-minervois'),
  '2026-05-07',
  '2026-05-11',
  8,
  2,
  round(19200 / 10.9520),
  'Anne Fredrikstad og Morten',
  '7.–11. mai 2026 · 5 dager / 4 netter · Oppmøte Toulouse',
  'open'
);
