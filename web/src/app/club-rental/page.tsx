import type { Metadata } from 'next'
import Link from 'next/link'
import { getShops } from '@/lib/queries'

const BASE = 'https://www.algarvegolfmap.com'
// Generic golf club display, no people and no visible branding — used only
// when a rental provider has no real photo of its own.
const GENERIC_SHOP_FALLBACK =
  'https://images.unsplash.com/photo-1593111774642-a746f5006b7b?auto=format&fit=crop&w=160&h=160&q=80'
const GENERIC_SHOP_ALT = 'Golf clubs on display'

const TITLE = 'Golf Club Rental in the Algarve'
const DESCRIPTION =
  'Where to hire golf clubs in the Algarve — at Faro Airport and at courses and shops across the region. Prices, brands and delivery-to-course options.'

export const revalidate = 3600

export function generateMetadata(): Metadata {
  const url = `${BASE}/club-rental`
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: { title: TITLE, description: DESCRIPTION, url, siteName: 'Algarve Golf Map', type: 'website' },
  }
}

function groupByTown<T extends { town: string }>(items: T[]): { town: string; items: T[] }[] {
  const map = new Map<string, T[]>()
  for (const item of items) {
    if (!map.has(item.town)) map.set(item.town, [])
    map.get(item.town)!.push(item)
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([town, items]) => ({ town, items }))
}

export default async function ClubRentalIndexPage() {
  const shops = await getShops()
  const rentalProviders = shops.filter(s => s.offers_rental)
  const groups = groupByTown(rentalProviders)
  const pageUrl = `${BASE}/club-rental`

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: TITLE, item: pageUrl },
    ],
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: TITLE,
    numberOfItems: rentalProviders.length,
    itemListElement: rentalProviders
      .filter(s => s.slug)
      .map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: s.name,
        url: `${BASE}/shops/${s.slug}`,
      })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <section className="course-directory" id="club-rental">
        <nav aria-label="Breadcrumb" style={{ marginBottom: 8 }}>
          <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#6a6a6a' }}>
            <li><Link href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>{TITLE}</li>
          </ol>
        </nav>

        <div className="course-directory__header" style={{ marginTop: 16 }}>
          <h1 className="course-directory__title">{TITLE}</h1>
          <p className="course-directory__subtitle">
            {rentalProviders.length} places to hire golf clubs — at Faro Airport, at courses and at golf shops
          </p>
          <Link href="/shops" style={{ fontSize: 14, fontWeight: 600, color: '#2B6090', textDecoration: 'none' }}>
            Browse All Golf Shops in the Algarve →
          </Link>
        </div>

        <p style={{ maxWidth: 700, fontSize: 15, lineHeight: 1.7, color: '#444', margin: '16px 0 32px' }}>
          {DESCRIPTION} Most providers rent by the day, offer men&apos;s, ladies&apos; and left-handed
          sets, and many deliver directly to your hotel or golf course so you don&apos;t have to
          carry clubs through the airport.
        </p>

        {groups.map(({ town, items }) => (
          <div key={town}>
            <h2 className="course-directory__town">Golf Club Rental in {town}</h2>
            <ul className="course-list">
              {items.map(shop => {
                const image = shop.photo_url ?? GENERIC_SHOP_FALLBACK
                const imageAlt = shop.photo_url ? (shop.photo_alt ?? `${shop.name} golf club rental`) : GENERIC_SHOP_ALT
                const card = (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={imageAlt}
                      width={80}
                      height={80}
                      loading="lazy"
                    />
                    <div className="course-list-item__body">
                      <strong className="course-list-item__name">{shop.name}</strong>
                      <span className="course-list-item__meta">
                        {shop.rental_price_per_day != null ? `From €${shop.rental_price_per_day}/day` : shop.town}
                        {shop.delivery_to_course && ' · delivers to course'}
                      </span>
                      {shop.rental_set_types.length > 0 && (
                        <span className="course-list-item__badges">
                          <span style={{ fontSize: 12, color: '#6a6a6a' }}>
                            {shop.rental_set_types.slice(0, 3).map(t => t.replace(/_/g, ' ')).join(', ')}
                          </span>
                        </span>
                      )}
                      {shop.rental_delivery_areas.length > 0 && (
                        <span className="course-list-item__badges">
                          <span style={{ fontSize: 12, color: '#6a6a6a' }}>
                            Delivers to {shop.rental_delivery_areas.slice(0, 2).join(', ')}
                            {shop.rental_delivery_areas.length > 2 && ` +${shop.rental_delivery_areas.length - 2} more`}
                          </span>
                        </span>
                      )}
                    </div>
                  </>
                )
                return (
                  <li key={shop.id} className="course-list-item">
                    {shop.slug ? <Link href={`/shops/${shop.slug}`}>{card}</Link> : <div style={{ display: 'flex', gap: 16, padding: 14 }}>{card}</div>}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </section>
    </>
  )
}
