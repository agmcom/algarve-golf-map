'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import type { Course, Airport } from '@/types/database'
import { CoursePanel } from './CoursePanel'

interface Props {
  courses: Course[]
  centerLat: number
  centerLng: number
  zoom?: number
  faro?: Airport | null
}

export function TownMapClient({ courses, centerLat, centerLng, zoom = 11.5, faro }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<Map<string, HTMLDivElement>>(new Map())
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedCourse = selectedId ? courses.find(c => c.id === selectedId) ?? null : null

  useEffect(() => {
    if (!containerRef.current) return
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) return

    mapboxgl.accessToken = token
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [centerLng, centerLat],
      zoom,
      minZoom: 7,
      attributionControl: false,
      cooperativeGestures: true,
    })
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left')

    map.on('click', () => setSelectedId(null))

    map.on('load', () => {
      courses.forEach(course => {
        const el = createTownPin(
          `⛳ ${course.name}`,
          `€${course.price_from ?? '—'} · ${course.holes}h`,
          () => setSelectedId(id => id === course.id ? null : course.id)
        )
        markersRef.current.set(course.id, el)
        new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([course.lng, course.lat])
          .addTo(map)
      })

      if (faro) {
        const el = createTownPin(`✈️ ${faro.code} · ${faro.city}`, '', () => {})
        el.style.cursor = 'default'
        new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([faro.lng, faro.lat])
          .addTo(map)
      }
    })

    return () => map.remove()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync selected state to pin CSS classes
  useEffect(() => {
    markersRef.current.forEach((el, id) => {
      if (id === selectedId) {
        el.classList.add('map-pin--selected')
      } else {
        el.classList.remove('map-pin--selected')
      }
    })
  }, [selectedId])

  return (
    <div style={{ position: 'relative', height: 'min(65vh, 600px)' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        <a
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: '#fff', border: '1px solid #ebebeb',
            borderRadius: 20, padding: '7px 14px',
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,.12)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" style={{ width: 22, height: 22, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#222', whiteSpace: 'nowrap' }}>
            Algarve Golf Map
          </span>
        </a>
        <a
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#fff', border: '1px solid #ebebeb',
            borderRadius: 20, padding: '7px 14px',
            fontSize: 13, fontWeight: 600, color: '#222',
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,.12)',
          }}
        >
          ← All Algarve courses
        </a>
      </div>
      {selectedCourse && (
        <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 200, width: 380, pointerEvents: 'none' }}>
          <div style={{ position: 'relative', height: '100%', pointerEvents: 'auto' }}>
            <CoursePanel
              course={selectedCourse}
              allCourses={courses}
              onClose={() => setSelectedId(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function createTownPin(name: string, sub: string, onClick: () => void): HTMLDivElement {
  const wrapper = document.createElement('div')
  wrapper.className = 'map-pin map-pin--course'
  wrapper.style.cursor = 'pointer'

  const bubble = document.createElement('div')
  bubble.className = 'map-pin__bubble'

  const nameRow = document.createElement('div')
  nameRow.className = 'map-pin__name-row'
  const nameEl = document.createElement('span')
  nameEl.className = 'map-pin__name'
  nameEl.textContent = name
  nameRow.appendChild(nameEl)
  bubble.appendChild(nameRow)

  if (sub) {
    const subEl = document.createElement('span')
    subEl.className = 'map-pin__sub'
    subEl.textContent = sub
    bubble.appendChild(subEl)
  }

  const arrow = document.createElement('div')
  arrow.className = 'map-pin__arrow'

  const dot = document.createElement('div')
  dot.className = 'map-pin__dot'

  wrapper.appendChild(bubble)
  wrapper.appendChild(arrow)
  wrapper.appendChild(dot)

  wrapper.addEventListener('click', e => { e.stopPropagation(); onClick() })
  return wrapper
}
