-- Fjern «Måltider» / «Meals» fra inkludert (vindrueplukkeopplevelse).
-- Kjør i Supabase SQL Editor.

update trips
set
  includes_no = array[
    'Overnatting midt i Minervois',
    'Tilgang til produsenter og vinkjellere',
    'Faglig innhold',
    'Tilrettelegging og gjennomføring'
  ],
  includes_en = array[
    'Accommodation in the heart of Minervois',
    'Access to producers and cellars',
    'Expert content',
    'Organisation and hosting'
  ],
  updated_at = now()
where slug = 'vindrueplukkeopplevelse';
