-- Sikrer itinerary-kolonne og dagsprogram for signaturuken.
-- Kjør i Supabase SQL Editor hvis dagsprogrammet ikke vises på reisedetaljsiden.

alter table trips
  add column if not exists itinerary text[];

comment on column trips.itinerary is
  'Dagsprogram som text array, f.eks. "Dag 1: Ankomst …".';

update trips
set
  itinerary = array[
    'Dag 1: Ankomst og velkomstmiddag med franske tapas og lokal vin',
    'Dag 2: Carcassonne (UNESCO-verdensarv) og Cabrespine-grotten',
    'Dag 3: Vingårdsbesøk i Minervois og Cru La Livinière, lunsj blant vinrankene, forhistorisk dolmen',
    'Dag 4: Prisbelønt olivengård, lunsj ved Canal du Midi, rolig kanalbåttur',
    'Dag 5: Markedet i Olonzac, matlagingskurs med lokale råvarer, fellesmåltid',
    'Dag 6: Narbonne (katedral, Via Domitia, Les Halles), Fontfroide-klosteret',
    'Dag 7: Minerve, en av Frankrikes vakreste landsbyer, avsluttningsmiddag',
    'Dag 8: Avreise etter frokost'
  ],
  updated_at = now()
where slug = 'smaken-av-languedoc-ukesprogram'
  and (itinerary is null or cardinality(itinerary) = 0);
