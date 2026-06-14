-- Rydder price_info for vindrueplukke (pipe-separert, for kortvisning «fra kr …»).
-- Detaljpriser vises fra i18n: tripDetail.packagePrice.vindrueplukkeopplevelse

update trips
set
  price_info = '3 netter delt dobbeltrom: kr 4.500 | 4 netter: kr 5.450 | 5 netter: kr 6.400 | Enkeltrom: 3 netter kr 6.750 | 4 netter kr 8.450 | 5 netter kr 10.150',
  price_info_en = '3 nights shared double room: NOK 4,500 | 4 nights: NOK 5,450 | 5 nights: NOK 6,400 | Single room: 3 nights NOK 6,750 | 4 nights NOK 8,450 | 5 nights NOK 10,150',
  updated_at = now()
where slug = 'vindrueplukkeopplevelse';
