-- Vinreise med Anne Fredrikstad – fullt program (program_no / program_en)
-- Kilde: reiseplan PDF (7.–11. mai 2026). Datoer utelatt – gjelder alle avganger.
-- Kjør i Supabase SQL Editor.

update trips
set
  program_no = $program_no$
Dag 1: Ankomst
Ankomst Toulouse lufthavn. Vi henter deg på flyplassen og kjører til eiendommen i Minervois. Henting fra andre flyplasser kan avtales i god tid.
Velkommen og bli kjent over et glass vin, før vi deler noen lokale perspektiver og går gjennom dagene som kommer.
Middag på En Bonne Compagnie i Homps – restaurant ved Canal du Midi med uteservering langs kanalen. Fransk mat med fokus på lokale råvarer. Vinene velges og tilpasses menyen.

Dag 2: Limoux og Carcassonne
Fransk frokost.
Vi reiser til Limoux og besøker Famille Antech, hvor vi møter Françoise Antech, femte generasjon vinmaker. Hos Françoise får vi innsikt i Limoux som historisk område for musserende vin – stedet der den første dokumenterte boblevinen ble laget i 1544. Vi smaker Blanquette de Limoux og Crémant de Limoux og hører om tradisjonell metode og lagring på bunnfall.
Lunsj på Bachus i Limoux – spesialisert på kjøttretter. Ved behov for vegetarisk alternativ tilpasser vi restaurantvalget. Vinene velges med utgangspunkt i regionens produsenter.
Etter lunsj kjører vi til Carcassonne la Cité – befestet middelalderby med doble bymurer og 52 tårn, på UNESCOs verdensarvliste. Besøket skjer utenfor høysesong, med tid på egen hånd innenfor bymurene.
Middag hjemme i hagen med vin fra regionen.

Dag 3: Narbonne og Corbières
Fransk frokost.
Vi reiser til Narbonne og besøker Les Halles, den historiske mathallen i sentrum – etablert i 1901, åpen 365 dager i året, flere ganger omtalt som en av Frankrikes beste markeder.
Lunsj på Chez Bebelle, kjent for sin åpne bestillingsform der bestillingene ropes til slutteren i hallen. Vi kombinerer lunsjen med vin fra området. Tid til å se mer av byen, blant annet Canal de Robine og katedralen Saint-Just-et-Saint-Pasteur.
Etter lunsj kjører vi til Vins de Fontfroide i Corbières for omvisning og smaking. Vi møter Laure de Chevron Villette, som har ledet eiendommen siden 2004, og smaker viner fra appellasjonen Corbières.
Retur til villaen og egentid. Middag hjemme med vin fra området.

Dag 4: La Livinière og Minerve
Fransk frokost.
Vi besøker Domaine de la Senche i La Livinière – familieeid, økologisk gård drevet av Tove og Arnstein Hernes. Omvisning i vinmarkene og kjelleren, deretter tre-retters lunsj i vinmarkene (ved nedbør i vinkjelleren). Mat og service fra restaurant Les Meulières. Vin fra Domaine de la Senche – Tove og Arnstein deltar under lunsjen.
Etter lunsj kan de som ønsker returnere til eiendommen for egentid. De som vil se mer, blir med til Minerve – middelalderlandsby på klippekanten, klassifisert som en av Les Plus Beaux Villages de France.
Avslutningsmiddag på Lo Cagarol i den runde landsbyen Aigne. Vinene tilpasses kveldens meny.

Dag 5: Avreise
Fransk frokost. Formiddagen er til fri disposisjon – rolig morgen i huset, spasertur i landsbyen, eller tennis og padel i nærheten.
Vi reiser samlet fra eiendommen med transfer til Toulouse lufthavn. Andre flyplasser og flyvninger kan avtales i god tid. Forlengelse av oppholdet kan være mulig ved avtale.
$program_no$,
  program_en = $program_en$
Day 1: Arrival
Arrival at Toulouse airport. We collect you and drive to our property in Minervois. Pick-up from other airports can be arranged in good time.
Welcome drinks and introductions, with a brief overview of the days ahead.
Dinner at En Bonne Compagnie in Homps – a restaurant on the Canal du Midi with terrace seating along the canal. French cuisine focused on local produce. Wines chosen to match the menu.

Day 2: Limoux and Carcassonne
French breakfast.
We travel to Limoux and visit Famille Antech, where we meet Françoise Antech, fifth-generation winemaker. We learn about Limoux as the historic home of sparkling wine – where the first documented bubbly was made in 1544 – and taste Blanquette and Crémant de Limoux.
Lunch at Bachus in Limoux, specialising in meat dishes. Vegetarian alternatives can be arranged. Wines from regional producers.
After lunch we visit Carcassonne la Cité – a fortified medieval city with double walls and 52 towers, UNESCO World Heritage. Time to explore the citadel at your own pace, outside peak season.
Dinner at home in the garden with regional wines.

Day 3: Narbonne and Corbières
French breakfast.
We visit Les Halles in Narbonne – the historic covered market, open 365 days a year and often ranked among the finest in France.
Lunch at Chez Bebelle in the market hall, combined with local wines. Time to explore the city, including the Canal de Robine and Saint-Just-et-Saint-Pasteur cathedral.
Afternoon visit to Vins de Fontfroide in Corbières for a tour and tasting with Laure de Chevron Villette.
Return to the villa and free time. Dinner at home with regional wines.

Day 4: La Livinière and Minerve
French breakfast.
Visit to Domaine de la Senche in La Livinière – organic family estate run by Tove and Arnstein Hernes. Tour of vineyards and cellar, followed by a three-course lunch among the vines (cellar if weather requires). Wines from the domain; Tove and Arnstein join us for lunch.
After lunch, optional return to the villa or excursion to Minerve – a medieval village perched on a cliff, one of Les Plus Beaux Villages de France.
Farewell dinner at Lo Cagarol in the round village of Aigne.

Day 5: Departure
French breakfast. Morning at leisure – relax at the house, stroll through the village, or use the local tennis and padel courts.
Group transfer from the property to Toulouse airport. Other airports and flights can be arranged. Extension of stay may be possible by prior agreement.
$program_en$,
  updated_at = now()
where slug = 'vin-vingarder-minervois';
