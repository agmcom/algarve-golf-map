export type ShopType = 'retail' | 'pro_shop' | 'rental' | 'fitting'

export interface Shop {
  id: string
  name: string
  short_name: string
  type: ShopType
  town: string
  lng: number
  lat: number
  brands: string[]
  course_id?: string   // linked course (pro_shop or on-site)
}

export const SHOPS: Shop[] = [
  {
    id: 'vilamoura-pro-shop',
    name: 'Dom Pedro Victoria Pro Shop',
    short_name: 'Victoria Pro Shop',
    type: 'pro_shop',
    town: 'Vilamoura',
    lng: -8.122, lat: 37.094,
    brands: ['Titleist', 'FootJoy', 'Callaway'],
    course_id: 'vilamoura-victoria',
  },
  {
    id: 'golf-galaxy-algarve',
    name: 'Golf Galaxy Algarve',
    short_name: 'Golf Galaxy',
    type: 'retail',
    town: 'Albufeira',
    lng: -8.246, lat: 37.093,
    brands: ['TaylorMade', 'Titleist', 'Ping', 'Callaway', 'Cobra'],
  },
  {
    id: 'faro-fitting',
    name: 'Algarve Golf Fitting Studio',
    short_name: 'Golf Fitting Studio',
    type: 'fitting',
    town: 'Faro',
    lng: -7.942, lat: 37.019,
    brands: ['TaylorMade', 'Ping', 'Titleist'],
  },
  {
    id: 'lagos-rental',
    name: 'West Algarve Golf Rental',
    short_name: 'Golf Rental Lagos',
    type: 'rental',
    town: 'Lagos',
    lng: -8.676, lat: 37.107,
    brands: ['Callaway', 'TaylorMade'],
  },
  {
    id: 'qdl-pro-shop',
    name: 'Quinta do Lago Pro Shop',
    short_name: 'Q. do Lago Pro Shop',
    type: 'pro_shop',
    town: 'Almancil',
    lng: -8.020, lat: 37.011,
    brands: ['FootJoy', 'Titleist', 'Nike Golf'],
    course_id: 'qdl-south',
  },
  {
    id: 'portimao-retail',
    name: 'Golf Center Portimão',
    short_name: 'Golf Center',
    type: 'retail',
    town: 'Portimão',
    lng: -8.538, lat: 37.137,
    brands: ['Ping', 'Cobra', 'Wilson', 'Srixon'],
  },
]
