-- Fjern produsent-setning fra ingress (description) – vindrueplukkeopplevelse.
-- Kjør i Supabase SQL Editor.

update trips
set
  description_no = $desc$
Nå kan du bli med på en spesiell reise der vi får være med på innhøstingen i hjertet av Sør-Frankrikes vinlandskap. Gruppen er liten, og vi legger vekt på en trygg og oversiktlig gjennomføring.

Plukkingen foregår fra ca. kl. 08 til 12 på ukedager – dagen starter med kaffe og croissant før vi går ut i vinmarken. Lunsjen er sosial med god tid til samtale, og underveis får du muligheten til å bli med inn i vinkjelleren og se hva som skjer med druene etter innhøstingen.

Utenom plukkingen er det tid til avslapping, bading, lesing, utflukter og vinsmaking.

Innhøstingen styres av modning og værforhold – druene bestemmer.
$desc$,
  description_en = $desc$
Now you can join a special trip where we take part in the harvest in the heart of southern France's wine landscape. The group is small, and we emphasise a safe, well-organised experience.

Picking takes place from around 8 am to noon on weekdays – the day starts with coffee and croissant before we head into the vineyard. Lunch is social with time to talk, and along the way you can join us in the cellar to see what happens to the grapes after harvest.

Outside picking there is time to relax, swim, read, go on excursions and taste wine.

The harvest follows ripeness and weather – the grapes decide.
$desc$,
  updated_at = now()
where slug = 'vindrueplukkeopplevelse';
