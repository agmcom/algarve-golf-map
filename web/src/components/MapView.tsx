'use client'

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import mapboxgl from 'mapbox-gl'
import type { Feature, Polygon, GeoJsonProperties } from 'geojson'
import type { Course, Hotel, Shop, Airport } from '@/types/database'

export interface MapViewHandle {
  zoomIn: () => void
  zoomOut: () => void
  drawZone: (zone: Feature<Polygon, GeoJsonProperties>, type: 'intersection' | 'fallback', center: [number, number]) => void
  clearZone: () => void
}

interface MapViewProps {
  courses: Course[]
  hotels: Hotel[]
  shops: Shop[]
  airports: Airport[]
  selectedId: string | null
  plannedIds?: Set<string>
  plannerHotels?: (Hotel & { distance_km: number })[]
  onSelect: (id: string | null) => void
}

const ALGARVE_CENTER: [number, number] = [-8.2, 37.09]
const INITIAL_ZOOM = 9.2
const ZONE_SOURCE = 'planner-zone'

export const MapView = forwardRef<MapViewHandle, MapViewProps>(
  function MapView({ courses, hotels, shops, airports, selectedId, plannedIds = new Set(), plannerHotels = [], onSelect }, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const markersRef = useRef<Map<string, { marker: mapboxgl.Marker; el: HTMLDivElement }>>(new Map())
    const courseMarkerIdsRef = useRef<Set<string>>(new Set())
    const plannerHotelMarkersRef = useRef<mapboxgl.Marker[]>([])
    const onSelectRef = useRef(onSelect)
    onSelectRef.current = onSelect

    useImperativeHandle(ref, () => ({
      zoomIn: () => mapRef.current?.zoomIn({ duration: 300 }),
      zoomOut: () => mapRef.current?.zoomOut({ duration: 300 }),

      drawZone(zone, type, center) {
        const map = mapRef.current
        if (!map || !map.isStyleLoaded()) return
        removeZoneLayers(map)
        map.addSource(ZONE_SOURCE, { type: 'geojson', data: zone })
        map.addLayer({
          id: 'zone-fill', type: 'fill', source: ZONE_SOURCE,
          paint: { 'fill-color': '#2A6B4A', 'fill-opacity': type === 'intersection' ? 0.12 : 0.07 },
        })
        map.addLayer({
          id: 'zone-line', type: 'line', source: ZONE_SOURCE,
          paint: {
            'line-color': '#2A6B4A', 'line-width': 2, 'line-opacity': 0.8,
            'line-dasharray': type === 'fallback' ? [4, 3] : [1],
          },
        })
        const bounds = new mapboxgl.LngLatBounds()
        zone.geometry.coordinates[0].forEach(([lng, lat]) => bounds.extend([lng, lat]))
        map.fitBounds(bounds, { padding: 80, duration: 800, maxZoom: 12 })
      },

      clearZone() {
        const map = mapRef.current
        if (!map || !map.isStyleLoaded()) return
        removeZoneLayers(map)
        map.flyTo({ center: ALGARVE_CENTER, zoom: INITIAL_ZOOM, duration: 700 })
      },
    }))

    useEffect(() => {
      if (!containerRef.current) return
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
      if (!token) return

      mapboxgl.accessToken = token
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: ALGARVE_CENTER,
        zoom: INITIAL_ZOOM,
        minZoom: 7,
        attributionControl: false,
      })
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left')

      map.on('load', () => {
        const isDesktop = () => window.matchMedia('(pointer: fine)').matches
        let leaveTimer: ReturnType<typeof setTimeout> | null = null
        let hoveredEl: HTMLDivElement | null = null

        const clearHover = () => {
          markersRef.current.forEach(({ el: otherEl }, id) => {
            if (courseMarkerIdsRef.current.has(id)) {
              otherEl.style.opacity = ''
              if (otherEl.parentElement) otherEl.parentElement.style.zIndex = '1'
            }
          })
          if (hoveredEl) {
            hoveredEl.classList.remove('map-pin--hovered')
            hoveredEl = null
          }
        }

        // Course pins
        courses.forEach(course => {
          const el = createPin('course', `⛳ ${course.name}`, `€${course.price_from ?? '—'} · ${course.holes}h`, false, () => {
            onSelectRef.current(course.id)
          })

          el.addEventListener('mouseenter', () => {
            if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null }
            if (!isDesktop()) return
            clearHover()

            hoveredEl = el
            el.classList.add('map-pin--hovered')
            if (el.parentElement) el.parentElement.style.zIndex = '3'

            markersRef.current.forEach(({ el: otherEl }, id) => {
              if (courseMarkerIdsRef.current.has(id) && id !== course.id) {
                otherEl.style.opacity = '0.25'
                if (otherEl.parentElement) otherEl.parentElement.style.zIndex = '1'
              }
            })
          })

          el.addEventListener('mouseleave', () => {
            leaveTimer = setTimeout(() => { clearHover(); leaveTimer = null }, 80)
          })

          const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([course.lng, course.lat])
            .addTo(map)
          markersRef.current.set(course.id, { marker, el })
          courseMarkerIdsRef.current.add(course.id)
        })

        // Hotel pins
        hotels.forEach(hotel => {
          const el = createPin('hotel', `🏨 ${hotel.name}`, `from €${hotel.price_from ?? '—'}/night`, false, () => {
            onSelectRef.current(hotel.id)
          })
          const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([hotel.lng, hotel.lat])
            .addTo(map)
          markersRef.current.set(hotel.id, { marker, el })
        })

        // Airport pins
        airports.forEach(airport => {
          const el = createPin('airport', `✈️ ${airport.code} · ${airport.city}`, '', false, () => {})
          new mapboxgl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([airport.lng, airport.lat])
            .addTo(map)
        })

        // Shop pins
        shops.forEach(shop => {
          const typeLabel: Record<string, string> = {
            pro_shop: 'Pro Shop', retail: 'Retail', rental: 'Rental', fitting: 'Fitting',
          }
          const el = createPin('shop', `🛍️ ${shop.name}`, typeLabel[shop.type] ?? shop.type, false, () => {
            onSelectRef.current(shop.id)
          })
          const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([shop.lng, shop.lat])
            .addTo(map)
          markersRef.current.set(shop.id, { marker, el })
        })
      })

      map.on('click', () => onSelectRef.current(null))

      mapRef.current = map

      return () => {
        markersRef.current.clear()
        plannerHotelMarkersRef.current.forEach(m => m.remove())
        plannerHotelMarkersRef.current = []
        map.remove()
        mapRef.current = null
      }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Toggle planned heart on course pins
    useEffect(() => {
      courseMarkerIdsRef.current.forEach(id => {
        const entry = markersRef.current.get(id)
        if (entry) entry.el.classList.toggle('map-pin--planned', plannedIds.has(id))
      })
    }, [plannedIds])

    // Planner hotel markers
    useEffect(() => {
      const map = mapRef.current
      // Remove previous
      plannerHotelMarkersRef.current.forEach(m => m.remove())
      plannerHotelMarkersRef.current = []
      if (!map || !plannerHotels.length) return

      plannerHotels.forEach(hotel => {
        const el = createPlannerHotelPin(hotel.name, hotel.google_rating ?? null)
        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([hotel.lng, hotel.lat])
          .addTo(map)
        plannerHotelMarkersRef.current.push(marker)
      })
    }, [plannerHotels])

    // Show/hide course pins when filters change
    useEffect(() => {
      const visibleIds = new Set(courses.map(c => c.id))
      courseMarkerIdsRef.current.forEach(id => {
        const entry = markersRef.current.get(id)
        if (entry) {
          entry.el.style.display = visibleIds.has(id) ? '' : 'none'
        }
      })
    }, [courses])

    // Update marker styles on selection change
    useEffect(() => {
      markersRef.current.forEach(({ el }, id) => {
        const selected = id === selectedId
        el.classList.toggle('map-pin--selected', selected)
        const wrapper = el.parentElement
        if (wrapper) wrapper.style.zIndex = selected ? '10' : '1'
      })

      if (selectedId && mapRef.current) {
        const course = courses.find(c => c.id === selectedId)
        const hotel  = hotels.find(h => h.id === selectedId)
        const shop   = shops.find(s => s.id === selectedId)
        const entity = course ?? hotel ?? shop
        if (entity) {
          mapRef.current.flyTo({
            center: [entity.lng, entity.lat],
            zoom: Math.max(mapRef.current.getZoom(), 11),
            duration: 700,
            offset: [0, 80],
          })
        }
      }
    }, [selectedId, courses, hotels, shops])

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

    return (
      <div className="w-full h-full relative">
        <div ref={containerRef} className="w-full h-full" />
        {!token && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#d2e3ef]">
            <div className="text-center space-y-3">
              <div className="text-4xl">⛳</div>
              <p className="text-[#6a6a6a] font-medium text-sm">
                Add your Mapbox token to <code className="bg-[#f4f4f4] px-1.5 py-0.5 rounded text-xs">.env.local</code>
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }
)

const PIN_EMOJI: Record<string, string> = {
  course:  '⛳',
  hotel:   '🏨',
  shop:    '🛍️',
  airport: '✈️',
}

function createPin(
  type: 'course' | 'hotel' | 'shop' | 'airport',
  name: string,
  sub: string,
  selected: boolean,
  onClick: () => void
): HTMLDivElement {
  const wrapper = document.createElement('div')
  wrapper.className = `map-pin map-pin--${type}${selected ? ' map-pin--selected' : ''}`

  // Default state: emoji circle
  const icon = document.createElement('div')
  icon.className = 'map-pin__icon'
  icon.textContent = PIN_EMOJI[type] ?? '📍'

  const dot = document.createElement('div')
  dot.className = 'map-pin__dot'
  if (type === 'course' || type === 'airport') dot.style.display = 'none'

  // Selected state: text bubble
  const bubble = document.createElement('div')
  bubble.className = 'map-pin__bubble'
  bubble.style.display = 'block'

  const nameRow = document.createElement('div')
  nameRow.className = 'map-pin__name-row'

  const nameEl = document.createElement('span')
  nameEl.className = 'map-pin__name'
  nameEl.textContent = name

  const heartEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  heartEl.setAttribute('class', 'map-pin__heart')
  heartEl.setAttribute('width', '11')
  heartEl.setAttribute('height', '11')
  heartEl.setAttribute('viewBox', '0 0 24 24')
  heartEl.setAttribute('fill', '#2A6B4A')
  heartEl.setAttribute('stroke', '#2A6B4A')
  heartEl.setAttribute('stroke-width', '2')
  const heartPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  heartPath.setAttribute('d', 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z')
  heartEl.appendChild(heartPath)

  nameRow.appendChild(nameEl)
  nameRow.appendChild(heartEl)

  const subEl = document.createElement('span')
  subEl.className = 'map-pin__sub'
  subEl.textContent = sub

  bubble.appendChild(nameRow)
  bubble.appendChild(subEl)

  const arrow = document.createElement('div')
  arrow.className = 'map-pin__arrow'

  // Order: bubble → icon (only one shown at a time) → pointer (dot or arrow)
  wrapper.appendChild(bubble)
  wrapper.appendChild(icon)
  wrapper.appendChild(arrow)
  wrapper.appendChild(dot)

  wrapper.addEventListener('click', e => { e.stopPropagation(); onClick() })
  return wrapper
}


function createPlannerHotelPin(name: string, rating: number | null): HTMLDivElement {
  const wrapper = document.createElement('div')
  wrapper.style.cssText = 'display:flex;flex-direction:column;align-items:center;cursor:default'

  const bubble = document.createElement('div')
  bubble.style.cssText = `
    padding: 5px 10px 6px;
    border-radius: 10px;
    background: #003580;
    color: #fff;
    border: 2px solid #fff;
    box-shadow: 0 3px 12px rgba(0,53,128,.35);
    white-space: nowrap;
    font-family: var(--font-body, system-ui);
    text-align: center;
  `

  const nameEl = document.createElement('div')
  nameEl.style.cssText = 'font-size:11px;font-weight:700;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap'
  nameEl.textContent = name

  bubble.appendChild(nameEl)

  if (rating != null) {
    const ratingEl = document.createElement('div')
    ratingEl.style.cssText = 'font-size:10px;opacity:.85;margin-top:1px'
    ratingEl.textContent = `⭐ ${rating.toFixed(1)}`
    bubble.appendChild(ratingEl)
  }

  const arrow = document.createElement('div')
  arrow.style.cssText = 'width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid #003580;margin-top:-1px'

  wrapper.appendChild(bubble)
  wrapper.appendChild(arrow)
  return wrapper
}

function removeZoneLayers(map: mapboxgl.Map) {
  if (map.getLayer('zone-fill')) map.removeLayer('zone-fill')
  if (map.getLayer('zone-line')) map.removeLayer('zone-line')
  if (map.getSource(ZONE_SOURCE)) map.removeSource(ZONE_SOURCE)
}
