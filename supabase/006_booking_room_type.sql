alter table bookings
  add column if not exists room_type text default 'shared';
