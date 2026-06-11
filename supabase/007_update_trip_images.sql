-- Oppdater reisebilder til lokale filer i /public/images/reiser/
-- Alle hovedbilder og galleribilder er unike på tvers av nettstedet (se lib/image-registry.ts)

update trips set
  image_url = '/images/reiser/la%20liviniere.webp',
  image_urls = array[
    '/images/reiser/la%20liviniere.webp',
    '/images/reiser/fontfroide.jpeg'
  ],
  updated_at = now()
where slug = 'vin-vingarder-minervois';

update trips set
  image_url = '/images/reiser/mat.jpg',
  image_urls = array[
    '/images/reiser/mat.jpg',
    '/images/reiser/halles.jpg'
  ],
  updated_at = now()
where slug = 'smak-languedoc';

update trips set
  image_url = '/images/reiser/peyre.jpg',
  image_urls = array[
    '/images/reiser/peyre.jpg',
    '/images/reiser/deux%20riviere%201.webp'
  ],
  updated_at = now()
where slug = 'aktiv-gorges-herault';

update trips set
  image_url = '/images/reiser/IMG_1611.webp',
  image_urls = array[
    '/images/reiser/IMG_1611.webp',
    '/images/reiser/IMG_1592.webp'
  ],
  updated_at = now()
where slug = 'vindrueplukking-minervois';
