'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { CarouselCard } from './CarouselCard'
import { nearestCourses } from '@/lib/distance'
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

export const BottomCarousel = forwardRef<BottomCarouselHandle, BottomCarouselProps>(
  function BottomCarousel({ courses, allCourses, selectedId, onSelect, plannedIds, onTogglePlan, compareIds, onToggleCompare }, ref) {
    const scrollerRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      scrollToId(id: string) {
        const el = scrollerRef.current
        if (!el) return
        const idx = courses.findIndex((c) => c.id === id)
        if (idx < 0) return
        // Center the selected card in the viewport
        const cardCenter = 22 + idx * (250 + 14) + 125
        const scrollLeft = cardCenter - el.clientWidth / 2
        el.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' })
      },
    }))

    return (
      <div
        className="absolute left-0 right-0 bottom-0 z-10"
        style={{ paddingBottom: 20 }}
      >
        {/* Course count badge */}
        <div style={{ padding: '0 22px 10px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: 13,
              fontWeight: 600,
              color: '#222',
              background: '#ffffff',
              padding: '6px 12px',
              borderRadius: 16,
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
            gap: 14,
            overflowX: 'auto',
            padding: '22px 22px 6px',
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
                nearbyCourses={nearestCourses(course.lat, course.lng, course.id, allCourses)}
              />
            </div>
          ))}
          {/* Right padding spacer */}
          <div style={{ flexShrink: 0, width: 8 }} />
        </div>
      </div>
    )
  }
)
