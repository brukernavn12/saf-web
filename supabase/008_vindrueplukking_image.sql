-- Vindrueplukking i Minervois: unikt høst-/vingårdsbilde (ikke delt med andre reiser eller forsiden)
update trips set
  image_url = '/images/reiser/IMG_1611.webp',
  image_urls = array[
    '/images/reiser/IMG_1611.webp',
    '/images/reiser/IMG_1592.webp'
  ],
  updated_at = now()
where slug = 'vindrueplukking-minervois';
