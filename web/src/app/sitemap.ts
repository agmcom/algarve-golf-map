import type { MetadataRoute } from 'next'
import { getAllCourseSlugs, getAllShopSlugs } from '@/lib/queries'
import { TOWN_PAGES } from '@/lib/towns'
import { RESORT_PAGES } from '@/lib/resorts'

const BASE = 'https://algarvegolfmap.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllCourseSlugs()
  const shopSlugs = await getAllShopSlugs()

  const shopUrls: MetadataRoute.Sitemap = shopSlugs.map(slug => ({
    url: `${BASE}/shops/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const courseUrls: MetadataRoute.Sitemap = slugs.map(slug => ({
    url: `${BASE}/courses/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const townUrls: MetadataRoute.Sitemap = TOWN_PAGES.map(t => ({
    url: `${BASE}/${t.slug}/golf-courses`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const resortUrls: MetadataRoute.Sitemap = RESORT_PAGES.map(r => ({
    url: `${BASE}/golf-resorts/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const hotelUrls: MetadataRoute.Sitemap = RESORT_PAGES.map(r => ({
    url: `${BASE}/hotels/${r.hotelSlug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE}/golf-resorts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE}/shops`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...townUrls,
    ...courseUrls,
    ...resortUrls,
    ...hotelUrls,
    ...shopUrls,
  ]
}
