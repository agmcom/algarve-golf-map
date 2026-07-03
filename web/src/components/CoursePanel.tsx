'use client'

import type { Course } from '@/types/database'
import { faroDistance, formatDriveTime, nearestCourses } from '@/lib/distance'

interface CoursePanelProps {
  course: Course
  allCourses: Course[]
  onClose: () => void
}

const PEXELS_FALLBACK = 'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'

function heroUrl(course: Course): string {
  return course.photos?.find(p => p.is_hero)?.url ?? PEXELS_FALLBACK
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy:        'Easy · slope < 120',
  moderate:    'Moderate · slope 120–130',
  challenging: 'Challenging · slope > 130',
}

const DIFFICULTY_DOTS: Record<string, number> = {
  easy: 1,
  moderate: 2,
  challenging: 3,
}

export function CoursePanel({ course, allCourses, onClose }: CoursePanelProps) {
  const { km, mins } = faroDistance(course.lat, course.lng)
  const nearby = nearestCourses(course.lat, course.lng, course.id, allCourses)
  const facilities = [
    course.has_own_hotel   && 'Hotel on-site',
    course.driving_range   && 'Driving range',
    course.pro_shop        && 'Pro shop',
    course.restaurant      && 'Restaurant',
    course.caddie_service  && 'Caddie service',
    course.offers_rental   && 'Club hire',
  ].filter(Boolean) as string[]

  return (
    <>
      {/* Desktop: sidebar — Mobile: bottom sheet */}
      <div className="course-panel" style={{ position: 'relative' }}>

        {/* Close button — pinned in place, scrolls with nothing */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 12, right: 12, zIndex: 1,
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(0,0,0,.45)', border: 'none',
          color: '#fff', fontSize: 16, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>

        {/* Scrollable content — hero photo scrolls away with the rest */}
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* Hero photo */}
          <div style={{ position: 'relative', height: 200, background: '#d4e6c3', flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroUrl(course)}
              alt={course.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 50%)',
            }} />
          </div>

          {/* Body */}
          <div style={{ padding: '16px 18px 24px' }}>

          {/* Name + location */}
          <div style={{ marginBottom: 14 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#222', margin: 0, lineHeight: 1.2 }}>
              {course.name}
            </h2>
            <div style={{ fontSize: 13, color: '#6a6a6a', marginTop: 4 }}>{course.town}</div>
          </div>

          {/* Tags */}
          {course.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {course.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: 11, fontWeight: 500, padding: '3px 9px',
                  borderRadius: 12, background: '#f4f4f4', color: '#444',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div style={{ width: '100%', height: 1, background: '#ebebeb', marginBottom: 16 }} />

          {/* Specs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', marginBottom: 16 }}>
            <Spec label="Holes" value={`${course.holes}`} />
            <Spec label="Par" value={course.par != null ? `${course.par}` : '—'} />
            <Spec label="✈ Faro Airport" value={`~${km} km · ${formatDriveTime(mins)}`} />
            <Spec label="Distance" value={course.length_meters != null ? `${course.length_meters.toLocaleString()} m` : '—'} />
            <Spec label="Designer" value={course.designer ?? '—'} />
            {(course.handicap_required_men != null || course.handicap_required_ladies != null) && (
              <Spec
                label="Max HCP"
                value={[
                  course.handicap_required_men != null ? `${course.handicap_required_men} mens` : null,
                  course.handicap_required_ladies != null ? `${course.handicap_required_ladies} ladies` : null,
                ].filter(Boolean).join(' / ')}
              />
            )}
            {course.difficulty && (
              <Spec label="Difficulty" value={DIFFICULTY_LABEL[course.difficulty]} />
            )}
          </div>

          {/* Facilities */}
          {facilities.length > 0 && (
            <>
              <div style={{ width: '100%', height: 1, background: '#ebebeb', marginBottom: 14 }} />
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#b0b0b0', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Facilities
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {facilities.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#333' }}>
                      <span style={{ color: '#22a06b', fontWeight: 700 }}>✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Nearby Courses */}
          {nearby.length > 0 && (
            <>
              <div style={{ width: '100%', height: 1, background: '#ebebeb', marginBottom: 14 }} />
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#b0b0b0', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Nearby Courses
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {nearby.map(n => (
                    <a key={n.id} href={`/courses/${n.slug}`} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '7px 10px', borderRadius: 9,
                      border: '1px solid #ebebeb', background: '#fafafa',
                      textDecoration: 'none',
                    }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        ⛳ {n.name}
                      </span>
                      <span style={{ fontSize: 11, color: '#b0b0b0', flexShrink: 0, marginLeft: 8 }}>{n.distanceKm} km</span>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          <div style={{ width: '100%', height: 1, background: '#ebebeb', marginBottom: 16 }} />

          {/* Price */}
          {course.price_from != null && (
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 12, color: '#6a6a6a' }}>From</span>
              <span style={{ fontSize: 26, fontWeight: 700, color: '#222' }}>€{course.price_from}</span>
              <span style={{ fontSize: 12, color: '#6a6a6a' }}>/ round</span>
            </div>
          )}

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a
              href={`/courses/${course.slug}`}
              style={{
                display: 'block', textAlign: 'center',
                padding: '12px 0', borderRadius: 12,
                background: '#2B6090', color: '#fff',
                fontSize: 14, fontWeight: 700, textDecoration: 'none',
              }}
            >
              View full profile →
            </a>
            {course.booking_url && (
              <a
                href={course.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', textAlign: 'center',
                  padding: '12px 0', borderRadius: 12,
                  background: '#f4f4f4', color: '#222',
                  fontSize: 14, fontWeight: 600, textDecoration: 'none',
                }}
              >
                Book
              </a>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      <div className="course-panel-backdrop" onClick={onClose} />
    </>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#b0b0b0', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#222' }}>{value}</div>
    </div>
  )
}
