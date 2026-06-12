export interface ZoneHotel {
  name: string
  stars: number
  price_from: number
  is_golf_hotel: boolean
  booking_url: string
}

export interface Zone {
  id: string
  name: string
  center: [number, number]   // [lng, lat]
  hotels: ZoneHotel[]
}

export const ZONES: Zone[] = [
  {
    id: 'lagos-west',
    name: 'Lagos / Oeste',
    center: [-8.67, 37.10],
    hotels: [
      { name: 'Palmares Beach House Hotel', stars: 5, price_from: 280, is_golf_hotel: true,  booking_url: 'https://www.booking.com' },
      { name: 'Cascade Wellness Resort',    stars: 5, price_from: 220, is_golf_hotel: false, booking_url: 'https://www.booking.com' },
      { name: 'Vivenda Miranda',            stars: 4, price_from: 160, is_golf_hotel: false, booking_url: 'https://www.booking.com' },
    ],
  },
  {
    id: 'portimao-alvor',
    name: 'Portimão / Alvor',
    center: [-8.54, 37.13],
    hotels: [
      { name: 'Penina Hotel & Golf Resort', stars: 5, price_from: 200, is_golf_hotel: true,  booking_url: 'https://www.booking.com' },
      { name: 'Bela Vista Hotel & Spa',     stars: 5, price_from: 310, is_golf_hotel: false, booking_url: 'https://www.booking.com' },
      { name: 'Vilalara Thalassa Resort',   stars: 5, price_from: 260, is_golf_hotel: false, booking_url: 'https://www.booking.com' },
    ],
  },
  {
    id: 'carvoeiro-lagoa',
    name: 'Carvoeiro / Lagoa',
    center: [-8.47, 37.09],
    hotels: [
      { name: 'Tivoli Carvoeiro',      stars: 5, price_from: 230, is_golf_hotel: false, booking_url: 'https://www.booking.com' },
      { name: 'Monte Santo Resort',    stars: 5, price_from: 190, is_golf_hotel: false, booking_url: 'https://www.booking.com' },
      { name: 'Almanac Carvoeiro',     stars: 5, price_from: 350, is_golf_hotel: false, booking_url: 'https://www.booking.com' },
    ],
  },
  {
    id: 'albufeira',
    name: 'Albufeira',
    center: [-8.25, 37.09],
    hotels: [
      { name: 'Pine Cliffs Residence',    stars: 5, price_from: 320, is_golf_hotel: true,  booking_url: 'https://www.booking.com' },
      { name: 'Salgados Palace Hotel',    stars: 5, price_from: 180, is_golf_hotel: false, booking_url: 'https://www.booking.com' },
      { name: 'Epic Sana Algarve Hotel', stars: 5, price_from: 240, is_golf_hotel: false, booking_url: 'https://www.booking.com' },
    ],
  },
  {
    id: 'vilamoura',
    name: 'Vilamoura / Quarteira',
    center: [-8.12, 37.09],
    hotels: [
      { name: 'Anantara Vilamoura',       stars: 5, price_from: 380, is_golf_hotel: true,  booking_url: 'https://www.booking.com' },
      { name: 'Dom Pedro Golf Resort',    stars: 4, price_from: 160, is_golf_hotel: true,  booking_url: 'https://www.booking.com' },
      { name: 'Hilton Vilamoura',         stars: 5, price_from: 210, is_golf_hotel: false, booking_url: 'https://www.booking.com' },
    ],
  },
  {
    id: 'golden-triangle',
    name: 'Golden Triangle / Almancil',
    center: [-8.02, 37.02],
    hotels: [
      { name: 'Vila Vita Parc',    stars: 5, price_from: 650, is_golf_hotel: true,  booking_url: 'https://www.booking.com' },
      { name: 'Conrad Algarve',    stars: 5, price_from: 480, is_golf_hotel: false, booking_url: 'https://www.booking.com' },
      { name: 'Quinta do Lago',    stars: 5, price_from: 420, is_golf_hotel: true,  booking_url: 'https://www.booking.com' },
    ],
  },
  {
    id: 'faro-olhao',
    name: 'Faro / Olhão',
    center: [-7.93, 37.02],
    hotels: [
      { name: 'Eva Senses Hotel',            stars: 4, price_from: 130, is_golf_hotel: false, booking_url: 'https://www.booking.com' },
      { name: 'Faro Hotel',                  stars: 4, price_from: 110, is_golf_hotel: false, booking_url: 'https://www.booking.com' },
      { name: 'Caza das Laranjeiras',        stars: 4, price_from: 95,  is_golf_hotel: false, booking_url: 'https://www.booking.com' },
    ],
  },
  {
    id: 'tavira-east',
    name: 'Tavira / Este',
    center: [-7.65, 37.13],
    hotels: [
      { name: 'Monte Rei Golf & Country Club', stars: 5, price_from: 390, is_golf_hotel: true,  booking_url: 'https://www.booking.com' },
      { name: 'Convento do Santo António',     stars: 4, price_from: 140, is_golf_hotel: false, booking_url: 'https://www.booking.com' },
      { name: 'Quinta da Lua',                 stars: 4, price_from: 120, is_golf_hotel: false, booking_url: 'https://www.booking.com' },
    ],
  },
]

export function getZoneByName(name: string): Zone | undefined {
  return ZONES.find(z => z.name === name)
}
