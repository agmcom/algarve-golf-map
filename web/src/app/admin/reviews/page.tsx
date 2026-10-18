import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { ReviewStars } from '@/components/ReviewStars'
import {
  CONDITION_FLAG_CHIPS, CONDITION_RATINGS, EXPERIENCE_RATINGS, ROUND_TIME_LABELS,
  BUGGY_RULE_LABELS, GROUP_LABELS, TEE_TIME_LABELS, DIFFICULTY_LABELS, formatPlayedMonth,
} from '@/lib/reviews'
import type { CourseReviewAdmin, ReviewStatus } from '@/types/database'
import { ModerateButtons } from './ModerateButtons'

export const dynamic = 'force-dynamic'

const TABS: { status: ReviewStatus; label: string }[] = [
  { status: 'pending',    label: 'Pending' },
  { status: 'approved',   label: 'Approved' },
  { status: 'rejected',   label: 'Rejected' },
  { status: 'unverified', label: 'Email not confirmed' },
]

type Row = CourseReviewAdmin & { course: { name: string; slug: string } | null }

export default async function AdminReviewsPage(
  { searchParams }: { searchParams: Promise<{ status?: string }> }
) {
  const { status: statusParam } = await searchParams
  const status = (TABS.find(t => t.status === statusParam)?.status ?? 'pending') as ReviewStatus

  let rows: Row[] = []
  const counts: Record<string, number> = {}
  let loadError: string | null = null

  try {
    const [list, ...tabCounts] = await Promise.all([
      supabaseAdmin
        .from('course_reviews')
        .select('*, course:courses(name, slug)')
        .eq('status', status)
        .order('created_at', { ascending: false })
        .limit(200),
      ...TABS.map(t =>
        supabaseAdmin.from('course_reviews').select('id', { count: 'exact', head: true }).eq('status', t.status)
      ),
    ])
    if (list.error) loadError = list.error.message
    rows = (list.data ?? []) as Row[]
    TABS.forEach((t, i) => { counts[t.status] = tabCounts[i].count ?? 0 })
  } catch (e) {
    loadError = e instanceof Error ? e.message : String(e)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1a1a2e', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ color: '#aaa', fontSize: 13, textDecoration: 'none' }}>← Back to map</Link>
          <span style={{ color: '#555' }}>/</span>
          <Link href="/admin/courses" style={{ color: '#aaa', fontSize: 13, textDecoration: 'none' }}>Courses</Link>
          <span style={{ color: '#555' }}>/</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Reviews</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 22 }}>
          {TABS.map(t => {
            const active = t.status === status
            return (
              <Link
                key={t.status}
                href={`/admin/reviews?status=${t.status}`}
                style={{
                  padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none',
                  background: active ? '#1a1a2e' : '#fff', color: active ? '#fff' : '#444',
                  border: '1px solid ' + (active ? '#1a1a2e' : '#e3e3e3'),
                }}
              >
                {t.label} <span style={{ opacity: 0.6 }}>({counts[t.status] ?? 0})</span>
              </Link>
            )
          })}
        </div>

        {loadError && (
          <div style={{ background: '#fff', border: '1px solid #fcc', borderRadius: 12, padding: 20, color: '#c00', fontSize: 14 }}>
            Could not load reviews: {loadError}
            <div style={{ color: '#888', marginTop: 6, fontSize: 13 }}>
              If the table doesn&apos;t exist yet, run <code>database/migrate_course_reviews.sql</code> in the Supabase SQL editor.
            </div>
          </div>
        )}

        {!loadError && rows.length === 0 && (
          <div style={{ textAlign: 'center', color: '#999', padding: '60px 0', fontSize: 14 }}>
            No reviews here.
          </div>
        )}

        {status === 'unverified' && rows.length > 0 && (
          <p style={{ fontSize: 13, color: '#777', margin: '0 0 14px' }}>
            These reviewers haven&apos;t clicked the confirmation link yet. They move to Pending once they do.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {rows.map(r => (
            <article key={r.id} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                <div>
                  {r.course && (
                    <Link href={`/courses/${r.course.slug}/reviews`} target="_blank" style={{ fontSize: 12, fontWeight: 700, color: '#2B6090', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                      {r.course.name} ↗
                    </Link>
                  )}
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111', margin: '4px 0 4px' }}>{r.title}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#666', flexWrap: 'wrap' }}>
                    <ReviewStars value={r.rating_overall} size={15} />
                    <span>{r.reviewer_name}</span>
                    {r.country && <span>· {r.country}</span>}
                    {r.handicap != null && <span>· HCP {r.handicap}</span>}
                    <span>· Played {formatPlayedMonth(r.played_month)}</span>
                    {r.tee_time && <span>· {TEE_TIME_LABELS[r.tee_time]}</span>}
                    {r.group_type && <span>· {GROUP_LABELS[r.group_type]}</span>}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#999', textAlign: 'right' }}>
                  {r.email}<br />
                  Sent {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>

              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#333', margin: '0 0 12px', whiteSpace: 'pre-wrap' }}>{r.body}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: 12.5, color: '#555', marginBottom: 10 }}>
                {[...CONDITION_RATINGS, ...EXPERIENCE_RATINGS].map(({ key, label }) =>
                  r[key] != null ? <span key={key}>{label}: <strong>{r[key]}/5</strong></span> : null
                )}
                <span>Recommends: <strong>{r.would_recommend ? 'Yes' : 'No'}</strong></span>
                {r.round_time && <span>Round: <strong>{ROUND_TIME_LABELS[r.round_time]}</strong></span>}
                {r.buggy_rule && <span>Buggies: <strong>{BUGGY_RULE_LABELS[r.buggy_rule]}</strong></span>}
                {r.difficulty_for_hcp && <span>For their HCP: <strong>{DIFFICULTY_LABELS[r.difficulty_for_hcp]}</strong></span>}
                {r.hired_course_clubs != null && (
                  <span>Course hire clubs: <strong>{r.hired_course_clubs ? (r.rating_club_hire != null ? `Yes, ${r.rating_club_hire}/5` : 'Yes') : 'No'}</strong></span>
                )}
              </div>
              {r.condition_flags?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {r.condition_flags.map(f => (
                    <span key={f} style={{ fontSize: 11.5, padding: '3px 9px', borderRadius: 10, background: '#f0f0f0', color: '#555' }}>
                      {CONDITION_FLAG_CHIPS[f] ?? f}
                    </span>
                  ))}
                </div>
              )}

              {status !== 'unverified' && <ModerateButtons id={r.id} status={r.status} />}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
