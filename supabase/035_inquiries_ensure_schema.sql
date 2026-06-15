-- Sikre at inquiries-tabellen har alle kolonner interesseskjemaet bruker.
-- Kjør i Supabase SQL Editor hvis skjemaet feiler med «Kunne ikke lagre henvendelsen».
--
-- API-et forventer: trip_id, departure_id, name, email, phone, message,
-- preferred_dates, group_size, type, status, language

alter table inquiries
  add column if not exists departure_id uuid references departures(id),
  add column if not exists preferred_dates text,
  add column if not exists group_size int,
  add column if not exists type text default 'interest',
  add column if not exists status text default 'new',
  add column if not exists language text default 'no';

-- Valgfri: verifiser at en test-rad kan settes inn (slett etterpå).
-- Erstatt trip_id med en faktisk id fra: select id, slug from trips where status = 'active';

-- insert into inquiries (trip_id, name, email, type, status, language)
-- select id, 'Test', 'test@example.com', 'interest', 'new', 'no'
-- from trips where slug = 'vindrueplukkeopplevelse' limit 1;
