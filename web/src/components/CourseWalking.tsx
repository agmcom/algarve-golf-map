import Link from 'next/link'
import { withUtm } from '@/lib/utm'
import { WALKING_LAST_CHECKED, type WalkingInfo, type WalkLevel } from '@/data/walking'

const PILL: Record<WalkLevel, { bg: string; fg: string }> = {
  easy: { bg: '#E6F4EA', fg: '#1E6B34' },
  moderate: { bg: '#FFF4DB', fg: '#7A5200' },
  hard: { bg: '#FDE8E4', fg: '#9A2E1C' },
}

const GUIDE: Record<WalkLevel, { href: string; text: string }> = {
  easy: { href: '/guide/algarve-golf-courses-you-can-walk', text: 'Algarve golf courses you can walk' },
  moderate: { href: '/guide/algarve-golf-courses-you-can-walk', text: 'Algarve golf courses you can walk' },
  hard: { href: '/guide/hilly-golf-courses-in-the-algarve', text: 'Hilly golf courses in the Algarve' },
}

export function CourseWalking({ info }: { info: WalkingInfo }) {
  const pill = PILL[info.level]
  const guide = GUIDE[info.level]

  return (
    <section id="walking" style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#222', margin: '0 0 16px', paddingBottom: 10, borderBottom: '2px solid #ebebeb' }}>Walking the course</h2>
      <span style={{ display: 'inline-block', fontSize: 14, fontWeight: 700, background: pill.bg, color: pill.fg, borderRadius: 999, padding: '4px 12px', marginBottom: 10 }}>
        {info.label}
      </span>
      <p style={{ fontSize: 17, lineHeight: 1.7, color: '#333', margin: 0 }}>{info.summary}</p>
      <p style={{ fontSize: 15, lineHeight: 1.6, color: '#333', margin: '10px 0 0' }}>
        See also: <Link href={guide.href} style={{ color: '#2B6090', fontWeight: 600 }}>{guide.text}</Link>.
      </p>
      <p style={{ fontSize: 12, lineHeight: 1.6, color: '#767676', margin: '14px 0 0' }}>
        Source:{' '}
        {info.sources.map((s, i) => (
          <span key={s.url}>
            {i > 0 && ', '}
            <a href={withUtm(s.url)} target="_blank" rel="noopener noreferrer nofollow" style={{ color: '#767676' }}>{s.label}</a>
          </span>
        ))}
        . Checked {WALKING_LAST_CHECKED}. How hard a walk feels is partly a matter of opinion, and walking policies vary, so check with the course when you book.
      </p>
    </section>
  )
}
