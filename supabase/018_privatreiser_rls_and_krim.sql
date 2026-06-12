-- Privatreiser: tillat lesing av alle aktive reiser (offentlige + private).
-- Krim-reisen markeres som privat og vises på /privatreiser.
-- Kjør i Supabase SQL Editor.

drop policy if exists "Anon can read active public trips" on trips;
drop policy if exists "Public can read active trips" on trips;
drop policy if exists "Anon can read active trips" on trips;
drop policy if exists "Anon can read public trip departures" on departures;
drop policy if exists "Public can read departures" on departures;
drop policy if exists "Anon can read trip departures" on departures;

create policy "Anon can read active trips"
  on trips
  for select
  to anon, authenticated
  using (status = 'active');

create policy "Anon can read trip departures"
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
    )
  );

-- Oppdater krim-reisen til privat (privatreiser) hvis den allerede finnes
update trips
set is_private = true, featured = false, updated_at = now()
where slug = 'krim-og-languedoc-2027';
