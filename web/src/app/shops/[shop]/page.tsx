import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getShopBySlug, getAllShopSlugs } from '@/lib/queries'

const BASE = 'https://algarvegolfmap.com'

export async function generateStaticParams() {
  const slugs = await getAllShopSlugs()
  return slugs.map(slug => ({ shop: slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shop: string }>
}): Promise<Metadata> {
  const { shop: slug } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) return {}

  const title = `${shop.name} — Golf Shop in ${shop.town}, Algarve`
  const description = shop.description
    ?? `${shop.name}, a golf shop in ${shop.town}, Algarve.${shop.brands.length ? ` Stocking ${shop.brands.join(', ')}.` : ''}${shop.course ? ` On-site at ${shop.course.name}.` : ''}`

  const url = `${BASE}/shops/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Algarve Golf Map', type: 'website' },
  }
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ shop: string }>
}) {
  const { shop: slug } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) notFound()

  const shopUrl = `${BASE}/shops/${slug}`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lng}`

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Golf Shops in the Algarve', item: `${BASE}/shops` },
      { '@type': 'ListItem', position: 3, name: shop.name, item: shopUrl },
    ],
  }

  const storeLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: shop.name,
    description: shop.description ?? undefined,
    url: shopUrl,
    telephone: shop.phone ?? undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: shop.address ?? undefined,
      addressLocality: shop.town,
      addressRegion: 'Algarve',
      addressCountry: 'PT',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: shop.lat,
      longitude: shop.lng,
    },
    brand: shop.brands.length ? shop.brands : undefined,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeLd) }} />

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 20px 60px' }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: 8 }}>
          <ol style={{
            display: 'flex', flexWrap: 'wrap', gap: '4px 8px',
            listStyle: 'none', padding: 0, margin: 0,
            fontSize: 13, color: '#6a6a6a',
          }}>
            <li><a href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</a></li>
            <li aria-hidden="true">›</li>
            <li><a href="/shops" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Golf Shops</a></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>{shop.name}</li>
          </ol>
        </nav>

        <div style={{ marginTop: 16, marginBottom: 24 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#222', margin: '0 0 8px', lineHeight: 1.15 }}>
            {shop.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {shop.course && (
              <span style={{
                fontSize: 12, fontWeight: 700, color: '#2B6090',
                background: '#eaf2f8', padding: '3px 9px', borderRadius: 6,
              }}>
                On-site
              </span>
            )}
            <span style={{ fontSize: 14, color: '#6a6a6a' }}>{shop.town}, Algarve</span>
          </div>
        </div>

        <div style={{ borderRadius: 16, border: '1.5px solid #e8e8e8', overflow: 'hidden', marginBottom: 32 }}>
          {shop.description && (
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #f0f0f0' }}>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#444', margin: 0 }}>
                {shop.description}
              </p>
            </div>
          )}

          <div style={{ padding: '18px 22px', borderBottom: '1px solid #f0f0f0' }}>
            {shop.address && (
              <p style={{ fontSize: 14, color: '#444', margin: '0 0 4px' }}>{shop.address}</p>
            )}
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600, color: '#2B6090', textDecoration: 'none' }}>
              Get directions ↗
            </a>
          </div>

          {shop.brands.length > 0 && (
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 }}>Brands</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 10px' }}>
                {shop.brands.map(b => (
                  <span key={b} style={{ fontSize: 13, color: '#555' }}>{b}</span>
                ))}
              </div>
            </div>
          )}

          {shop.services.length > 0 && (
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 }}>Services</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
                {shop.services.map(s => (
                  <span key={s} style={{ fontSize: 13, color: '#555', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ color: '#22a06b', fontWeight: 700, fontSize: 14 }}>✓</span> {s.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {shop.offers_rental && (
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: 13, color: '#555' }}>
                Club rental available{shop.rental_price_per_day ? ` — from €${shop.rental_price_per_day}/day` : ''}{shop.delivery_to_course ? ' · delivery to your course' : ''}
              </span>
            </div>
          )}

          {shop.course && (
            <div style={{ padding: '16px 22px', borderBottom: shop.website || shop.phone ? '1px solid #f0f0f0' : 'none' }}>
              <span style={{ fontSize: 13, color: '#555' }}>
                On-site at{' '}
                <a href={`/courses/${shop.course.slug}`} style={{ color: '#2B6090', fontWeight: 600, textDecoration: 'none' }}>
                  {shop.course.name}
                </a>
              </span>
            </div>
          )}

          {(shop.website || shop.phone) && (
            <div style={{ padding: '16px 22px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {shop.website && (
                <a
                  href={shop.website.includes('?') ? `${shop.website}&utm_source=algarvegolfmap.com` : `${shop.website}?utm_source=algarvegolfmap.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 14, fontWeight: 600, color: '#2B6090', textDecoration: 'none' }}
                >
                  Visit website ↗
                </a>
              )}
              {shop.phone && (
                <a href={`tel:${shop.phone}`} style={{ fontSize: 14, fontWeight: 600, color: '#2B6090', textDecoration: 'none' }}>
                  {shop.phone}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
