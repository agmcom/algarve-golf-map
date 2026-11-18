import { withUtm } from '@/lib/utm'
import { PACE_LAST_CHECKED, PACE_NOT_PUBLISHED, type PaceInfo } from '@/data/pace'

const sectionTitle = { fontSize: 18, fontWeight: 700, color: '#222', margin: '0 0 16px', paddingBottom: 10, borderBottom: '2px solid #ebebeb' } as const

export function CoursePace({ info }: { info: PaceInfo | 'not-published' }) {
  if (info === 'not-published') {
    return (
      <section id="pace-of-play" style={{ marginBottom: 36 }}>
        <h2 style={sectionTitle}>Pace of play</h2>
        <p style={{ fontSize: 17, lineHeight: 1.7, color: '#333', margin: 0 }}>{PACE_NOT_PUBLISHED}</p>
        <p style={{ fontSize: 12, lineHeight: 1.6, color: '#767676', margin: '14px 0 0' }}>Checked {PACE_LAST_CHECKED}.</p>
      </section>
    )
  }
  return (
    <section id="pace-of-play" style={{ marginBottom: 36 }}>
      <h2 style={sectionTitle}>Pace of play</h2>
      {info.target && (
        <span style={{ display: 'inline-block', fontSize: 14, fontWeight: 700, background: '#E8F0F8', color: '#1F4E79', borderRadius: 999, padding: '4px 12px', marginBottom: 10 }}>
          {info.target}
        </span>
      )}
      <p style={{ fontSize: 17, lineHeight: 1.7, color: '#333', margin: 0 }}>{info.summary}</p>
      <p style={{ fontSize: 12, lineHeight: 1.6, color: '#767676', margin: '14px 0 0' }}>
        Source:{' '}
        {info.sources.map((s, i) => (
          <span key={s.url + s.label}>
            {i > 0 && ', '}
            <a href={withUtm(s.url)} target="_blank" rel="noopener noreferrer nofollow" style={{ color: '#767676' }}>{s.label}</a>
          </span>
        ))}
        . Checked {PACE_LAST_CHECKED}. Rules can change, so check with the club when you book.
      </p>
    </section>
  )
}
