-- Betalingsøkter (Vipps) og utvid inquiries med departure_id

alter table inquiries
  add column if not exists departure_id uuid references departures(id);

create table if not exists payment_sessions (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  departure_id uuid not null references departures(id),
  trip_id uuid not null references trips(id),
  guest_name text not null,
  email text not null,
  phone text not null,
  persons int not null,
  total_eur numeric not null,
  deposit_eur numeric not null,
  deposit_nok integer not null,
  language text default 'no',
  booking_id uuid references bookings(id),
  status text not null default 'pending',
  vipps_transaction_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_payment_sessions_order_id on payment_sessions(order_id);
create index if not exists idx_payment_sessions_booking_id on payment_sessions(booking_id);

alter table payment_sessions enable row level security;

-- Kun service role skriver/leser payment_sessions (ingen anon-policy)

-- Tillat service role å opprette bookinger og inquiries via API
-- (bookings/inquiries har ingen anon insert-policy fra før)
