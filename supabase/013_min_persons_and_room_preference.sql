-- Skill minimum per bestilling vs. minimum for å bekrefte reisen
-- Kjør i Supabase SQL Editor.

alter table trips
  add column if not exists min_persons_per_booking int default 1,
  add column if not exists min_persons_to_confirm int;

comment on column trips.min_persons_per_booking is
  'Minimum antall personer én bestilling må inneholde (typisk 1).';

comment on column trips.min_persons_to_confirm is
  'Minimum totalt antall deltakere på avgangen for at reisen gjennomføres.';

update trips
set
  min_persons_to_confirm = coalesce(min_persons_to_confirm, min_persons, 2),
  min_persons_per_booking = coalesce(min_persons_per_booking, 1)
where min_persons_to_confirm is null
   or min_persons_per_booking is null;

alter table bookings
  add column if not exists room_preference text,
  add column if not exists room_mate_name text;

comment on column bookings.room_preference is
  'share_with_named | open_to_share';

comment on column bookings.room_mate_name is
  'Navn på reisefølge ved room_preference = share_with_named.';

-- Vindrueplukking: book alene, bekreftes ved 4+
update trips
set min_persons_per_booking = 1, min_persons_to_confirm = 4
where slug = 'vindrueplukkeopplevelse';

-- Vinreiser: book fra 1, bekreftes ved 2+
update trips
set min_persons_per_booking = 1, min_persons_to_confirm = 2
where slug in (
  'vin-vingarder-minervois',
  'matreise-med-ina',
  'smak-languedoc',
  'aktiv-gorges-herault',
  'vindrueplukking-minervois'
);
