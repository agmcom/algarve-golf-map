'use client'

import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { BedDouble } from 'lucide-react'
import { trackPageView, trackFilter } from '@/lib/analytics'
import { MapView, type MapViewHandle } from '@/components/MapView'
import { TopBar } from '@/components/TopBar'
import { BottomCarousel, type BottomCarouselHandle } from '@/components/BottomCarousel'
import { PlannerPanel } from '@/components/PlannerPanel'
import { CoursePanel } from '@/components/CoursePanel'
import { CompareModal } from '@/components/CompareModal'
import { CompareButton, ComparePopup } from '@/components/CompareBar'
import { ContactModal } from '@/components/ContactModal'
import type { Course, Hotel, Shop, Airport } from '@/types/database'
import type { PlannerResult } from '@/lib/planner'

interface HomeClientProps {
  courses: Course[]
  hotels: Hotel[]
  shops: Shop[]
  airports: Airport[]
}

const OCEAN_TAGS = new Set(['Ocean view', 'Sea view', 'Clifftop', 'Coastal'])
const SIGNATURE_TAGS = new Set(['Signature', 'Championship', 'European Tour', 'Heritage'])
const HOLE_FILTERS = new Set(['holes_18', 'holes_9', 'holes_27'])
const DIFF_FILTERS = new Set(['easy', 'moderate', 'challenging'])
const FARO_FILTERS  = new Set(['faro_30', 'faro_60', 'faro_90'])

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function faroMinutes(course: Course, fao: { lat: number; lng: number; road_factor: number; avg_speed_kmh: number }): number {
  const km = haversineKm(course.lat, course.lng, fao.lat, fao.lng)
  return Math.round((km * fao.road_factor) / fao.avg_speed_kmh * 60)
}

function matchFilter(course: Course, key: string, fao: { lat: number; lng: number; road_factor: number; avg_speed_kmh: number }): boolean {
  switch (key) {
    case 'clubs_rental':  return course.offers_rental
    case 'onsite_hotel':  return course.onsite_hotel_id != null
    case 'under_150':    return (course.price_from ?? 0) < 150
    case 'ocean_view':   return course.tags.some(t => OCEAN_TAGS.has(t))
    case 'holes_18':     return course.holes === 18
    case 'holes_9':      return course.holes === 9
    case 'holes_27':     return course.holes === 27
    case 'signature':    return course.tags.some(t => SIGNATURE_TAGS.has(t))
    case 'driving_range':return course.driving_range
    case 'easy':         return course.difficulty === 'easy'
    case 'moderate':     return course.difficulty === 'moderate'
    case 'challenging':  return course.difficulty === 'challenging'
    case 'faro_30':      return faroMinutes(course, fao) <= 30
    case 'faro_60':      return faroMinutes(course, fao) <= 60
    case 'faro_90':      return faroMinutes(course, fao) <= 90
    default:             return true
  }
}

type FaoLike = { lat: number; lng: number; road_factor: number; avg_speed_kmh: number }

function applyFilters(
  courses: Course[],
  active: Set<string>,
  fao: FaoLike,
  hcpMen: number | null,
  hcpLadies: number | null,
): Course[] {
  if (active.size === 0 && hcpMen == null && hcpLadies == null) return courses

  const top10Ids: Set<string> | null = active.has('top_rated')
    ? new Set(
        [...courses]
          .filter(c => c.rating != null)
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, 10)
          .map(c => c.id)
      )
    : null

  const activeHoles   = [...active].filter(k => HOLE_FILTERS.has(k))
  const activeDiff    = [...active].filter(k => DIFF_FILTERS.has(k))
  const activeFaro    = [...active].filter(k => FARO_FILTERS.has(k))
  const activeSingles = [...active].filter(k =>
    k !== 'top_rated' && !HOLE_FILTERS.has(k) && !DIFF_FILTERS.has(k) && !FARO_FILTERS.has(k)
  )

  return courses.filter(c => {
    if (top10Ids && !top10Ids.has(c.id)) return false
    for (const k of activeSingles) {
      if (!matchFilter(c, k, fao)) return false
    }
    if (activeHoles.length > 0 && !activeHoles.some(k => matchFilter(c, k, fao))) return false
    if (activeDiff.length  > 0 && !activeDiff.some(k  => matchFilter(c, k, fao))) return false
    if (activeFaro.length  > 0 && !activeFaro.some(k  => matchFilter(c, k, fao))) return false
    // handicap_required_men = max HCP allowed. I qualify if my HCP <= that limit.
    if (hcpMen != null && c.handicap_required_men != null && c.handicap_required_men < hcpMen) return false
    if (hcpLadies != null && c.handicap_required_ladies != null && c.handicap_required_ladies < hcpLadies) return false
    return true
  })
}

const FAO_FALLBACK: FaoLike = { lat: 37.0144, lng: -7.9659, road_factor: 1.35, avg_speed_kmh: 75 }

export function HomeClient({ courses, hotels, shops, airports }: HomeClientProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [panelId, setPanelId] = useState<string | null>(null)
  const [plannerOpen, setPlannerOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())
  const [hcpMen, setHcpMen] = useState<number | null>(null)
  const [hcpLadies, setHcpLadies] = useState<number | null>(null)
  const [plannedIds, setPlannedIds] = useState<Set<string>>(new Set())
  const [plannerHotels, setPlannerHotels] = useState<(Hotel & { distance_km: number })[]>([])
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [comparePopupOpen, setComparePopupOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [compareAnchorRect, setCompareAnchorRect] = useState<DOMRect | null>(null)
  const compareButtonRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapViewHandle | null>(null)
  const carouselRef = useRef<BottomCarouselHandle | null>(null)

  useEffect(() => { trackPageView('home') }, [])

  const fao = airports.find(a => a.code === 'FAO') ?? FAO_FALLBACK
  const showTop10 = courses.filter(c => (c.review_count ?? 0) >= 3).length > 10

  const filteredCourses = useMemo(
    () => applyFilters(courses, activeFilters, fao, hcpMen, hcpLadies),
    [courses, activeFilters, fao, hcpMen, hcpLadies]
  )

  const handleToggleFilter = useCallback((key: string) => {
    if (!activeFilters.has(key)) trackFilter(key)
    setActiveFilters(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [activeFilters])

  const handleClearFilters = useCallback(() => {
    setActiveFilters(new Set())
    setHcpMen(null)
    setHcpLadies(null)
  }, [])

  const handleSelectFromMap = useCallback((id: string | null) => {
    setSelectedId(id)
    setPanelId(null)
    if (id) carouselRef.current?.scrollToId(id)
  }, [])

  const handleSelectFromCarousel = useCallback((id: string) => {
    setSelectedId(id)
    setPanelId(id)
  }, [])

  const handlePlannerResult = useCallback((result: PlannerResult | null) => {
    if (result) {
      mapRef.current?.drawZone(result.zone, result.type, result.center)
    } else {
      mapRef.current?.clearZone()
    }
  }, [])

  const handleTogglePlan = useCallback((id: string) => {
    setPlannedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const handleClearPlan = useCallback(() => {
    setPlannedIds(new Set())
  }, [])

  const handleToggleCompare = useCallback((id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 4) return prev
      return [...prev, id]
    })
  }, [])

  const handleClearCompare = useCallback(() => {
    setCompareIds([])
    setCompareOpen(false)
    setComparePopupOpen(false)
  }, [])

  const handleOpenCompare = useCallback(() => {
    setCompareOpen(true)
    setComparePopupOpen(false)
  }, [])
  const handleCloseCompare = useCallback(() => setCompareOpen(false), [])

  const handleOpenPlanner = useCallback(() => {
    setSelectedId(null)
    setPlannerOpen(true)
  }, [])

  const handleClosePlanner = useCallback(() => {
    setPlannerOpen(false)
    setPlannerHotels([])
    mapRef.current?.clearZone()
  }, [])

  const handleClosePanel = useCallback(() => {
    setPanelId(null)
  }, [])

  const panelCourse = courses.find(c => c.id === panelId) ?? null
  const compareCourses = compareIds.map(id => courses.find(c => c.id === id)).filter(Boolean) as typeof courses

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <MapView
        ref={mapRef}
        courses={filteredCourses}
        hotels={hotels}
        shops={shops}
        airports={airports}
        selectedId={selectedId}
        plannedIds={plannedIds}
        plannerHotels={plannerHotels}
        onSelect={handleSelectFromMap}
      />

      {!plannerOpen && (
        <TopBar
          activeFilters={activeFilters}
          onToggleFilter={handleToggleFilter}
          onClearFilters={handleClearFilters}
          hcpMen={hcpMen}
          hcpLadies={hcpLadies}
          onSetHcpMen={setHcpMen}
          onSetHcpLadies={setHcpLadies}
          showTop10={showTop10}
          rightSlot={
            <>
              {compareIds.length > 0 && (
                <>
                  {comparePopupOpen && (
                    <ComparePopup
                      courses={compareCourses}
                      onRemove={handleToggleCompare}
                      onCompare={handleOpenCompare}
                      onClose={() => setComparePopupOpen(false)}
                      anchorRect={compareAnchorRect}
                    />
                  )}
                  <div ref={compareButtonRef} style={{ display: 'inline-flex' }}>
                    <CompareButton
                      count={compareIds.length}
                      onClick={() => {
                        setCompareAnchorRect(compareButtonRef.current?.getBoundingClientRect() ?? null)
                        setComparePopupOpen(p => !p)
                      }}
                    />
                  </div>
                </>
              )}
              <button
                onClick={() => setContactOpen(true)}
                style={{
                  height: 44, padding: '0 16px',
                  background: '#fff', color: '#222',
                  border: '1px solid #ebebeb', borderRadius: 22,
                  fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                  boxShadow: '0 1px 6px rgba(0,0,0,.06)',
                  whiteSpace: 'nowrap',
                }}
              >
                Contact
              </button>
              <button
                onClick={handleOpenPlanner}
                style={{
                  height: 44,
                  padding: '0 18px',
                  background: '#2A6B4A',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 22,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(224,69,94,.35)',
                  fontFamily: 'var(--font-body)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  whiteSpace: 'nowrap',
                }}
              >
                <BedDouble size={16} strokeWidth={2.2} /> Find Your Base
              </button>
            </>
          }
        />
      )}


      {!plannerOpen && (
        <div className="absolute z-10" style={{ bottom: 232, right: 20 }}>
          <div style={{
            display: 'flex', flexDirection: 'column',
            background: '#ffffff', border: '1px solid #ebebeb',
            borderRadius: 12, overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,.12)',
          }}>
            <ZoomButton icon="+" onClick={() => mapRef.current?.zoomIn()} border />
            <ZoomButton icon="−" onClick={() => mapRef.current?.zoomOut()} />
          </div>
        </div>
      )}

      {!plannerOpen && (
        <BottomCarousel
          ref={carouselRef}
          courses={filteredCourses}
          allCourses={courses}
          selectedId={selectedId}
          onSelect={handleSelectFromCarousel}
          plannedIds={plannedIds}
          onTogglePlan={handleTogglePlan}
          compareIds={compareIds}
          onToggleCompare={handleToggleCompare}
        />
      )}

      {panelCourse && !plannerOpen && (
        <CoursePanel course={panelCourse} allCourses={courses} onClose={handleClosePanel} />
      )}

      {compareOpen && compareCourses.length >= 2 && (
        <CompareModal
          courses={compareCourses}
          onClose={handleCloseCompare}
          onRemove={handleToggleCompare}
        />
      )}

      {plannerOpen && (
        <PlannerPanel
          courses={courses}
          selectedIds={plannedIds}
          onToggle={handleTogglePlan}
          onClear={handleClearPlan}
          onResult={handlePlannerResult}
          onHotels={setPlannerHotels}
          onClose={handleClosePlanner}
        />
      )}

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </main>
  )
}

function ZoomButton({ icon, onClick, border }: { icon: string; onClick: () => void; border?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 42, height: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', border: 'none',
        borderBottom: border ? '1px solid #ebebeb' : 'none',
        cursor: 'pointer', fontSize: 20, fontWeight: 300,
        color: '#222', lineHeight: 1,
      }}
    >
      {icon}
    </button>
  )
}
