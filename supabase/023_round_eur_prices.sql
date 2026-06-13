-- Round stored EUR prices up to the nearest 10 (matches display and payment logic).
-- Kjør i Supabase SQL Editor.

update trips
set
  base_price_eur = ceil(base_price_eur / 10) * 10,
  agent_price_eur = case
    when agent_price_eur is not null and agent_price_eur > 0
      then ceil(agent_price_eur / 10) * 10
    else agent_price_eur
  end,
  single_room_supplement_eur = case
    when single_room_supplement_eur is not null and single_room_supplement_eur > 0
      then ceil(single_room_supplement_eur / 10) * 10
    else single_room_supplement_eur
  end,
  updated_at = now()
where base_price_eur > 0;

update departures
set
  price_eur = ceil(price_eur / 10) * 10,
  updated_at = now()
where price_eur is not null and price_eur > 0;
