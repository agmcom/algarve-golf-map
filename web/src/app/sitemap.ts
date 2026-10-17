import type { MetadataRoute } from 'next'
import { getAllCourseSlugs, getAllShopSlugs, getPublishedGuidePosts, getCourseSlugsWithGreenFees, getCourseSlugsWithReviews } from '@/lib/queries'
import { MIN_REVIEWS_TO_INDEX } from '@/lib/reviews'
import { TOWN_PAGES } from '@/lib/towns'
import { RESORT_PAGES } from '@/lib/resorts'

const BASE = 'https://www.algarvegolfmap.com'

// Regenerate hourly so guide/course/shop slug changes reach the sitemap without a redeploy.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllCourseSlugs()
  const greenFeeSlugs = await getCourseSlugsWithGreenFees()
  const reviewSlugs = await getCourseSlugsWithReviews(MIN_REVIEWS_TO_INDEX)
  const shopSlugs = await getAllShopSlugs()
  const guidePosts = await getPublishedGuidePosts()

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

  const greenFeeUrls: MetadataRoute.Sitemap = greenFeeSlugs.map(slug => ({
    url: `${BASE}/courses/${slug}/green-fees`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Only reviews pages that are indexable (enough approved reviews).
  const reviewUrls: MetadataRoute.Sitemap = reviewSlugs.map(slug => ({
    url: `${BASE}/courses/${slug}/reviews`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const townUrls: MetadataRoute.Sitemap = TOWN_PAGES.map(t => ({
    url: `${BASE}/${t.slug}/golf-courses`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Resort pages 404 when none of their courses are active (e.g. private clubs), so leave those out.
  const resortUrls: MetadataRoute.Sitemap = RESORT_PAGES.filter(r => r.courseSlugs.some(s => slugs.includes(s))).map(r => ({
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

  const guideUrls: MetadataRoute.Sitemap = guidePosts.map(post => ({
    url: `${BASE}/guide/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'monthly',
    priority: 0.6,
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
    {
      url: `${BASE}/club-rental`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE}/guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE}/algarve-9-hole-courses`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE}/driving-ranges`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...townUrls,
    ...courseUrls,
    ...greenFeeUrls,
    ...reviewUrls,
    ...resortUrls,
    ...hotelUrls,
    ...shopUrls,
    ...guideUrls,
  ]
}
