-- Fjern gruppestørrelse/trygghet-setning fra program (Velkommen) – vindrueplukkeopplevelse.
-- Kjør i Supabase SQL Editor.

update trips
set
  program_no = replace(
    program_no,
    E'Nå kan du bli med på innhøstingen i hjertet av Sør-Frankrikes vinlandskap. Gruppen er relativt liten, og vi legger vekt på en trygg og oversiktlig gjennomføring av oppholdet.',
    'Nå kan du bli med på innhøstingen i hjertet av Sør-Frankrikes vinlandskap.'
  ),
  program_en = replace(
    program_en,
    E'Join us for the harvest in the heart of southern France''s wine country. The group is relatively small, and we focus on a safe, well-organised stay.',
    'Join us for the harvest in the heart of southern France''s wine country.'
  ),
  updated_at = now()
where slug = 'vindrueplukkeopplevelse';
