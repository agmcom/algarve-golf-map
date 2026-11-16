import Link from 'next/link'
import { withUtm } from '@/lib/utm'
import { formatCheckedDate, type CourseStatus, type CourseStatusKind } from '@/data/course-status'

// "Is it open?" notice shown at the top of a course page (and its sub-pages)
// when a course is closed, private, recently reopened or has a closed facility.

const THEME: Record<CourseStatusKind, { bg: string; border: string; fg: string; icon: string }> = {
  closed:   { bg: '#FDECEC', border: '#F3C2C2', fg: '#8A1F1F', icon: '⛔' },
  private:  { bg: '#F1F1F4', border: '#D9D9E0', fg: '#3A3A48', icon: '🔒' },
  reopened: { bg: '#E8F5EC', border: '#BFE3CA', fg: '#1E5B32', icon: '✅' },
  facility: { bg: '#FFF4DB', border: '#F2DCA6', fg: '#7A5200', icon: '⚠️' },
}

export function CourseStatusNotice({ status, compact = false }: { status: CourseStatus; compact?: boolean }) {
  const t = THEME[status.kind]
  return (
    <aside
      role="note"
      aria-label="Course status"
      style={{
        background: t.bg, border: `1px solid ${t.border}`, color: t.fg,
        borderRadius: 14, padding: compact ? '12px 16px' : '16px 20px',
        margin: compact ? '0 0 20px' : '24px 0 8px',
      }}
    >
      <div style={{ fontSize: compact ? 15 : 17, fontWeight: 800, lineHeight: 1.35 }}>
        <span aria-hidden="true" style={{ marginRight: 8 }}>{t.icon}</span>
        {status.headline}
      </div>
      {!compact && (
        <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: '8px 0 0' }}>{status.detail}</p>
      )}
      <div style={{ fontSize: 12.5, lineHeight: 1.5, marginTop: 8, opacity: 0.85 }}>
        Checked {formatCheckedDate(status.checked)} ·{' '}
        {status.sources.map((s, i) => (
          <span key={s.url}>
            {i > 0 && ' · '}
            <a href={withUtm(s.url)} target="_blank" rel="noopener noreferrer nofollow" style={{ color: 'inherit' }}>{s.label}</a>
          </span>
        ))}
      </div>
      {status.link && (
        <Link
          href={status.link.href}
          style={{ display: 'inline-block', marginTop: 10, fontSize: 14, fontWeight: 700, color: t.fg }}
        >
          {status.link.label} →
        </Link>
      )}
    </aside>
  )
}
