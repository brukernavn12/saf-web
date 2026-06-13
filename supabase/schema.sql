-- Reiser
create table trips (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_no text not null,
  title_sv text,
  title_en text,
  tagline_no text,
  tagline_sv text,
  tagline_en text,
  description_no text,
  description_sv text,
  description_en text,
  category text not null,
  includes_no text[],
  includes_en text[],
  excludes_no text[],
  excludes_en text[],
  itinerary text[],
  itinerary_en text[],
  program_no text,
  program_en text,
  group_size_no text,
  group_size_en text,
  min_persons int default 2,
  max_persons int default 8,
  base_price_eur numeric not null,
  duration_days int,
  image_url text,
  status text default 'active',
  created_at timestamptz default now()
);

-- Avganger
create table departures (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id),
  start_date date not null,
  end_date date not null,
  available_spots int not null,
  min_persons int default 2,
  status text default 'open',
  confirmed_at timestamptz,
  created_at timestamptz default now()
);

-- Bookinger
create table bookings (
  id uuid primary key default gen_random_uuid(),
  departure_id uuid references departures(id),
  guest_name text not null,
  email text not null,
  phone text not null,
  persons int not null,
  total_eur numeric not null,
  deposit_eur numeric not null,
  deposit_paid_at timestamptz,
  remainder_eur numeric not null,
  remainder_due_date date,
  remainder_paid_at timestamptz,
  payment_method text,
  status text default 'pending',
  pickup_point text,
  allergies text,
  mobility_notes text,
  health_notes text,
  terms_accepted_at timestamptz,
  agent_id uuid,
  language text default 'no',
  created_at timestamptz default now()
);

-- Venteliste
create table waitlist (
  id uuid primary key default gen_random_uuid(),
  departure_id uuid references departures(id),
  name text not null,
  email text not null,
  phone text,
  persons int default 1,
  notified_at timestamptz,
  created_at timestamptz default now()
);

-- Interesse/henvendelser
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id),
  name text not null,
  email text not null,
  phone text,
  group_size int,
  preferred_dates text,
  message text,
  type text default 'interest',
  status text default 'new',
  language text default 'no',
  created_at timestamptz default now()
);

-- Nyhetsbrev
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  language text default 'no',
  source text,
  confirmed_at timestamptz,
  created_at timestamptz default now()
);
