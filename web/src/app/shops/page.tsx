import type { Metadata } from 'next'
import { getShops } from '@/lib/queries'

const BASE = 'https://algarvegolfmap.com'

export const metadata: Metadata = {
  title: 'Golf Shops in the Algarve — Retail, Pro Shops & Club Fitting',
  description: 'Golf equipment shops across the Algarve, including on-course pro shops and club fitting studios.',
  alternates: { canonical: `${BASE}/shops` },
}

export default async function ShopsIndexPage() {
  const shops = await getShops()

  const byTown = new Map<string, typeof shops>()
  for (const shop of shops) {
    if (!byTown.has(shop.town)) byTown.set(shop.town, [])
    byTown.get(shop.town)!.push(shop)
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 20px 60px' }}>
      <nav aria-label="Breadcrumb" style={{ marginBottom: 8 }}>
        <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#6a6a6a' }}>
          <li><a href="/" style={{ color: '#6a6a6a', textDecoration: 'none' }}>Home</a></li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" style={{ color: '#222', fontWeight: 600 }}>Golf Shops</li>
        </ol>
      </nav>

      <h1 style={{ fontSize: 30, fontWeight: 800, color: '#222', margin: '16px 0 8px' }}>
        Golf Shops in the Algarve
      </h1>
      <p style={{ fontSize: 15, color: '#6a6a6a', margin: '0 0 32px' }}>
        Retail stores, on-course pro shops and club fitting studios.
      </p>

      {[...byTown.entries()].map(([town, townShops]) => (
        <section key={town} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#222', margin: '0 0 12px', paddingBottom: 8, borderBottom: '2px solid #ebebeb' }}>
            {town}
          </h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {townShops.map(shop => (
              <li key={shop.id}>
                {shop.slug ? (
                  <a href={`/shops/${shop.slug}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, textDecoration: 'none', color: 'inherit', padding: '10px 14px', border: '1px solid #eee', borderRadius: 10 }}>
                    <span style={{ fontWeight: 600, color: '#222' }}>{shop.name}</span>
                    {shop.course_id && (
                      <span style={{ fontSize: 12, color: '#2B6090', fontWeight: 700 }}>On-site</span>
                    )}
                  </a>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 14px', border: '1px solid #eee', borderRadius: 10 }}>
                    <span style={{ fontWeight: 600, color: '#222' }}>{shop.name}</span>
                    {shop.course_id && (
                      <span style={{ fontSize: 12, color: '#2B6090', fontWeight: 700 }}>On-site</span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
