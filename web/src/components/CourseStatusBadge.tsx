import { getCourseStatus, type CourseStatusKind } from '@/data/course-status'

// Small pill for map cards and course lists: "Closed until mid-2028",
// "Private members club", "Reopened Sept 2026". Facility notices (e.g. a
// closed driving range) only appear on the course page, not here.

const COLORS: Partial<Record<CourseStatusKind, { bg: string; fg: string }>> = {
  closed:   { bg: '#FDECEC', fg: '#8A1F1F' },
  private:  { bg: '#EDEDF1', fg: '#3A3A48' },
  reopened: { bg: '#E8F5EC', fg: '#1E5B32' },
}

export function CourseStatusBadge({ slug, size = 'md', style }: { slug: string; size?: 'sm' | 'md'; style?: React.CSSProperties }) {
  const status = getCourseStatus(slug)
  const c = status && COLORS[status.kind]
  if (!status || !c) return null
  return (
    <span style={{
      display: 'inline-block', alignSelf: 'flex-start',
      fontSize: size === 'sm' ? 10.5 : 12, fontWeight: 700, lineHeight: 1.3,
      padding: size === 'sm' ? '2px 7px' : '3px 10px', borderRadius: 10,
      background: c.bg, color: c.fg, whiteSpace: 'nowrap',
      ...style,
    }}>
      {status.badge}
    </span>
  )
}
