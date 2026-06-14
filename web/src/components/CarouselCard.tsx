import { useState, useEffect } from 'react'
import type { Course } from '@/types/database'
import { faroDistance, formatDriveTime } from '@/lib/distance'
import { Scale } from 'lucide-react'

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 640)
    fn()
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return mobile
}

interface CarouselCardProps {
  course: Course
  selected: boolean
  onSelect: (id: string) => void
  planned?: boolean
  onTogglePlan?: (id: string) => void
  compared?: boolean
  onToggleCompare?: (id: string) => void
}

const PEXELS_FALLBACK = 'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop'

function heroUrl(course: Course): string {
  return course.photos?.find(p => p.is_hero)?.url ?? PEXELS_FALLBACK
}

export function CarouselCard({ course, selected, onSelect, planned = false, onTogglePlan, compared = false, onToggleCompare }: CarouselCardProps) {
  const { km, mins } = faroDistance(course.lat, course.lng)
  const isMobile = useIsMobile()

  return (
    <div
      onClick={() => onSelect(course.id)}
      style={{
        flexShrink: 0,
        width: 240,
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
      <div style={{ position: 'relative', height: 130, flexShrink: 0, background: '#d4e6c3', overflow: 'hidden' }}>
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
              width: 28, height: 28, borderRadius: '50%',
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
        {course.rating != null && (
          <span style={{
            position: 'absolute', bottom: 8, right: 8,
            display: 'flex', alignItems: 'center', gap: 3,
            background: 'rgba(0,0,0,.52)', borderRadius: 10,
            padding: '3px 7px',
          }}>
            <StarRating value={course.rating} />
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Name */}
        <div style={{
          fontSize: 13.5, fontWeight: 700, lineHeight: 1.2, color: '#222',
          overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
        }}>
          {course.name}
        </div>

        {/* Location + distance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 11.5, color: '#6a6a6a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {course.town}
          </div>
          <div style={{ fontSize: 11, color: '#b0b0b0', whiteSpace: 'nowrap' }}>
            ✈ Faro · ~{km} km · {formatDriveTime(mins)}
          </div>
        </div>

        {/* Footer: holes + price */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4, borderTop: '1px solid #f4f4f4' }}>
          <span style={{ fontSize: 11, color: '#888' }}>
            {course.holes}h · par {course.par}
          </span>
          {course.price_from != null && (
            <span style={{ fontSize: 11.5, color: '#222' }}>
              <strong style={{ fontWeight: 700, fontSize: 14 }}>€{course.price_from}</strong>
              <span style={{ color: '#999' }}> /round</span>
            </span>
          )}
        </div>
      </div>

    </div>
  )
}

function CompareIcon({ active }: { active: boolean }) {
  return <Scale size={14} strokeWidth={2.2} color={active ? '#fff' : '#888'} />
}


function StarRating({ value }: { value: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="#f5c842">
        <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.8l1.2-6.6L2.5 9l6.6-.9z" />
      </svg>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{value.toFixed(1)}</span>
    </div>
  )
}

