-- RLS: offentlig lesing for anon-brukere (Next.js frontend)
-- Kjør i Supabase SQL Editor.
--
-- Tillater:
--   trips      → aktive, ikke-private reiser (is_private = false)
--   departures → åpne/bekreftede avganger knyttet til slike reiser

alter table trips enable row level security;
alter table departures enable row level security;

-- Fjern tidligere policies (trygt å kjøre på nytt)
drop policy if exists "Anon can read active public trips" on trips;
drop policy if exists "Public can read active trips" on trips;
drop policy if exists "Anon can read public trip departures" on departures;
drop policy if exists "Public can read departures" on departures;

-- Aktive, offentlige reiser
create policy "Anon can read active public trips"
  on trips
  for select
  to anon, authenticated
  using (
    status = 'active'
    and coalesce(is_private, false) = false
  );

-- Avganger for offentlige reiser (kun åpne/bekreftede)
create policy "Anon can read public trip departures"
  on departures
  for select
  to anon, authenticated
  using (
    status in ('open', 'confirmed')
    and exists (
      select 1
      from trips
      where trips.id = departures.trip_id
        and trips.status = 'active'
        and coalesce(trips.is_private, false) = false
    )
  );
