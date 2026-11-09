import type { MetadataRoute } from 'next'
import { getCourseSitemapRows, getShopSitemapRows, getPublishedGuidePosts, getCourseSlugsWithGreenFees, getCourseSlugsWithReviews } from '@/lib/queries'
import { MIN_REVIEWS_TO_INDEX } from '@/lib/reviews'
import { TOWN_PAGES } from '@/lib/towns'
import { RESORT_PAGES } from '@/lib/resorts'
import { COURSE_RATINGS } from '@/data/course-ratings'
import { ACADEMIES } from '@/data/academies'

const BASE = 'https://www.algarvegolfmap.com'

// Regenerate hourly so guide/course/shop slug changes reach the sitemap without a redeploy.
export const revalidate = 3600

// <lastmod> must be the date a page's content really changed, or Google ignores it. Pages
// built from the database use the row's updated_at. For content that lives in code, bump the
// matching date below when you change it meaningfully. Pages with no reliable date have no
// lastmod at all, which Google treats as "unknown" rather than "changed today".
const COURSE_TEMPLATE_UPDATED = '2026-11-09' // course page layout/sections (slope range + link added)
const GREEN_FEES_UPDATED = '2026-11-06'      // last price seed (2026-10-26) or buggy facts (2026-11-06)
const SLOPE_RATINGS_UPDATED = '2026-11-09'   // FPG table checked; see src/data/course-ratings.ts

function latest(...dates: (string | null | undefined)[]): Date | undefined {
  const t = dates.filter(Boolean).map(d => new Date(d as string).getTime()).filter(n => !Number.isNaN(n))
  return t.length ? new Date(Math.max(...t)) : undefined
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courseRows = await getCourseSitemapRows()
  const slugs = courseRows.map(c => c.slug)
  const greenFeeSlugs = await getCourseSlugsWithGreenFees()
  const reviewSlugs = await getCourseSlugsWithReviews(MIN_REVIEWS_TO_INDEX)
  const shopRows = await getShopSitemapRows()
  const guidePosts = await getPublishedGuidePosts()

  const shopUrls: MetadataRoute.Sitemap = shopRows.map(s => ({
    url: `${BASE}/shops/${s.slug}`,
    lastModified: latest(s.updated_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const courseUrls: MetadataRoute.Sitemap = courseRows.map(c => ({
    url: `${BASE}/courses/${c.slug}`,
    lastModified: latest(c.updated_at, COURSE_TEMPLATE_UPDATED),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const greenFeeUrls: MetadataRoute.Sitemap = greenFeeSlugs.map(slug => ({
    url: `${BASE}/courses/${slug}/green-fees`,
    lastModified: latest(GREEN_FEES_UPDATED),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const slopeRatingUrls: MetadataRoute.Sitemap = Object.keys(COURSE_RATINGS).filter(s => slugs.includes(s)).map(slug => ({
    url: `${BASE}/courses/${slug}/slope-rating`,
    lastModified: latest(SLOPE_RATINGS_UPDATED),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // Only reviews pages that are indexable (enough approved reviews).
  const reviewUrls: MetadataRoute.Sitemap = reviewSlugs.map(slug => ({
    url: `${BASE}/courses/${slug}/reviews`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const townUrls: MetadataRoute.Sitemap = TOWN_PAGES.map(t => ({
    url: `${BASE}/${t.slug}/golf-courses`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Resort pages 404 when none of their courses are active (e.g. private clubs), so leave those out.
  const resortUrls: MetadataRoute.Sitemap = RESORT_PAGES.filter(r => r.courseSlugs.some(s => slugs.includes(s))).map(r => ({
    url: `${BASE}/golf-resorts/${r.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const hotelUrls: MetadataRoute.Sitemap = RESORT_PAGES.flatMap(r => r.hotelSlugs).map(hotelSlug => ({
    url: `${BASE}/hotels/${hotelSlug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const guideUrls: MetadataRoute.Sitemap = guidePosts.map(post => ({
    url: `${BASE}/guide/${post.slug}`,
    lastModified: latest(post.updated_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    { url: BASE, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/golf-resorts`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/shops`, lastModified: latest(...shopRows.map(s => s.updated_at)), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/club-rental`, changeFrequency: 'weekly', priority: 0.7 },
    {
      url: `${BASE}/guide`,
      // The hub only changes when a post does, so report the newest post's date.
      lastModified: latest(...guidePosts.map(p => p.updated_at)),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    { url: `${BASE}/algarve-9-hole-courses`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/driving-ranges`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/golf-academies`, changeFrequency: 'monthly', priority: 0.8 },
    ...ACADEMIES.map(a => ({
      url: `${BASE}/golf-academies/${a.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${BASE}/partners`, changeFrequency: 'monthly', priority: 0.4 },
    ...townUrls,
    ...courseUrls,
    ...greenFeeUrls,
    ...slopeRatingUrls,
    ...reviewUrls,
    ...resortUrls,
    ...hotelUrls,
    ...shopUrls,
    ...guideUrls,
  ]
}
