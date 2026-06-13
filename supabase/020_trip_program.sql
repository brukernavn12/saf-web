-- Fullt program i ett tekstfelt per reise (program_no / program_en).
-- Én dag per blokk, format "Dag 1: …". Flere avsnitt samme dag skilles med blank linje.
-- Kjør i Supabase SQL Editor.

alter table trips
  add column if not exists program_no text,
  add column if not exists program_en text;

comment on column trips.program_no is
  'Fullt dagsprogram på norsk. Én dag per blokk: "Dag 1: …". Flere linjer under samme dag tillates.';
comment on column trips.program_en is
  'Full programme in English. One day per block: "Day 1: …".';

-- Signaturuken: kopier eksisterende itinerary til program_no / program_en
update trips
set
  program_no = array_to_string(
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
    E'\n'
  ),
  program_en = array_to_string(
    array[
      'Day 1: Arrival and welcome dinner with French tapas and local wine',
      'Day 2: Carcassonne (UNESCO World Heritage) and Cabrespine cave',
      'Day 3: Vineyard visit in Minervois and Cru La Livinière, lunch among the vines, prehistoric dolmen',
      'Day 4: Award-winning olive farm, lunch by the Canal du Midi, gentle canal boat trip',
      'Day 5: Market in Olonzac, cooking course with local produce, shared meal',
      'Day 6: Narbonne (cathedral, Via Domitia, Les Halles), Fontfroide Abbey',
      'Day 7: Minerve, one of France''s most beautiful villages, farewell dinner',
      'Day 8: Departure after breakfast'
    ],
    E'\n'
  ),
  updated_at = now()
where slug = 'smaken-av-languedoc-ukesprogram';
