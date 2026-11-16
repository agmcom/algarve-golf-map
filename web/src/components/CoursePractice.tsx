import Link from 'next/link'
import { withUtm } from '@/lib/utm'
import { PRACTICE_LAST_CHECKED_LABEL, practicePageHref, type PracticeGround } from '@/data/practice'

// "Practice facilities" section on a course page: driving range, short game, putting and ball prices.
export function CoursePractice({
  ground, courseSlug, courseName, courseNames,
}: {
  ground: PracticeGround
  courseSlug: string
  courseName: string
  /** slug → name for the other courses that share this practice ground */
  courseNames: Record<string, string>
}) {
  const shared = ground.courses.filter(s => s !== courseSlug)
  const pageHref = practicePageHref(ground)

  return (
    <section id="practice" style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#222', margin: '0 0 16px', paddingBottom: 10, borderBottom: '2px solid #ebebeb' }}>
        Practice facilities
      </h2>

      {ground.notice && (
        <p style={{ fontSize: 15, lineHeight: 1.6, color: '#7A5200', background: '#FFF4DB', borderRadius: 12, padding: '10px 14px', margin: '0 0 14px' }}>
          <strong>Note:</strong> {ground.notice}
        </p>
      )}

      <p style={{ fontSize: 17, lineHeight: 1.7, color: '#333', margin: 0 }}>{ground.summary}</p>

      <dl style={{ margin: '14px 0 0', display: 'grid', gap: 8 }}>
        {ground.items.map(it => (
          <div key={it.label} style={{ display: 'grid', gridTemplateColumns: 'minmax(110px, 140px) 1fr', gap: 12, fontSize: 15, lineHeight: 1.6 }}>
            <dt style={{ fontWeight: 700, color: '#222' }}>{it.label}</dt>
            <dd style={{ margin: 0, color: '#444' }}>{it.detail}</dd>
          </div>
        ))}
      </dl>

      {ground.balls && (
        <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 12, border: '1px solid #ebebeb', background: '#fff', fontSize: 15, lineHeight: 1.6, color: '#333' }}>
          <strong style={{ color: '#222' }}>Range balls:</strong> {ground.balls.price}.
          <span style={{ display: 'block', fontSize: 12.5, color: '#767676', marginTop: 2 }}>
            From the{' '}
            <a href={withUtm(ground.balls.source.url)} target="_blank" rel="noopener noreferrer nofollow" style={{ color: '#767676' }}>{ground.balls.source.label}</a>.
            {' '}Prices can change, so confirm at the club.
          </span>
        </div>
      )}

      {shared.length > 0 && (
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#555', margin: '12px 0 0' }}>
          Shared with{' '}
          {shared.map((s, i) => (
            <span key={s}>
              {i > 0 && (i === shared.length - 1 ? ' and ' : ', ')}
              <Link href={`/courses/${s}`} style={{ color: '#2B6090', fontWeight: 500 }}>{courseNames[s] ?? s}</Link>
            </span>
          ))}.
        </p>
      )}

      <p style={{ fontSize: 15, lineHeight: 1.6, color: '#333', margin: '10px 0 0' }}>
        {pageHref && (
          <><Link href={pageHref} style={{ color: '#2B6090', fontWeight: 600 }}>See all {ground.courses.length > 1 ? ground.name : courseName} practice facilities →</Link>{ground.academy ? ' · ' : ''}</>
        )}
        {ground.academy && (
          <Link href={`/golf-academies/${ground.academy}`} style={{ color: '#2B6090', fontWeight: 600 }}>Lessons at the academy</Link>
        )}
      </p>

      <p style={{ fontSize: 12, lineHeight: 1.6, color: '#767676', margin: '14px 0 0' }}>
        Source:{' '}
        {ground.sources.map((s, i) => (
          <span key={s.url}>
            {i > 0 && ', '}
            <a href={withUtm(s.url)} target="_blank" rel="noopener noreferrer nofollow" style={{ color: '#767676' }}>{s.label}</a>
          </span>
        ))}
        . Checked {PRACTICE_LAST_CHECKED_LABEL}. Opening hours are rarely published, so ask the club before you go.
      </p>
    </section>
  )
}
