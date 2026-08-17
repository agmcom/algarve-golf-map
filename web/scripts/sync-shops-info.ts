/**
 * Applies researched shop info (description, brands, services, contact,
 * opening hours, social, photos, etc.) to Supabase.
 * Data verified from official shop/course websites, Google Maps and
 * Nevada Bob's official site data (2026-08). Mirrors database/update_shops_info.sql —
 * see that file for source notes and flagged conflicts left unresolved.
 *
 * Usage:
 *   npx tsx scripts/sync-shops-info.ts
 *   npx tsx scripts/sync-shops-info.ts --dry-run
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars. Run:\n  export $(cat .env.local | grep -v ^# | xargs) && npx tsx scripts/sync-shops-info.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const dryRun = process.argv.includes('--dry-run')

const NBG_BRANDS = [
  'Callaway', 'Cleveland Golf', 'Honma', 'L.A.B. Golf', 'Mizuno', 'Ping', 'Scotty Cameron',
  'Srixon', 'TaylorMade', 'Titleist', 'XXIO', 'Cobra', 'Odyssey', 'Adidas', 'Alberto Golf',
  'Bushnell Golf', 'Calvin Klein Golf', 'FootJoy', 'Galvin Green', 'Garmin', 'Green Lamb',
  'Herschel', 'JuCad', 'JuStar', 'Lacoste', 'Matize', 'Masters', 'Meyer', 'Motocaddy',
  'New Balance', 'Nivo', 'OGIO', 'Polo Golf Ralph Lauren', 'PowaKaddy', 'Skechers',
  'Sun Mountain', 'TravisMathew', 'Tuc', 'Under Armour', 'Wellputt', 'Wilson', 'Yeti',
]

const NBG_SOCIAL = {
  instagram_url: 'https://instagram.com/nevadabobsgolf/',
  facebook_url: 'https://facebook.com/nevadabobsportugal',
}

type ShopUpdate = Record<string, unknown>

const UPDATES: { slug: string; data: ShopUpdate }[] = [
  {
    slug: '18-store-golf-shop',
    data: {
      description: 'Golf retail shop and club-rental service in Parchal, Lagoa, selling new and used clubs, equipment and accessories, with an in-store golf simulator and free delivery/collection for club rentals across the Algarve.',
      brands: ['TaylorMade', 'Callaway', 'Srixon', 'Cleveland', 'Titleist', 'Wilson'],
      services: ['rental'],
      email: 'info@18store.pt',
      opening_hours: 'Mon–Sat 9:00–19:00',
      instagram_url: 'https://instagram.com/18store.pt',
      facebook_url: 'https://facebook.com/18Store.pt',
      parking: 'Plenty of parking available',
    },
  },
  {
    slug: 'alvor-golf-shop',
    data: {
      description: 'Golf store in Alvor operating since 2010, offering equipment sales, club and trolley rental, club repairs, and golf course booking assistance across the Algarve and southern Spain.',
      brands: ['TaylorMade'],
      services: ['rental', 'repair'],
      rental_price_per_day: 25,
      rental_set_types: ['full_set'],
      email: 'alvorgolf@hotmail.com',
      opening_hours: 'Mon–Fri 9:30–13:00 & 15:00–18:30; Sat 9:30–13:00; Sun closed',
      instagram_url: 'https://instagram.com/alvorgolfshop',
      facebook_url: 'https://facebook.com/alvorgolfshop',
    },
  },
  {
    slug: 'benamor-pro-shop',
    data: {
      description: 'Pro shop within the clubhouse at Benamor Golf Course, a Sir Henry Cotton-designed course that opened in 2000.',
      email: 'secretaria@benamorgolf.com',
      facebook_url: 'https://facebook.com/benamorgolfe',
    },
  },
  {
    slug: 'blue-sky-golf-shop',
    data: {
      description: 'Golf retail and club-rental business based in the Loulé industrial estate, selling new and used equipment from major brands. Also operates a large club-rental fleet with free delivery across the Algarve, and a co-located indoor golf simulator centre using TrackMan technology.',
      brands: ['TaylorMade', 'Callaway', 'Wilson', 'Srixon', 'Powakaddy', 'Cobra', 'FootJoy', 'Ping', 'Titleist', 'XXIO'],
      email: 'info@blueskygolfshop.com',
      facebook_url: 'https://facebook.com/blueskygolfshop',
      instagram_url: 'https://instagram.com/blueskygolfrental',
      fitting_technology: 'TrackMan',
    },
  },
  {
    slug: 'carvoeiro-golf-shop',
    data: {
      description: 'Golf equipment and clothing retailer in Carvoeiro offering sales, custom club building, club repairs (regripping/reshafting), a dedicated fitting room, and club and electric trolley rental.',
      brands: ['Nike', 'Puma', 'Adidas', 'Ashworth', 'Wilson', 'FootJoy', 'TaylorMade', 'Callaway', 'Srixon'],
      services: ['repair', 'custom_fitting', 'rental'],
      opening_hours: 'Mon–Fri 10:00–13:00 & 14:30–18:00; Sat 10:00–13:00; Sun closed',
      facebook_url: 'https://facebook.com/p/Carvoeiro-golf-shop-100054526716443/',
    },
  },
  {
    slug: 'golfers-paradise',
    data: {
      description: 'Two-floor golf retail store in Almancil, roughly equidistant between Vilamoura and Quinta do Lago, selling clubs, balls, bags, clothing, shoes and accessories from over 50 international brands. Offers a "Shop & Go" home delivery service and personalised product embroidery.',
      brands: ['PXG', 'Callaway', 'TaylorMade', 'Titleist', 'Bettinardi', 'Bridgestone', 'Peter Millar', 'J.Lindeberg', 'Daily Sports', 'Black Clover', 'ECCO', 'Oakley', 'Garmin', 'CaddyTalk', 'BIG MAX'],
      email: 'info@golfersparadise.pt',
      opening_hours: 'Mon–Sat 9:00–19:00; Sun closed',
      facebook_url: 'https://facebook.com/GolfersParaiso/',
    },
  },
  {
    slug: 'lagos-golf-shop',
    data: {
      description: 'Golf retail and repair shop in Lagos operating since 2004, selling shoes, clothing, bags, balls, clubs and accessories, plus club and trolley repair (regripping, reshafting, lie/loft adjustment). Also operates a club-rental service delivering to accommodation across the Algarve.',
      services: ['repair', 'rental'],
      rental_price_per_day: 45,
      email: 'info@lagosgolfshop.com',
      opening_hours: 'Mon–Fri 9:30–13:00 & 14:00–17:00 (Nov: mornings only); Sat–Sun closed',
    },
  },
  {
    slug: 'monte-rei-pro-shop',
    data: {
      description: 'Pro shop within the clubhouse at Monte Rei Golf & Country Club, offering golf clubs, balls and equipment alongside branded apparel and footwear, with custom club-fitting appointments available.',
      brands: ['Titleist', 'Ping', 'PXG'],
      email: 'golf@monterei.com',
      opening_hours: '07:00–18:00 (Summer: 07:00–20:00)',
      facebook_url: 'https://facebook.com/montereiresort/',
    },
  },
  {
    slug: 'old-course-pro-shop',
    data: {
      description: 'Boutique pro shop within the clubhouse at the Old Course Vilamoura, offering a curated selection of premium golf brands, apparel and accessories.',
      email: 'booking@oldcoursevilamoura.com',
      website: 'https://www.oldcoursevilamoura.com',
      facebook_url: 'https://facebook.com/oldcoursevilamoura/',
      instagram_url: 'https://instagram.com/oldcoursevilamoura/',
    },
  },
  {
    slug: 'pinheiros-altos-pro-shop',
    data: {
      description: 'Golf pro shop within the clubhouse at Pinheiros Altos Golf Resort, offering designer golf apparel and branded golf equipment; the golf reception desk is located inside the shop.',
      brands: ['Ralph Lauren', 'Titleist'],
      facebook_url: 'https://facebook.com/pinheirosaltos/',
    },
  },
  {
    slug: 'salgados-golf-shop',
    data: {
      description: 'Pro shop in the clubhouse at Salgados Golf Course, offering golf accessories, equipment and apparel including golf balls, tees, towels, hats and performance clothing.',
      brands: ['Callaway', 'Ping', 'Titleist', 'Nike', 'Ecco'],
      email: 'info@salgadosgolf.com',
      facebook_url: 'https://facebook.com/SalgadosGolfcourse',
      instagram_url: 'https://instagram.com/salgadosgolfclub/',
      photo_url: 'https://salgadosgolf.com/wp-content/uploads/2025/04/1-1024x576.jpg',
      photo_alt: 'Salgados Golf Shop',
    },
  },
  {
    slug: 'sophies-golf-shop',
    data: {
      description: 'The oldest off-course golf shop in the Algarve, open since 1997, specialising in golf apparel and shoes for men and women with frequently refreshed stock.',
      brands: ['Adidas', 'Ping', 'Lucky in Love', 'Tail', 'Ecco', 'Puma', 'Swing Out Sister Golf', 'Par 69', 'FootJoy', 'J.Lindeberg', 'Daily Sports', 'Röhnisch', 'Green Lamb'],
      services: ['custom_fitting'],
      phone: '+351282799711',
      email: 'info@sophiesgolfshop.com',
      opening_hours: 'Mon–Fri 10:00–18:00; Sat 10:00–17:00 (closed in August); Sun closed',
      facebook_url: 'https://facebook.com/sophiesgolfshop/',
      instagram_url: 'https://instagram.com/sophiesgolf/',
    },
  },
  {
    slug: 'vale-do-lobo-golf-shop',
    data: {
      description: 'On-site pro shop in the Clubhouse at Vale do Lobo, relaunched in January 2024, offering a wide selection of equipment, clothing, shoes and accessories for golfers of all levels.',
      brands: ['J.Lindeberg', 'Hugo Boss', 'Lacoste', 'Ralph Lauren', 'Peter Millar', 'Green Lamb', 'Ecco', 'FootJoy', 'Under Armour', 'Tail', 'Calvin Klein'],
      phone: '+351289353411',
      email: 'golfshop@vdl.pt',
      opening_hours: 'Daily 06:30–18:30 (Summer: 06:30–19:00)',
      instagram_url: 'https://instagram.com/vale.do.lobo/',
      photo_url: 'https://www.valedolobo.com/wp-content/uploads/2024/06/20260410_GolfShopVDL_003_FHD.jpg',
      photo_alt: 'Vale do Lobo Golf Shop interior',
    },
  },
  // Nevada Bob's — shared brand catalogue + social, plus per-location detail
  {
    slug: 'nevada-bobs-almancil',
    data: {
      brands: NBG_BRANDS,
      ...NBG_SOCIAL,
      description: 'Flagship Nevada Bob\'s Golf store in Almancil, home to the company\'s dedicated TrackMan 4 "Pro Fitting" studio — a certified club-fitting facility distinct from the brand\'s smaller on-course shops.',
      services: ['repair', 'custom_fitting'],
      fitting_technology: 'TrackMan 4',
      email: 'quarteira@nevadabobs.pt',
      opening_hours: 'Mon–Fri 09:00–18:00; Sat 09:00–13:00 & 14:00–18:00; Sun closed',
      google_maps_url: 'https://maps.app.goo.gl/1SiFJx4tywrjYVRs5',
      photo_url: 'https://nevadabobs.pt/assets/almancil-DH88aOXi.jpeg',
      photo_alt: 'Nevada Bob\'s Golf Almancil storefront',
    },
  },
  {
    slug: 'nevada-bobs-alto-golf',
    data: {
      brands: NBG_BRANDS,
      ...NBG_SOCIAL,
      services: ['repair'],
      email: 'alto.golf@nevadaobs.pt', // published exactly as-is on nevadabobs.pt (likely a typo on their end)
      opening_hours: 'Hours follow the host golf course',
      google_maps_url: 'https://maps.app.goo.gl/pwuG2ERRziESsdC86',
      photo_url: 'https://nevadabobs.pt/assets/alto-golf-CSX7_FTv.jpeg',
      photo_alt: 'Nevada Bob\'s Golf at Alto Golf',
    },
  },
  {
    slug: 'nevada-bobs-gramacho',
    data: {
      brands: NBG_BRANDS,
      ...NBG_SOCIAL,
      services: ['repair'],
      email: 'gramacho@nevadabobs.pt',
      opening_hours: 'Hours follow the host golf course',
      google_maps_url: 'https://maps.app.goo.gl/8ZYxBG75voSsuoEv9',
      photo_url: 'https://nevadabobs.pt/assets/gramacho-C7v4LcrS.jpeg',
      photo_alt: 'Nevada Bob\'s Golf at Gramacho',
    },
  },
  {
    slug: 'nevada-bobs-quinta-do-lago',
    data: {
      brands: NBG_BRANDS,
      ...NBG_SOCIAL,
      services: ['repair', 'custom_fitting'],
      email: 'quintadolago@nevadabobs.pt',
      opening_hours: 'Mon–Fri 09:00–13:00 & 14:00–18:00; Sat–Sun closed',
      google_maps_url: 'https://maps.app.goo.gl/YvM4CoHeXVSkuLTg6',
      photo_url: 'https://nevadabobs.pt/assets/quinta-do-lago-7c_lg0-0.jpeg',
      photo_alt: 'Nevada Bob\'s Golf Quinta do Lago storefront',
    },
  },
  {
    slug: 'nevada-bobs-silves',
    data: {
      brands: NBG_BRANDS,
      ...NBG_SOCIAL,
      phone: '+351282240077', // corrected to match current official store locator
      services: ['repair'],
      email: 'silves@nevadabobs.pt',
      opening_hours: 'Hours follow the host golf course',
      google_maps_url: 'https://maps.app.goo.gl/oY2Rz8K1B9yMHXN98',
      photo_url: 'https://nevadabobs.pt/assets/silves-golf-C7U5yA39.jpeg',
      photo_alt: 'Nevada Bob\'s Golf at Silves Golf',
    },
  },
  {
    slug: 'nevada-bobs-vale-da-pinta',
    data: {
      brands: NBG_BRANDS,
      ...NBG_SOCIAL,
      services: ['repair'],
      email: 'vale.pinta@nevadabobs.pt',
      opening_hours: 'Hours follow the host golf course',
      google_maps_url: 'https://maps.app.goo.gl/pNcgbUDYMQkk9S666',
      photo_url: 'https://nevadabobs.pt/assets/vale-da-pinta-B_Cl6-xB.jpeg',
      photo_alt: 'Nevada Bob\'s Golf at Vale da Pinta',
    },
  },
  {
    slug: 'nevada-bobs-vila-sol',
    data: {
      brands: NBG_BRANDS,
      ...NBG_SOCIAL,
      services: ['repair'],
      email: 'vila.sol@nevadabobs.pt',
      opening_hours: 'Hours follow the host golf course',
      google_maps_url: 'https://maps.app.goo.gl/dVCtjo1TTtZrQeeR9',
      photo_url: 'https://nevadabobs.pt/assets/vila-sol-ct50xRxR.jpeg',
      photo_alt: 'Nevada Bob\'s Golf at Vila Sol',
    },
  },
  {
    // Kept active — nevadabobs.pt/quinta-da-ria-golf-course/ exists and Quinta
    // da Ria's own site lists a pro-shop facility — but it didn't appear in the
    // current official store locator, so only brands/social are updated here;
    // phone/email/hours left untouched pending manual confirmation.
    slug: 'nevada-bobs-quinta-da-ria',
    data: {
      brands: NBG_BRANDS,
      ...NBG_SOCIAL,
    },
  },
]

async function main() {
  console.log(`${dryRun ? '[DRY RUN] ' : ''}Applying ${UPDATES.length} shop updates...\n`)

  let ok = 0
  let failed = 0

  for (const { slug, data } of UPDATES) {
    if (dryRun) {
      console.log(`Would update ${slug}:`, Object.keys(data).join(', '))
      continue
    }
    const { error } = await supabase.from('shops').update(data).eq('slug', slug)
    if (error) {
      console.error(`✗ ${slug}: ${error.message}`)
      failed++
    } else {
      console.log(`✓ ${slug}`)
      ok++
    }
  }

  if (!dryRun) {
    console.log(`\nDone. ${ok} updated, ${failed} failed.`)
  }
}

main()
