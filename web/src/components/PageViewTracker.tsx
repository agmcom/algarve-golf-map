'use client'

import { useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'

export function PageViewTracker({ page, slug }: { page: string; slug?: string }) {
  useEffect(() => {
    trackPageView(page, slug)
  }, [page, slug])
  return null
}
