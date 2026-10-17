import type { Metadata } from 'next'

// Google truncates titles at roughly 60 characters and descriptions at roughly 155.
export const TITLE_MAX = 60
export const DESCRIPTION_MAX = 155

const SITE_SUFFIX = ' | Algarve Golf Map'

/** First candidate that fits in the title limit (falls back to the last, shortest one). */
export function pickTitle(candidates: string[]): string {
  return candidates.find(t => t.length <= TITLE_MAX) ?? candidates[candidates.length - 1]
}

/** Adds the " | Algarve Golf Map" suffix only when the full title still fits. */
export function withSiteName(title: string): Metadata['title'] {
  return title.length + SITE_SUFFIX.length <= TITLE_MAX ? title : { absolute: title }
}

/** First candidate that fits in the description limit; otherwise cuts the last one at a word. */
export function pickDescription(candidates: string[]): string {
  const fit = candidates.find(d => d.length <= DESCRIPTION_MAX)
  if (fit) return fit
  const text = candidates[candidates.length - 1]
  const cut = text.slice(0, DESCRIPTION_MAX - 1)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

/** "Almancil · Golden Triangle" → "Almancil" */
export function shortTown(town: string | null | undefined): string {
  return (town ?? '').split(' · ')[0].trim()
}
