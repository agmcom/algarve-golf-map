// Types mirroring the database schema.
// When Supabase is connected, replace with generated types:
// npx supabase gen types typescript --project-id <id> > src/types/supabase.ts

export type AlgarveRegion    = 'west' | 'central' | 'east'

// ---- Airports ----

export interface Airport {
  id: string
  code: string        // IATA: FAO, LIS, SVQ
  name: string
  city: string
  country: string
  lat: number
  lng: number
  road_factor: number
  avg_speed_kmh: number
  active: boolean
}
export type CourseDifficulty = 'easy' | 'moderate' | 'challenging'
export type PriceTimeSlot    = 'early_bird' | 'standard' | 'twilight' | 'sunset'
export type PriceRateType    = 'visitor' | 'resident'


// ---- Zones ----

export interface Zone {
  id: string
  name: string
  slug: string
  center_lat: number
  center_lng: number
  booking_url: string | null
  airbnb_url: string | null
  created_at: string
}


// ---- Courses ----

export interface Course {
  id: string
  name: string
  slug: string
  blurb: string | null
  description: string | null

  lat: number
  lng: number
  address: string | null
  town: string
  region: AlgarveRegion

  holes: number
  par: number | null
  length_meters: number | null
  difficulty: CourseDifficulty | null
  slope_rating: number | null
  course_type: string | null
  designer: string | null
  year_opened: number | null
  handicap_required_men: number | null
  handicap_required_ladies: number | null

  has_own_hotel: boolean
  onsite_hotel_id: string | null   // FK → hotels.id

  driving_range: boolean
  putting_green: boolean
  golf_academy: boolean
  caddie_service: boolean
  pro_shop: boolean
  restaurant: boolean
  dress_code: string | null
  languages: readonly string[]

  offers_rental: boolean
  rental_brands: readonly string[]
  rental_price_per_round: number | null

  price_from: number | null
  website: string | null
  phone: string | null
  email: string | null
  booking_url: string | null

  tags: readonly string[]
  amenities: readonly string[]
  featured: boolean
  active: boolean
  rating: number | null
  review_count: number

  course_map_url: string | null

  created_at: string
  updated_at: string

  // Joined
  photos?: CoursePhoto[]
  prices?: CoursePrice[]
  pro_shop_detail?: Shop       // linked pro shop
  academy?: Academy            // linked academy
  onsite_hotel?: Hotel         // on-site hotel if has_own_hotel
}

export interface CoursePrice {
  id: string
  course_id: string
  month: number          // 1–12
  time_slot: PriceTimeSlot
  holes: number
  rate_type: PriceRateType
  price_eur: number
  buggy_price: number | null
  buggy_included: boolean
  notes: string | null
}

export interface CoursePhoto {
  id: string
  course_id: string
  url: string
  alt: string | null
  position: number
  is_hero: boolean
  created_at: string
}


// ---- Hotels ----

export interface Hotel {
  id: string
  name: string
  slug: string
  description: string | null

  lat: number
  lng: number
  address: string | null
  town: string
  region: AlgarveRegion
  zone_id: string | null

  stars: number | null
  rooms: number | null
  price_from: number | null
  onsite: boolean

  // Golf services
  has_golf_package: boolean
  golf_package_desc: string | null
  has_shuttle: boolean
  shuttle_courses: readonly string[]
  club_storage: boolean
  club_cleaning: boolean
  drying_room: boolean
  early_breakfast: boolean
  late_checkout: boolean
  offers_rental: boolean

  website: string | null
  phone: string | null
  booking_url: string | null

  amenities: readonly string[]
  active: boolean
  featured: boolean
  rating: number | null
  google_rating?: number | null
  review_count: number

  created_at: string
  updated_at: string

  // Joined
  photos?: HotelPhoto[]
  zone?: Zone
  partner_courses?: Course[]
}

export interface HotelPhoto {
  id: string
  hotel_id: string
  url: string
  alt: string | null
  position: number
  is_hero: boolean
  created_at: string
}

export interface HotelCourse {
  hotel_id: string
  course_id: string
  discount_percent: number | null
  notes: string | null
}


// ---- Shops ----

export interface Shop {
  id: string
  name: string
  slug: string | null
  description: string | null

  lat: number
  lng: number
  address: string | null
  town: string
  region: AlgarveRegion

  course_id: string | null      // linked course (pro_shop or on-site rental)

  brands: string[]
  services: string[]

  offers_rental: boolean
  rental_price_per_day: number | null
  rental_set_types: string[]
  delivery_to_course: boolean
  rental_pickup_location: string | null
  rental_delivery_areas: string[]
  rental_price_notes: string | null

  website: string | null
  phone: string | null
  email: string | null
  active: boolean

  opening_hours: string | null
  google_maps_url: string | null
  instagram_url: string | null
  facebook_url: string | null
  parking: string | null

  languages_spoken: string[]
  accepts_trade_in: boolean | null
  fitting_technology: string | null

  photo_url: string | null
  photo_alt: string | null

  created_at: string
  updated_at: string

  // Joined
  course?: Course
}


// ---- Academies ----

export interface Academy {
  id: string
  name: string
  slug: string
  description: string | null

  lat: number
  lng: number
  address: string | null
  town: string
  region: AlgarveRegion

  course_id: string | null      // linked course (if on-site)

  head_pro: string | null
  languages: readonly string[]

  private_lessons: boolean
  group_lessons: boolean
  clinics: boolean
  video_analysis: boolean

  price_per_hour: number | null
  price_per_day: number | null

  short_game_area: boolean
  indoor_facility: boolean

  website: string | null
  phone: string | null
  booking_url: string | null
  active: boolean

  created_at: string
  updated_at: string

  // Joined
  course?: Course
}


// ---- Trips ----

export interface Trip {
  id: string
  user_id: string | null
  name: string
  start_date: string | null
  end_date: string | null
  players: number
  budget_eur: number | null
  notes: string | null
  share_token: string
  is_public: boolean
  created_at: string
  updated_at: string

  // Joined
  days?: TripDay[]
}

export interface TripDay {
  id: string
  trip_id: string
  date: string | null
  position: number
  course_id: string | null
  hotel_id: string | null
  notes: string | null
  created_at: string

  // Joined
  course?: Course
  hotel?: Hotel
}
