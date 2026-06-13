import type { Course } from '@/types/database'
import { faroDistance, formatDriveTime } from '@/lib/distance'
import { Scale } from 'lucide-react'

interface NearbyItem {
  id: string
  name: string
  slug: string
  distanceKm: number
}

interface CarouselCardProps {
  course: Course
  selected: boolean
  onSelect: (id: string) => void
  planned?: boolean
  onTogglePlan?: (id: string) => void
  compared?: boolean
  onToggleCompare?: (id: string) => void
  nearbyCourses?: NearbyItem[]
}

const PEXELS_FALLBACK = 'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop'

function heroUrl(course: Course): string {
  return course.photos?.find(p => p.is_hero)?.url ?? PEXELS_FALLBACK
}

export function CarouselCard({ course, selected, onSelect, planned = false, onTogglePlan, compared = false, onToggleCompare, nearbyCourses }: CarouselCardProps) {
  const { km, mins } = faroDistance(course.lat, course.lng)

  return (
    <div
      onClick={() => onSelect(course.id)}
      style={{
        flexShrink: 0,
        width: 250,
        height: 316,
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        border: `${selected ? '2.5px' : '1.5px'} solid ${selected ? '#2B6090' : '#ebebeb'}`,
        boxShadow: selected
          ? '0 8px 24px rgba(0,0,0,.16)'
          : '0 4px 16px rgba(0,0,0,.10)',
        transform: selected ? 'scale(1.06) translateY(-4px)' : 'none',
        transition: 'transform .2s ease, box-shadow .2s, border-color .15s',
        transformOrigin: 'bottom center',
      }}
    >
      {/* Photo */}
      <div style={{ position: 'relative', height: 116, flexShrink: 0, background: '#d4e6c3', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroUrl(course)}
          alt={course.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,.35) 0%, transparent 55%)',
          pointerEvents: 'none',
        }} />
        {onToggleCompare && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCompare(course.id) }}
            style={{
              position: 'absolute', top: 8, left: 8,
              width: 30, height: 30, borderRadius: '50%',
              background: compared ? '#2B6090' : 'rgba(255,255,255,.92)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,.18)',
              transition: 'background .15s',
            }}
            title={compared ? 'Remove from comparison' : 'Add to comparison'}
          >
            <CompareIcon active={compared} />
          </button>
        )}
        {course.tags[0] && (
          <span style={{
            position: 'absolute', bottom: 8, left: 8,
            fontSize: 10, fontWeight: 500, letterSpacing: '.03em', textTransform: 'uppercase',
            color: '#222', background: 'rgba(255,255,255,.92)',
            padding: '3px 8px', borderRadius: 12,
          }}>
            {course.tags[0]}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '10px 12px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
          <div style={{
            fontSize: 13, fontWeight: 600, lineHeight: 1.2, color: '#222',
            overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', flex: 1,
          }}>
            {course.name}
          </div>
          {course.rating != null && <StarRating value={course.rating} />}
        </div>

        <div style={{ marginTop: 3 }}>
          <div style={{ fontSize: 11, color: '#6a6a6a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{course.town}</div>
          <div style={{ fontSize: 11, color: '#b0b0b0', whiteSpace: 'nowrap' }}>✈ Faro · ~{km} km · {formatDriveTime(mins)}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 9 }}>
          <span style={{ fontSize: 11, color: '#6a6a6a' }}>
            {course.holes} holes · par {course.par}
          </span>
          {course.price_from != null && (
            <span style={{ fontSize: 12, color: '#222' }}>
              <strong style={{ fontWeight: 700, fontSize: 14 }}>€{course.price_from}</strong>
              <span style={{ color: '#6a6a6a' }}> / round</span>
            </span>
          )}
        </div>
      </div>

      {/* Nearby */}
      {nearbyCourses && nearbyCourses.length > 0 && (
        <div style={{ borderTop: '1px solid #f0f0f0', padding: '8px 12px 16px', flexShrink: 0 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#c0c0c0', letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 5 }}>
            ⛳ Nearby
          </div>
          {nearbyCourses.map(n => (
            <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 0' }}>
              <span style={{ fontSize: 11, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {n.name}
              </span>
              <span style={{ fontSize: 10, color: '#b0b0b0', flexShrink: 0, marginLeft: 8 }}>{n.distanceKm} km</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CompareIcon({ active }: { active: boolean }) {
  return <Scale size={14} strokeWidth={2.2} color={active ? '#fff' : '#888'} />
}


function StarRating({ value }: { value: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="#2B6090">
        <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.8l1.2-6.6L2.5 9l6.6-.9z" />
      </svg>
      <span style={{ fontSize: 11, fontWeight: 600, color: '#222' }}>{value.toFixed(2)}</span>
    </div>
  )
}

