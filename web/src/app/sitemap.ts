import type { MetadataRoute } from 'next'
import { getAllCourseSlugs } from '@/lib/queries'
import { TOWN_PAGES } from '@/lib/towns'

const BASE = 'https://algarvegolfmap.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllCourseSlugs()

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

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...townUrls,
    ...courseUrls,
  ]
}
