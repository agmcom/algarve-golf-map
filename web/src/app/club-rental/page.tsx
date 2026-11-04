import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { getShops } from '@/lib/queries'
import { RENTAL_CHECKED_LABEL, RENTAL_INFO } from '@/lib/club-rental'
import { withSiteName } from '@/lib/seo'
import { PartnerPrompt } from '@/components/PartnerPrompt'

const BASE = 'https://www.algarvegolfmap.com'
const H1 = 'Golf club hire and rental in the Algarve'
const FARO_GUIDE = '/guide/hiring-golf-clubs-at-faro-airport'

export const revalidate = 3600

async function getRentalProviders() {
  const shops = await getShops()
  return shops.filter(s => s.offers_rental && !(s.slug && RENTAL_INFO[s.slug]?.hidden))
}

export async function generateMetadata(): Promise<Metadata> {
  const url = `${BASE}/club-rental`
  const count = (await getRentalProviders()).length
  const title = `Golf club hire & rental in the Algarve: ${count} shops compared`
  const description = `Compare ${count} places to hire golf clubs in the Algarve: published prices, free delivery, Faro Airport collection and sets. Checked ${RENTAL_CHECKED_LABEL}.`
  return {
    title: withSiteName(title),
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Algarve Golf Map', locale: 'en_GB', type: 'website', images: ['/og-default.jpg'] },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-default.jpg'] },
  }
}

const AREAS = [
  {
    area: 'Vilamoura, Quarteira, Albufeira, Loulé, Quinta do Lago and Vale do Lobo',
    text: 'Up\'N\'Down delivers free to these areas. ClubsToHire also lists Vilamoura, Albufeira, Quinta do Lago and Vale do Lobo, though charges may apply. Green-Tee delivers free within 25 km of its Vilamoura office.',
  },
  {
    area: 'Carvoeiro, Alvor, Silves and Lagos',
    text: 'Up\'N\'Down delivers free to Carvoeiro, Silves and Lagos, and ClubsToHire lists Carvoeiro, Alvor and Lagos. There are also local shops in Carvoeiro, Alvor and Lagos.',
  },
  {
    area: 'Tavira and the east',
    text: 'ClubsToHire lists Tavira, with possible delivery charges. Up\'N\'Down charges €20 extra for Tavira, Vila Real and Castro Marim.',
  },
  {
    area: 'Vila do Bispo and Aljezur',
    text: 'Up\'N\'Down charges €20 extra here. For other providers, check that your accommodation is covered before you book.',
  },
]

const FAQS = [
  {
    q: 'How much does it cost to hire golf clubs in the Algarve?',
    a: 'Among providers that publish prices, one day costs from €25 to €40 at local shops. A week costs from about €60 to €80 at those shops, while a custom Players Pack from Up\'N\'Down costs €127. Prices vary by set and season, so confirm yours when you book.',
  },
  {
    q: 'Can I hire golf clubs at Faro Airport?',
    a: 'Yes. ClubsToHire has a shop in the arrivals hall, and MyCaddyMaster and Faro Golf Club Hire also offer collection at the airport. Our Faro Airport guide compares these options.',
  },
  {
    q: 'Can golf clubs be delivered to my hotel?',
    a: '18 Store, Blue Sky and Up\'N\'Down all advertise free delivery to your accommodation, with some limits by area. ClubsToHire, MyCaddyMaster, Green-Tee and Carvoeiro Golf Shop also offer delivery, but the area covered or the charge varies.',
  },
  {
    q: 'Can I get left-handed or ladies\' golf clubs?',
    a: 'Yes. ClubsToHire, MyCaddyMaster, Faro Golf Club Hire, Green-Tee and Carvoeiro Golf Shop all state that they offer ladies\' and left-handed clubs. Book early if you need one of these sets, as stock can be limited.',
  },
  {
    q: 'Can I hire clubs at the golf course?',
    a: 'Some course pro shops hire clubs, usually for a single round. Prices and availability vary, so ask the course directly. If you are playing several rounds, a multi-day hire is often better value.',
  },
  {
    q: 'Is it cheaper to hire clubs or fly with my own?',
    a: 'It depends on your airline and how long you stay. Ryanair, for example, charges £40 or €40 each way when you book online, so about €80 return. That is similar to a week\'s hire at several Algarve shops.',
  },
]

export default async function ClubRentalIndexPage() {
  const rentalProviders = (await getRentalProviders()).map(shop => ({
    shop,
    info: (shop.slug && RENTAL_INFO[shop.slug]) || {},
  }))
  const pageUrl = `${BASE}/club-rental`

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: H1, item: pageUrl },
    ],
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: H1,
    numberOfItems: rentalProviders.length,
    itemListElement: rentalProviders
      .filter(({ shop }) => shop.slug)
      .map(({ shop }, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: shop.name,
        url: `${BASE}/shops/${shop.slug}`,
      })),
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <SiteHeader showBackToMap />

      <section className="course-directory" id="club-rental">
        <nav aria-label="Breadcrumb" style={{ marginBottom: 8 }}>
          <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#6a6a6a' }}>
            <li><Link href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>Golf club hire</li>
          </ol>
        </nav>

        <div className="course-directory__header" style={{ marginTop: 16 }}>
          <h1 className="course-directory__title">{H1}</h1>
          <p className="course-directory__subtitle">
            {rentalProviders.length} places to hire golf clubs, compared. Details checked on their websites in {RENTAL_CHECKED_LABEL}.
          </p>
          <Link href="/shops" style={{ fontSize: 14, fontWeight: 600, color: '#2B6090', textDecoration: 'none' }}>
            Browse all golf shops in the Algarve →
          </Link>
        </div>

        <div style={prose}>
          <p style={paragraph}>
            You can hire golf clubs in the Algarve in three ways: collect them at Faro Airport, have them delivered
            to your accommodation, or pick them up from a local golf shop. Among providers that publish prices, one
            day costs from €25 to €40 at local shops, and a week usually costs about €60 to €80. Custom sets cost more.
          </p>
          <ul style={list}>
            <li><strong>Collect when you land:</strong> <ProviderLink slug="clubstohire-faro-airport" name="ClubsToHire" /> has a shop in the arrivals hall.</li>
            <li><strong>Free delivery to your accommodation:</strong> <ProviderLink slug="18-store-golf-shop" name="18 Store" />, <ProviderLink slug="blue-sky-golf-shop" name="Blue Sky" /> and <ProviderLink slug="up-n-down-golf" name="Up'N'Down" />.</li>
            <li><strong>Choose every club in your bag:</strong> <ProviderLink slug="up-n-down-golf" name="Up'N'Down" />.</li>
            <li><strong>Clear published prices:</strong> <ProviderLink slug="carvoeiro-golf-shop" name="Carvoeiro Golf Shop" />, <ProviderLink slug="green-tee-vilamoura" name="Green-Tee" /> and <ProviderLink slug="alvor-golf-shop" name="Alvor Golf Shop" />.</li>
          </ul>
        </div>

        <h2 className="course-directory__town">Golf club hire compared</h2>
        <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid #ebebeb', background: '#fff' }}>
          <table style={{ width: '100%', minWidth: 760, borderCollapse: 'collapse', fontSize: 14, color: '#333' }}>
            <thead>
              <tr>
                {['Provider', 'Published price', 'Where to get the clubs', 'Delivery', 'Sets'].map(h => (
                  <th key={h} scope="col" style={{ textAlign: 'left', padding: '12px 14px', fontSize: 13, fontWeight: 700, color: '#6a6a6a', borderBottom: '1px solid #ebebeb', verticalAlign: 'bottom' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rentalProviders.map(({ shop, info }) => (
                <tr key={shop.id} style={{ borderTop: '1px solid #f2f2f2' }}>
                  <th scope="row" style={{ ...cell, fontWeight: 600, textAlign: 'left' }}>
                    {shop.slug ? <Link href={`/shops/${shop.slug}`} style={link}>{shop.name}</Link> : shop.name}
                  </th>
                  <td style={cell}>{info.price ?? 'Ask the provider'}</td>
                  <td style={cell}>{info.collect ?? shop.rental_pickup_location ?? shop.town}</td>
                  <td style={cell}>{info.delivery ?? (shop.delivery_to_course ? 'Available; ask for details' : 'Ask the provider')}</td>
                  <td style={cell}>{info.sets ?? 'Ask the provider'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: '#6a6a6a', margin: '10px 0 0' }}>
          Prices are for one set and can change by season. Confirm the price, delivery and set with the provider before you book.
        </p>

        <h2 className="course-directory__town">Faro Airport or delivery?</h2>
        <div style={prose}>
          <p style={paragraph}>
            Collecting at the airport means you have your clubs as soon as you land, which is useful if you have a
            hire car and an early tee time. Delivery means you don&apos;t have to carry clubs through the airport or
            fit them in a transfer vehicle, and they are usually collected from your accommodation at the end.
          </p>
          <p style={paragraph}>
            If you are landing at Faro, our guide to <Link href={FARO_GUIDE} style={link}>golf club hire at Faro Airport</Link> compares
            each option, including where to collect your clubs and what to check before you fly.
          </p>
        </div>

        <h2 className="course-directory__town">Where are you staying?</h2>
        <div style={prose}>
          {AREAS.map(({ area, text }) => (
            <div key={area} style={{ marginBottom: 18 }}>
              <h3 style={subheading}>{area}</h3>
              <p style={{ ...paragraph, margin: 0 }}>{text}</p>
            </div>
          ))}
          <p style={paragraph}>
            18 Store and Blue Sky also deliver to your accommodation. Enter your dates and resort in their booking
            tools to confirm your area is covered.
          </p>
        </div>

        <h2 className="course-directory__town">The hire companies in detail</h2>
        <div style={prose}>
          {rentalProviders.map(({ shop, info }) => (
            <div key={shop.id} style={{ marginBottom: 22 }}>
              <h3 style={subheading}>
                {shop.slug ? <Link href={`/shops/${shop.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{shop.name}</Link> : shop.name}
                <span style={{ fontWeight: 400, color: '#6a6a6a' }}> · {shop.town}</span>
              </h3>
              <p style={{ ...paragraph, margin: 0 }}>{info.summary ?? shop.description}</p>
            </div>
          ))}
        </div>

        <h2 className="course-directory__town">Hire clubs or fly with your own?</h2>
        <div style={prose}>
          <p style={paragraph}>
            Airlines usually charge for golf clubs on each flight, so the cost doubles on a return trip. Here is what
            you can expect on some of the airlines flying to the Algarve or connecting to it:
          </p>
          <ul style={list}>
            <li><Link href="/guide/ryanair-golf-clubs-what-it-costs-to-fly-with-your-own-set-to-the-algarve" style={link}>Ryanair</Link>: £40 or €40 each way online</li>
            <li><Link href="/guide/golf-clubs-on-easyjet-rules-sizes-and-what-it-actually-costs" style={link}>easyJet</Link>: around £42 each way online</li>
            <li><Link href="/guide/jet2-golf-clubs-fees-weight-limits-and-why-you-shouldn-t-leave-booking-late" style={link}>Jet2</Link>: from £35 each way online</li>
            <li><Link href="/guide/aer-lingus-golf-clubs-free-in-business-here-s-what-economy-pays" style={link}>Aer Lingus</Link>: around €40 each way online in Economy</li>
            <li><Link href="/guide/flying-tap-air-portugal-with-golf-clubs-the-rules-have-changed" style={link}>TAP Air Portugal</Link>: from around €45 each way online</li>
            <li><Link href="/guide/lufthansa-golf-clubs-included-in-your-allowance-unless-you-re-on-a-light-fare" style={link}>Lufthansa</Link>: around €80 each way on European routes, unless clubs are part of your allowance</li>
          </ul>
          <p style={paragraph}>
            For a trip of about a week, hiring can cost about the same as flying with your own clubs or less, and you avoid
            the risk of damage in the hold. If you play regularly and are very particular about your clubs, bringing
            your own set may still be worth it. Airline fees can change, so check them before you book.
          </p>
        </div>

        <h2 className="course-directory__town">What to check before you book</h2>
        <div style={prose}>
          <ul style={list}>
            <li>Left- or right-handed, and whether you need ladies&apos; or junior clubs</li>
            <li>Shaft type and flex, if these matter for your game</li>
            <li>What is in the bag, including the number of wedges and any hybrids</li>
            <li>Delivery charges for your exact address, and who needs to be there for the handover</li>
            <li>What happens if your flight is delayed or your plans change</li>
            <li>Whether you also need a trolley or golf shoes</li>
          </ul>
        </div>

        <h2 className="course-directory__town">Golf club hire FAQs</h2>
        <div style={prose}>
          {FAQS.map(f => (
            <div key={f.q} style={{ marginBottom: 18 }}>
              <h3 style={subheading}>{f.q}</h3>
              <p style={{ ...paragraph, margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>

        <PartnerPrompt />
      </section>
    </>
  )
}

function ProviderLink({ slug, name }: { slug: string; name: string }) {
  return <Link href={`/shops/${slug}`} style={link}>{name}</Link>
}

const prose = { maxWidth: 700 } as const
const paragraph = { fontSize: 15, lineHeight: 1.7, color: '#444', margin: '16px 0' } as const
const list = { ...paragraph, paddingLeft: 20, listStyle: 'disc' } as const
const subheading = { fontSize: 15.5, fontWeight: 700, color: '#222', margin: '0 0 6px' } as const
const cell = { padding: '12px 14px', verticalAlign: 'top', lineHeight: 1.5 } as const
const link = { color: '#2B6090', textDecoration: 'none', fontWeight: 500 } as const
