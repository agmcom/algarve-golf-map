'use client'

import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import { CarouselCard } from './CarouselCard'
import type { Course } from '@/types/database'

export interface BottomCarouselHandle {
  scrollToId: (id: string) => void
}

interface BottomCarouselProps {
  courses: Course[]
  allCourses: Course[]
  selectedId: string | null
  onSelect: (id: string) => void
  plannedIds: Set<string>
  onTogglePlan: (id: string) => void
  compareIds: string[]
  onToggleCompare: (id: string) => void
}

const CARD_WIDTH = 240
const CARD_GAP = 12

export const BottomCarousel = forwardRef<BottomCarouselHandle, BottomCarouselProps>(
  function BottomCarousel({ courses, allCourses, selectedId, onSelect, plannedIds, onTogglePlan, compareIds, onToggleCompare }, ref) {
    const scrollerRef = useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
      const fn = () => setIsMobile(window.innerWidth < 640)
      fn()
      window.addEventListener('resize', fn)
      return () => window.removeEventListener('resize', fn)
    }, [])

    const px = isMobile ? 12 : 22

    useImperativeHandle(ref, () => ({
      scrollToId(id: string) {
        const el = scrollerRef.current
        if (!el) return
        const idx = courses.findIndex((c) => c.id === id)
        if (idx < 0) return
        const cardCenter = px + idx * (CARD_WIDTH + CARD_GAP) + CARD_WIDTH / 2
        const scrollLeft = cardCenter - el.clientWidth / 2
        el.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' })
      },
    }))

    return (
      <div
        className="absolute left-0 right-0 bottom-0 z-10"
        style={{ paddingBottom: isMobile ? 12 : 20 }}
      >
        {/* Course count badge */}
        <div style={{ padding: `0 ${px}px 8px` }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: 12,
              fontWeight: 600,
              color: '#222',
              background: '#ffffff',
              padding: '5px 10px',
              borderRadius: 14,
              boxShadow: '0 2px 8px rgba(0,0,0,.1)',
            }}
          >
            {courses.length} golf courses
          </span>
        </div>

        {/* Scrollable cards */}
        <div
          ref={scrollerRef}
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: CARD_GAP,
            overflowX: 'auto',
            padding: `16px ${px}px 6px`,
            scrollSnapType: 'x mandatory',
          }}
        >
          {courses.map((course) => (
            <div key={course.id} style={{ scrollSnapAlign: 'start' }}>
              <CarouselCard
                course={course}
                selected={selectedId === course.id}
                onSelect={onSelect}
                planned={plannedIds.has(course.id)}
                onTogglePlan={onTogglePlan}
                compared={compareIds.includes(course.id)}
                onToggleCompare={compareIds.length < 4 || compareIds.includes(course.id) ? onToggleCompare : undefined}
              />
            </div>
          ))}
          <div style={{ flexShrink: 0, width: 4 }} />
        </div>
      </div>
    )
  }
)
