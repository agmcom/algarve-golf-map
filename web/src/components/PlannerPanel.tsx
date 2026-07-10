'use client'

import { useState, useEffect } from 'react'
import { BedDouble } from 'lucide-react'
import { calculateZone, maxMinutesToCourses, type PlannerResult } from '@/lib/planner'
import { getHotelsNear } from '@/lib/queries'
import type { Course, Hotel } from '@/types/database'

const TIME_OPTIONS = [15, 30, 45, 60]

interface PlannerPanelProps {
  courses: Course[]
  selectedIds: Set<string>
  onToggle: (id: string) => void
  onClear: () => void
  onResult: (result: PlannerResult | null) => void
  onHotels?: (hotels: (Hotel & { distance_km: number })[]) => void
  onClose: () => void
}

export function PlannerPanel({ courses, selectedIds, onToggle, onClear, onResult, onHotels, onClose }: PlannerPanelProps) {
  const [maxMinutes, setMaxMinutes] = useState(30)
  const [result, setResult] = useState<PlannerResult | null>(null)

  function toggleCourse(id: string) {
    onToggle(id)
    setResult(null)
    onResult(null)
  }

  function calculate() {
    const selected = courses.filter(c => selectedIds.has(c.id))
    if (selected.length === 0) return
    const res = calculateZone(selected, maxMinutes)
    setResult(res)
    onResult(res)
  }

  function reset() {
    onClear()
    setResult(null)
    onResult(null)
  }

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, bottom: 0, zIndex: 20,
      width: 340, background: '#ffffff', borderRight: '1px solid #ebebeb',
      boxShadow: '4px 0 24px rgba(0,0,0,.10)',
      display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #ebebeb', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BedDouble size={18} strokeWidth={2} color="#222" />
              <span style={{ fontSize: 17, fontWeight: 700, color: '#222' }}>Find Your Base</span>
            </div>
            <div style={{ fontSize: 12, color: '#6a6a6a', marginTop: 4 }}>Select courses to play — we'll find the ideal area to stay</div>
          </div>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

        {/* Course selection */}
        <div style={{ marginBottom: 20 }}>
          <div style={sectionLabel}>
            Courses to play
            {selectedIds.size > 0 && (
              <button onClick={reset} style={resetBtn}>Clear</button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {courses.map(course => {
              const checked = selectedIds.has(course.id)
              return (
                <label key={course.id} style={courseRow(checked)}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCourse(course.id)}
                    style={{ accentColor: '#2B6090', width: 16, height: 16, flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: checked ? 600 : 400, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      ⛳ {course.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#6a6a6a', marginTop: 1 }}>{course.town}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#6a6a6a', flexShrink: 0 }}>€{course.price_from ?? '—'}</div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Max travel time */}
        <div style={{ marginBottom: 20 }}>
          <div style={sectionLabel}>Max travel time</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {TIME_OPTIONS.map(min => (
              <button
                key={min}
                onClick={() => { setMaxMinutes(min); setResult(null); onResult(null) }}
                style={timeBtn(maxMinutes === min)}
              >
                {min} min
              </button>
            ))}
          </div>
        </div>

        {/* Calculate */}
        <button
          onClick={calculate}
          disabled={selectedIds.size === 0}
          style={calcBtn(selectedIds.size > 0)}
        >
          Find my zone →
        </button>

        {/* Results */}
        {result && <Results result={result} onHotels={onHotels} />}

      </div>
    </div>
  )
}

function Results({ result, onHotels }: { result: PlannerResult; onHotels?: (hotels: (Hotel & { distance_km: number })[]) => void }) {
  const [hotels, setHotels] = useState<(Hotel & { distance_km: number })[]>([])

  useEffect(() => {
    getHotelsNear(result.center[1], result.center[0], 20).then(h => {
      setHotels(h)
      onHotels?.(h)
    })
  }, [result.center]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ width: '100%', height: 1, background: '#ebebeb', marginBottom: 20 }} />

      {/* Warning if fallback */}
      {result.warning && (
        <div style={{
          background: '#fff8e6', border: '1px solid #f5d87a', borderRadius: 10,
          padding: '10px 12px', marginBottom: 14, fontSize: 12, color: '#7a5c00', lineHeight: 1.5,
        }}>
          ⚠️ {result.warning}
        </div>
      )}

      {/* Hotels */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#b0b0b0', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 10 }}>
          Where to stay
        </div>

        {hotels.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            {hotels.map(h => {
              const isOnsiteForSelection = result.courseTimes.some(ct => ct.course.onsite_hotel_id === h.id)
              return (
              <a
                key={h.id}
                href={h.booking_url ?? `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(h.name + ' Algarve')}&utm_source=algarvegolfmap.com`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', padding: '10px 12px', borderRadius: 10,
                  border: '1px solid #ebebeb', background: '#fafafa',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {h.name}
                      </span>
                      {isOnsiteForSelection && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: '#22a06b',
                          background: '#edf7f2', border: '1px solid #b8e8d0',
                          borderRadius: 6, padding: '1px 6px',
                          letterSpacing: '.02em', flexShrink: 0,
                        }}>
                          On-site
                        </span>
                      )}
                    </div>
                    {h.stars && (
                      <div style={{ fontSize: 11, color: '#f5a623', marginTop: 2 }}>
                        {'★'.repeat(h.stars)}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: '#6a6a6a', flexShrink: 0, marginLeft: 8, marginTop: 2, textAlign: 'right' }}>
                    <div>~{maxMinutesToCourses(h.lat, h.lng, result.courseTimes.map(ct => ct.course))} min</div>
                    <div style={{ fontSize: 9, color: '#b0b0b0' }}>max to ⛳</div>
                  </div>
                </div>
              </a>
              )
            })}
          </div>
        )}

        <a
          href={`https://www.booking.com/searchresults.html?latitude=${result.center[1]}&longitude=${result.center[0]}&radius=20&order=popularity&utm_source=algarvegolfmap.com`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '13px 16px', borderRadius: 10,
            background: '#003580', color: '#fff',
            textDecoration: 'none', fontSize: 14, fontWeight: 700,
          }}
        >
          🏨 {hotels.length > 0 ? 'See all hotels on Booking.com' : 'Find hotels in this area'}
        </a>
      </div>
    </div>
  )
}

// ---- Styles ----

const sectionLabel: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  fontSize: 11, fontWeight: 600, color: '#b0b0b0',
  letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 10,
}

const resetBtn: React.CSSProperties = {
  fontSize: 11, color: '#2B6090', background: 'none', border: 'none',
  cursor: 'pointer', fontWeight: 500, padding: 0,
}

const closeBtn: React.CSSProperties = {
  width: 30, height: 30, borderRadius: '50%', border: 'none',
  background: '#f4f4f4', cursor: 'pointer', fontSize: 14,
  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6a6a6a',
}

function courseRow(checked: boolean): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px',
    borderRadius: 10, cursor: 'pointer',
    background: checked ? '#eef7f2' : '#fafafa',
    border: `1px solid ${checked ? '#2B6090' : '#ebebeb'}`,
    transition: 'background .12s, border-color .12s',
  }
}

function timeBtn(active: boolean): React.CSSProperties {
  return {
    flex: 1, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
    fontSize: 13, fontWeight: 600,
    background: active ? '#2B6090' : '#f4f4f4',
    color: active ? '#fff' : '#4a4a4a',
    transition: 'background .12s, color .12s',
  }
}

function calcBtn(enabled: boolean): React.CSSProperties {
  return {
    width: '100%', height: 44, borderRadius: 10, border: 'none',
    cursor: enabled ? 'pointer' : 'not-allowed',
    background: enabled ? '#2B6090' : '#f4f4f4',
    color: enabled ? '#fff' : '#b0b0b0',
    fontSize: 14, fontWeight: 700,
    transition: 'background .15s, color .15s',
  }
}

