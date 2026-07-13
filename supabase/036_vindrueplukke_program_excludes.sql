-- Vindrueplukkeopplevelse: fjern sykehus-setning fra program, flytt måltider til ikke inkludert
-- Kjør i Supabase SQL Editor.

update trips
set
  program_no = replace(
    program_no,
    'I nærområdet finnes apotek og legekontor. Nærmeste sykehus ligger ca. 30 minutter unna. Gi beskjed på forhånd ved allergier eller helsebehov.',
    'I nærområdet finnes apotek og legekontor. Gi beskjed på forhånd ved allergier eller helsebehov.'
  ),
  program_en = replace(
    program_en,
    'Pharmacy and doctor''s surgery are nearby; the nearest hospital is about 30 minutes away. Please tell us in advance about allergies or health needs.',
    'Pharmacy and doctor''s surgery are nearby. Please tell us in advance about allergies or health needs.'
  ),
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
  excludes_no = array[
    'Flyreise til/fra Frankrike',
    'Måltider',
    'Transport til Olonzac',
    'Reiseforsikring',
    'Personlige utgifter'
  ],
  excludes_en = array[
    'Flights to/from France',
    'Meals',
    'Transport to Olonzac',
    'Travel insurance',
    'Personal expenses'
  ],
  updated_at = now()
where slug = 'vindrueplukkeopplevelse';
