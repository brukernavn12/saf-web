-- Synlig gruppestørrelse for kunder (fremmede reisefølge, ikke egen booking).
-- Fri tekst per reise, f.eks. "4–12 deltagere" / "4–12 participants".
-- min_persons_to_confirm beholdes internt – vises ikke lenger på nettsiden.
-- Kjør i Supabase SQL Editor.

alter table trips
  add column if not exists group_size_no text,
  add column if not exists group_size_en text;

comment on column trips.group_size_no is
  'Synlig gruppestørrelse på reisesiden, f.eks. "4–12 deltagere".';
comment on column trips.group_size_en is
  'Visible group size on English trip page, e.g. "4–12 participants".';

update trips set group_size_no = '2–8 deltagere', group_size_en = '2–8 participants', updated_at = now()
where slug = 'vin-vingarder-minervois';

update trips set group_size_no = '2–8 deltagere', group_size_en = '2–8 participants', updated_at = now()
where slug = 'matreise-med-ina';

update trips set group_size_no = 'Opptil 7 deltagere', group_size_en = 'Up to 7 participants', updated_at = now()
where slug = 'smaken-av-languedoc-ukesprogram';

update trips set group_size_no = 'Opptil 12 deltagere', group_size_en = 'Up to 12 participants', updated_at = now()
where slug = 'krim-og-languedoc-2027';

update trips set group_size_no = '1–12 deltagere', group_size_en = '1–12 participants', updated_at = now()
where slug = 'vindrueplukkeopplevelse';
