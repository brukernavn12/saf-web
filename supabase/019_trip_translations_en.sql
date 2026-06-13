-- English trip content + localized list fields (run in Supabase SQL Editor)
-- Enables complete NO/EN language switching for trip cards and detail pages.

alter table trips
  add column if not exists includes_en text[],
  add column if not exists excludes_en text[],
  add column if not exists itinerary_en text[],
  add column if not exists price_info_en text;

-- Vinreise med Anne Fredrikstad
update trips set
  title_en = 'Wine trip with Anne Fredrikstad',
  tagline_en = 'We are repeating our 2026 success – five days among the people behind the wines in the heart of Languedoc.',
  description_en = $desc$
This is not a wine trip where you sit in a classroom learning about grapes. This is a journey where you meet Françoise Antech – fifth-generation winemaker in Limoux, where France's first sparkling wine was made in 1544. Where you lunch among the vines with Tove and Arnstein at Domaine de la Senche in La Livinière. Where you walk inside Carcassonne la Cité on a May day without tourist buses, and end the evening in the garden with wine from the neighbour's vineyard.

Anne Fredrikstad leads the wine sessions. We lead the rest. The result is five days where wine, food and people weave naturally together – without performance, without hurry.

«Wine should be enjoyed – not just drunk.» That is Anne's motto. We agree.
$desc$,
  includes_en = array[
    '4 nights at L''Hirondelle or Villa Belle in Minervois',
    'All meals including drinks',
    'Guided vineyard visits and tastings',
    'Local transport',
    'Transfer to/from Toulouse airport',
    'Norwegian hosts with 18 years of local knowledge'
  ],
  excludes_en = array[
    'Flights to/from France',
    'Travel insurance',
    'Personal expenses'
  ]
where slug = 'vin-vingarder-minervois';

-- Mat og vin med Ina
update trips set
  title_en = 'Food and wine in Languedoc with Ina',
  tagline_en = 'Five days in the heart of southern France – with a TV chef as your guide.',
  description_en = $desc$
Ina Therese Lindvik Nornes – known as Chez Ina and a TV chef on Matkanalen – has a passion for France that is hard to hide. Now she brings that passion to Languedoc, in collaboration with The Taste of France.

Five days where food and wine are not entertainment, but the whole point. We visit markets, meet producers, cook and eat well – in authentic settings no hotel lobby can compete with.

Ina shares her knowledge of ingredients, techniques and the French kitchen. We share our local knowledge of the vineyards, restaurants and people behind them. The result is a trip you come home from with more than memories.
$desc$,
  includes_en = array[
    '4 nights at L''Hirondelle or Villa Belle in Minervois',
    'All meals including drinks',
    'Cooking course with Ina',
    'Market visits and producer tastings',
    'All local transport',
    'Transfer to/from Toulouse airport'
  ],
  excludes_en = array[
    'Flights to/from France',
    'Travel insurance',
    'Personal expenses'
  ]
where slug = 'matreise-med-ina';

-- Signaturukesprogram
update trips set
  title_en = 'The Taste of Languedoc – week programme',
  tagline_en = 'Always small groups, max 7 guests. Everything included.',
  description_en = $desc$
This is our signature trip. A full week in Minervois where you do not need to think about a thing – we have arranged everything.

You stay at Villa Belle or L'Hirondelle, two large stone houses from the early 1800s restored with modern comfort. You eat breakfast, lunch and dinner with wine included. You are collected at the airport and driven back on departure.

The group is never larger than 7 people. That is not by chance – it is the point.
$desc$,
  includes_en = array[
    'Airport or train station pick-up and drop-off',
    'Accommodation at Villa Belle or L''Hirondelle',
    'All meals including all drinks',
    'All excursions and activities in the programme',
    'Transport throughout your stay',
    'Norwegian hosts with 18 years of local knowledge'
  ],
  excludes_en = array[
    'Flights',
    'Single room supplement',
    'Extra activities outside the programme',
    'Travel insurance'
  ],
  itinerary_en = array[
    'Day 1: Arrival and welcome dinner with French tapas and local wine',
    'Day 2: Carcassonne (UNESCO World Heritage) and Cabrespine cave',
    'Day 3: Vineyard visit in Minervois and Cru La Livinière, lunch among the vines, prehistoric dolmen',
    'Day 4: Award-winning olive farm, lunch by the Canal du Midi, gentle canal boat trip',
    'Day 5: Market in Olonzac, cooking course with local produce, shared meal',
    'Day 6: Narbonne (cathedral, Via Domitia, Les Halles), Fontfroide Abbey',
    'Day 7: Minerve, one of France''s most beautiful villages, farewell dinner',
    'Day 8: Departure after breakfast'
  ]
where slug = 'smaken-av-languedoc-ukesprogram';

-- Krim & Languedoc
update trips set
  title_en = 'Crime fiction & Languedoc – a week for writers',
  tagline_en = 'Late evenings, good wine and stories that cannot bear daylight.',
  description_en = $desc$
Agnes Matre and Geir Tangen – two of Norway's leading crime writers and connoisseurs of the dark and the beautiful – invite their colleagues to Languedoc in May 2027. This is not an ordinary trip. It is five days where the daylight belongs to southern France – markets, vineyards, medieval towns and warm stone – and the evenings belong to the writers themselves. We read to each other. We read each other's work. We talk about what we actually do. The food is good. The wine is better. The nights are long. Elisabeth and Morten host and guide. Agnes and Geir are with you throughout.
$desc$,
  includes_en = array[
    '4 nights at L''Hirondelle or Villa Belle',
    'All meals including drinks',
    'All local transport',
    'Two guides and hosts throughout',
    'Cultural excursions tailored to the group'
  ],
  excludes_en = array[
    'Flights',
    'Travel insurance',
    '5th night (NOK 5,000 supplement if desired)'
  ]
where slug = 'krim-og-languedoc-2027';

-- Vindrueplukkeopplevelse
update trips set
  title_en = 'Grape harvest experience',
  tagline_en = 'Join the harvest in the heart of southern France''s wine country.',
  description_en = $desc$
Now you can join a special trip where we take part in the harvest in the heart of southern France's wine landscape. The group is small, and we emphasise a safe, well-organised experience.

Picking takes place from around 8 am to noon on weekdays – the day starts with coffee and croissant before we head into the vineyard. Lunch is social with time to talk, and along the way you can join us in the cellar to see what happens to the grapes after harvest.

Outside picking there is time to relax, swim, read, go on excursions and taste wine. We work with selected producers, including Domaine de la Senche and Famille Antech.

The harvest follows ripeness and weather – the grapes decide.
$desc$,
  includes_en = array[
    'Accommodation in the heart of Minervois',
    'Meals',
    'Access to producers and cellars',
    'Expert content',
    'Organisation and hosting'
  ],
  excludes_en = array[
    'Flights to/from France',
    'Transport to Olonzac',
    'Travel insurance',
    'Personal expenses'
  ],
  price_info_en = '3 nights shared double room: NOK 4,500 | 4 nights: NOK 5,450 | 5 nights: NOK 6,400. Single room: 3 nights NOK 6,750 | 4 nights NOK 8,450 | 5 nights NOK 10,150'
where slug = 'vindrueplukkeopplevelse';

-- Legacy / catalogue trips (if still active)
update trips set
  title_en = 'Taste your way through Languedoc',
  tagline_en = 'A week of food, wine and people – from coast to inland.',
  description_en = 'Seven days tasting our way through Languedoc: markets, cheese, olive oil, wine and everyday food you will not find in guidebooks. The trip combines culinary highlights with quiet afternoons and time to get to know the region.'
where slug = 'smak-languedoc';

update trips set
  title_en = 'Active in Gorges du Hérault',
  tagline_en = 'Hiking, swimming and nature in one of southern France''s most beautiful landscapes.',
  description_en = 'Five active days in and around Gorges du Hérault. We hike trails with views, swim in the river and end the days with simple, good meals. The pace is moderate – you do not need to be super fit, but a reasonable level of fitness helps.'
where slug = 'aktiv-gorges-herault';

update trips set
  title_en = 'Grape picking in Minervois',
  tagline_en = 'Experience autumn in the vineyard – hand work, community and true harvest atmosphere.',
  description_en = 'Seven days during the vendange in Minervois. You pick alongside us and our friends among the vineyards, learn about the grapes and the season, and experience village life at its most alive. Meet in Olonzac.'
where slug = 'vindrueplukking-minervois';
