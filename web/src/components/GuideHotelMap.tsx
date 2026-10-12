'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

export interface GuideMapHotel {
  name: string
  lat: number
  lng: number
  bookingUrl: string
  ctaId: string        // id of the hotel's "Check availability" link in the article
  sub: string          // shown in the pin bubble, e.g. "from €90"
}

interface Props {
  course: { name: string; slug: string; lat: number; lng: number }
  hotels: GuideMapHotel[]
}

// Course pin → course page; hotel pins → the hotel's affiliate link (new tab).
// Pins are real <a> elements so the site-wide hotel_click listener tracks them.
export function GuideHotelMap({ course, hotels }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) return

    mapboxgl.accessToken = token
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [course.lng, course.lat],
      zoom: 11,
      attributionControl: false,
      cooperativeGestures: true,
    })
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left')
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

    map.on('load', () => {
      const bounds = new mapboxgl.LngLatBounds([course.lng, course.lat], [course.lng, course.lat])

      hotels.forEach(h => {
        const el = createPin('hotel', h.name, h.sub, h.bookingUrl)
        el.target = '_blank'
        el.rel = 'noopener noreferrer'
        el.setAttribute('data-hotel-click', 'guide_hotel_map')
        el.setAttribute('data-hotel-name', h.name)
        // Use the article link's href, which Stay22 may already have turned into an affiliate link
        el.addEventListener('click', () => {
          const cta = document.getElementById(h.ctaId) as HTMLAnchorElement | null
          if (cta?.href) el.href = cta.href
        })
        el.addEventListener('mouseenter', () => el.classList.add('map-pin--selected'))
        el.addEventListener('mouseleave', () => el.classList.remove('map-pin--selected'))
        new mapboxgl.Marker({ element: el, anchor: 'bottom' }).setLngLat([h.lng, h.lat]).addTo(map)
        bounds.extend([h.lng, h.lat])
      })

      const courseEl = createPin('course', `⛳ ${course.name}`, 'View course', `/courses/${course.slug}`)
      courseEl.classList.add('map-pin--selected')
      courseEl.style.zIndex = '5'
      new mapboxgl.Marker({ element: courseEl, anchor: 'bottom' }).setLngLat([course.lng, course.lat]).addTo(map)

      if (hotels.length > 0) map.fitBounds(bounds, { padding: 60, maxZoom: 13, duration: 0 })
    })

    return () => map.remove()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #ebebeb', margin: '8px 0 28px' }}>
      <div ref={containerRef} style={{ width: '100%', height: 'min(60vh, 460px)', background: '#eef2f0' }} />
    </div>
  )
}

function createPin(kind: 'course' | 'hotel', name: string, sub: string, href: string): HTMLAnchorElement {
  const wrapper = document.createElement('a')
  wrapper.className = `map-pin map-pin--${kind}`
  wrapper.href = href
  wrapper.style.textDecoration = 'none'
  wrapper.setAttribute('aria-label', name)

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
  return wrapper
}
