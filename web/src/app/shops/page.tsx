import type { Metadata } from 'next'
import { getShops } from '@/lib/queries'

const BASE = 'https://www.algarvegolfmap.com'
// Generic golf club display, no people — used only when a shop has no real
// photo of its own. Shows Titleist/Cleveland/Odyssey club heads; not a claim
// that every shop using this fallback stocks those brands.
const GENERIC_SHOP_FALLBACK =
  'https://images.unsplash.com/photo-1530028828-25e8270793c5?auto=format&fit=crop&w=160&h=160&q=80'
const GENERIC_SHOP_ALT = 'Golf clubs on display'

const TITLE = 'Golf Shops in the Algarve'
const DESCRIPTION =
  'Golf equipment shops across the Algarve — on-course pro shops, retail stores and club-fitting studios. Find where to buy gear or rent clubs near your course.'

export const revalidate = 3600

export function generateMetadata(): Metadata {
  const url = `${BASE}/shops`
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

export default async function ShopsIndexPage() {
  const shops = await getShops()
  const groups = groupByTown(shops)
  const pageUrl = `${BASE}/shops`

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
    numberOfItems: shops.length,
    itemListElement: shops
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

      <section className="course-directory" id="golf-shops">
        <nav aria-label="Breadcrumb" style={{ marginBottom: 8 }}>
          <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#6a6a6a' }}>
            <li><a href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</a></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>{TITLE}</li>
          </ol>
        </nav>

        <div className="course-directory__header" style={{ marginTop: 16 }}>
          <h1 className="course-directory__title">{TITLE}</h1>
          <p className="course-directory__subtitle">
            {shops.length} golf shops across the Algarve — pro shops, retail stores and club-fitting studios
          </p>
          <a href="/club-rental" style={{ fontSize: 14, fontWeight: 600, color: '#2B6090', textDecoration: 'none' }}>
            Browse Golf Club Rental in the Algarve →
          </a>
        </div>

        <p style={{ maxWidth: 700, fontSize: 15, lineHeight: 1.7, color: '#444', margin: '16px 0 32px' }}>
          {DESCRIPTION}
        </p>

        {groups.map(({ town, items }) => (
          <div key={town}>
            <h2 className="course-directory__town">Golf Shops in {town}</h2>
            <ul className="course-list">
              {items.map(shop => {
                const image = shop.photo_url ?? GENERIC_SHOP_FALLBACK
                const imageAlt = shop.photo_url ? (shop.photo_alt ?? `${shop.name} golf shop`) : GENERIC_SHOP_ALT
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
                        {shop.services.length > 0 ? shop.services.slice(0, 2).map(s => s.replace(/_/g, ' ')).join(' · ') : shop.town}
                        {shop.brands.length > 0 && ` · ${shop.brands.length} brands`}
                      </span>
                      {(shop.course_id || shop.offers_rental) && (
                        <span className="course-list-item__badges">
                          {shop.course_id && <span className="course-list-item__price">On-site</span>}
                          {shop.offers_rental && (
                            <span style={{ fontSize: 12, color: '#6a6a6a' }}>
                              Club rental{shop.rental_price_per_day ? ` from €${shop.rental_price_per_day}/day` : ''}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </>
                )
                return (
                  <li key={shop.id} className="course-list-item">
                    {shop.slug ? <a href={`/shops/${shop.slug}`}>{card}</a> : <div style={{ display: 'flex', gap: 16, padding: 14 }}>{card}</div>}
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
