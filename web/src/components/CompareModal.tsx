'use client'

import { useState, useEffect } from 'react'
import type { Course } from '@/types/database'
import { faroDistance, formatDriveTime } from '@/lib/distance'

const PEXELS_FALLBACK = 'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop'

function heroUrl(course: Course): string {
  return course.photos?.find(p => p.is_hero)?.url ?? PEXELS_FALLBACK
}

function metersToYards(m: number | null): string {
  if (m == null) return '—'
  return Math.round(m * 1.094).toLocaleString() + ' y'
}

function diffLabel(d: string | null): string {
  if (!d) return '—'
  return d.charAt(0).toUpperCase() + d.slice(1)
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return mobile
}

const FACILITIES: { key: keyof Course; label: string }[] = [
  { key: 'driving_range', label: 'Driving Range' },
  { key: 'putting_green', label: 'Putting Green' },
  { key: 'golf_academy', label: 'Golf Academy' },
  { key: 'pro_shop', label: 'Pro Shop' },
  { key: 'restaurant', label: 'Restaurant' },
  { key: 'offers_rental', label: 'Club Hire' },
  { key: 'caddie_service', label: 'Caddie Service' },
]

function Check({ yes }: { yes: boolean }) {
  return (
    <span style={{ fontWeight: 700, fontSize: 15, color: yes ? '#22a06b' : '#d0d0d0' }}>
      {yes ? '✓' : '✗'}
    </span>
  )
}

// ── Desktop table ──────────────────────────────────────────────────────────────

function DesktopTable({ courses, onRemove }: { courses: Course[]; onRemove: (id: string) => void }) {
  const colW = Math.max(150, Math.floor(700 / courses.length))

  return (
    <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 500 }}>
        <thead>
          <tr style={{ background: '#fafafa' }}>
            <th style={{ width: 150, padding: '14px 16px', borderBottom: '2px solid #ebebeb' }} />
            {courses.map(c => (
              <th key={c.id} style={{ width: colW, padding: '12px 16px', borderBottom: '2px solid #ebebeb', textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                  <div style={{ height: 80, borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={heroUrl(c)} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#222', lineHeight: 1.3 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: '#6a6a6a', marginTop: 2 }}>{c.town}</div>
                  <button
                    onClick={() => onRemove(c.id)}
                    style={{
                      position: 'absolute', top: -4, right: -4,
                      width: 20, height: 20, borderRadius: '50%',
                      background: '#ebebeb', border: 'none', cursor: 'pointer',
                      fontSize: 13, color: '#888',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    title="Remove"
                  >×</button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            {
              label: 'Price / round',
              render: (c: Course) => c.price_from != null
                ? <strong style={{ fontSize: 14 }}>€{c.price_from}</strong>
                : '—',
            },
            { label: 'Holes', render: (c: Course) => c.holes },
            { label: 'Par', render: (c: Course) => c.par ?? '—' },
            { label: 'Distance', render: (c: Course) => metersToYards(c.length_meters) },
            { label: 'Slope rating', render: (c: Course) => c.slope_rating ?? '—' },
            { label: 'Difficulty', render: (c: Course) => diffLabel(c.difficulty) },
            { label: 'Men HCP max', render: (c: Course) => c.handicap_required_men ?? '—' },
            { label: 'Ladies HCP max', render: (c: Course) => c.handicap_required_ladies ?? '—' },
            {
              label: 'Faro airport',
              render: (c: Course) => {
                const { km, mins } = faroDistance(c.lat, c.lng)
                return `${km} km · ${formatDriveTime(mins)}`
              },
            },
            { label: 'Designer', render: (c: Course) => c.designer ?? '—' },
            {
              label: 'On-site hotel',
              render: (c: Course) => c.has_own_hotel ? (c.onsite_hotel?.name ?? 'Yes') : '—',
            },
            {
              label: 'Dress code',
              render: (c: Course) => (
                <span style={{ fontSize: 11, lineHeight: 1.3 }}>{c.dress_code ?? '—'}</span>
              ),
            },
          ].map(row => (
            <tr key={row.label}>
              <td style={{
                padding: '10px 16px', fontSize: 12, color: '#6a6a6a', fontWeight: 600,
                borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap', verticalAlign: 'middle',
              }}>
                {row.label}
              </td>
              {courses.map(c => (
                <td key={c.id} style={{
                  padding: '10px 16px', fontSize: 13, color: '#222',
                  borderBottom: '1px solid #f0f0f0', textAlign: 'center', verticalAlign: 'middle',
                }}>
                  {row.render(c)}
                </td>
              ))}
            </tr>
          ))}

          {/* Facilities section header */}
          <tr>
            <td colSpan={courses.length + 1} style={{
              padding: '10px 16px 4px', fontSize: 11, fontWeight: 700,
              color: '#b0b0b0', letterSpacing: '.06em', textTransform: 'uppercase',
              borderBottom: '1px solid #f0f0f0',
            }}>
              Facilities
            </td>
          </tr>

          {FACILITIES.map(f => (
            <tr key={f.key}>
              <td style={{
                padding: '10px 16px', fontSize: 12, color: '#6a6a6a', fontWeight: 600,
                borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap', verticalAlign: 'middle',
              }}>
                {f.label}
              </td>
              {courses.map(c => (
                <td key={c.id} style={{
                  padding: '10px 16px', borderBottom: '1px solid #f0f0f0',
                  textAlign: 'center', verticalAlign: 'middle',
                }}>
                  <Check yes={!!c[f.key]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Mobile card view ───────────────────────────────────────────────────────────

function MobileCards({ courses, onRemove }: { courses: Course[]; onRemove: (id: string) => void }) {
  const [idx, setIdx] = useState(0)
  const safeIdx = Math.min(idx, courses.length - 1)
  const course = courses[safeIdx]

  const { km, mins } = faroDistance(course.lat, course.lng)

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: 'Price / round', value: course.price_from != null ? <strong>€{course.price_from}</strong> : '—' },
    { label: 'Holes', value: course.holes },
    { label: 'Par', value: course.par ?? '—' },
    { label: 'Distance', value: metersToYards(course.length_meters) },
    { label: 'Slope rating', value: course.slope_rating ?? '—' },
    { label: 'Difficulty', value: diffLabel(course.difficulty) },
    { label: 'Men HCP max', value: course.handicap_required_men ?? '—' },
    { label: 'Ladies HCP max', value: course.handicap_required_ladies ?? '—' },
    { label: 'Faro airport', value: `${km} km · ${formatDriveTime(mins)}` },
    { label: 'Designer', value: course.designer ?? '—' },
    { label: 'On-site hotel', value: course.has_own_hotel ? (course.onsite_hotel?.name ?? 'Yes') : '—' },
    { label: 'Dress code', value: <span style={{ fontSize: 11 }}>{course.dress_code ?? '—'}</span> },
    ...FACILITIES.map(f => ({ label: f.label, value: <Check yes={!!course[f.key]} /> })),
  ]

  function handleRemove() {
    onRemove(course.id)
    setIdx(i => Math.min(i, courses.length - 2))
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Navigator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', borderBottom: '1px solid #ebebeb', flexShrink: 0,
      }}>
        <NavArrow dir="left" disabled={safeIdx === 0} onClick={() => setIdx(i => i - 1)} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#222' }}>{course.name}</div>
          <div style={{ fontSize: 11, color: '#6a6a6a' }}>{safeIdx + 1} of {courses.length}</div>
        </div>
        <NavArrow dir="right" disabled={safeIdx === courses.length - 1} onClick={() => setIdx(i => i + 1)} />
      </div>

      {/* Photo */}
      <div style={{ height: 120, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroUrl(course)} alt={course.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <button
          onClick={handleRemove}
          style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(255,255,255,.9)', border: 'none', borderRadius: 12,
            padding: '4px 10px', fontSize: 11, color: '#2B6090', cursor: 'pointer', fontWeight: 600,
          }}
        >Remove</button>
      </div>

      {/* Attribute rows */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {rows.map(r => (
          <div key={r.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 0', borderBottom: '1px solid #f0f0f0',
          }}>
            <span style={{ fontSize: 12, color: '#6a6a6a', fontWeight: 600 }}>{r.label}</span>
            <span style={{ fontSize: 13, color: '#222', textAlign: 'right', maxWidth: '55%' }}>{r.value}</span>
          </div>
        ))}
        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}

function NavArrow({ dir, disabled, onClick }: { dir: 'left' | 'right'; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 32, height: 32, borderRadius: '50%',
        border: '1px solid #ebebeb', background: '#fff',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 18, color: disabled ? '#d0d0d0' : '#222',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {dir === 'left' ? '‹' : '›'}
    </button>
  )
}

// ── Main export ────────────────────────────────────────────────────────────────

interface CompareModalProps {
  courses: Course[]
  onClose: () => void
  onRemove: (id: string) => void
}

export function CompareModal({ courses, onClose, onRemove }: CompareModalProps) {
  const isMobile = useIsMobile()

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,.4)',
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff',
        borderRadius: isMobile ? '20px 20px 0 0' : 16,
        width: isMobile ? '100%' : 'min(920px, 95vw)',
        height: isMobile ? '88vh' : 'min(80vh, 700px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,.25)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid #ebebeb', flexShrink: 0,
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#222' }}>
            Comparing {courses.length} course{courses.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 22, color: '#888', lineHeight: 1, padding: 4,
            }}
          >×</button>
        </div>

        {isMobile
          ? <MobileCards courses={courses} onRemove={onRemove} />
          : <DesktopTable courses={courses} onRemove={onRemove} />
        }
      </div>
    </div>
  )
}
