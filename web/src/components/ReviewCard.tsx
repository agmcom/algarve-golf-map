import { ThumbsUp } from 'lucide-react'
import { ReviewStars } from '@/components/ReviewStars'
import { CONDITION_FLAG_CHIPS, BUGGY_RULE_LABELS, ROUND_TIME_LABELS, TEE_TIME_LABELS, DIFFICULTY_LABELS, formatPlayedMonth } from '@/lib/reviews'
import type { CourseReview } from '@/types/database'

// One approved review. Server component — text is in the HTML for search engines.
export function ReviewCard({ review: r, clampLines }: { review: CourseReview; clampLines?: number }) {
  const facts = [
    r.round_time && `Round: ${ROUND_TIME_LABELS[r.round_time]}`,
    r.buggy_rule && BUGGY_RULE_LABELS[r.buggy_rule],
    r.hired_course_clubs && (r.rating_club_hire != null ? `Course hire clubs ${r.rating_club_hire}/5` : 'Hired clubs at the course'),
  ].filter(Boolean) as string[]

  const playedLine = [
    `Played ${formatPlayedMonth(r.played_month)}`,
    r.tee_time && `${TEE_TIME_LABELS[r.tee_time].toLowerCase()} tee time`,
  ].filter(Boolean).join(' · ')

  return (
    <article style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '18px 18px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
        <ReviewStars value={r.rating_overall} size={15} />
        <span style={{ fontSize: 12.5, color: '#6a6a6a' }}>{playedLine}</span>
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#222', margin: '0 0 8px', lineHeight: 1.35 }}>{r.title}</h3>
      <p style={{
        fontSize: 14.5, lineHeight: 1.7, color: '#333', margin: '0 0 12px', whiteSpace: 'pre-line',
        ...(clampLines && { display: '-webkit-box', WebkitLineClamp: clampLines, WebkitBoxOrient: 'vertical', overflow: 'hidden' }),
      }}>
        {r.body}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: 12.5, color: '#555', marginBottom: r.condition_flags?.length ? 10 : 12 }}>
        <span>Greens <strong>{r.rating_greens}/5</strong></span>
        <span>Fairways <strong>{r.rating_fairways}/5</strong></span>
        <span>Tees &amp; bunkers <strong>{r.rating_tees_bunkers}/5</strong></span>
        {facts.map(f => <span key={f}>{f}</span>)}
      </div>

      {r.condition_flags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {r.condition_flags.filter(f => CONDITION_FLAG_CHIPS[f]).map(f => (
            <span key={f} style={{ fontSize: 11.5, fontWeight: 500, padding: '3px 10px', borderRadius: 10, background: '#f3f3f3', color: '#555' }}>
              {CONDITION_FLAG_CHIPS[f]}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 12.5, color: '#6a6a6a', borderTop: '1px solid #f1f1f1', paddingTop: 10 }}>
        <span>
          <strong style={{ color: '#222' }}>{r.reviewer_name}</strong>
          {r.country && ` · ${r.country}`}
          {r.handicap != null && ` · HCP ${r.handicap}`}
          {r.difficulty_for_hcp && ` · ${DIFFICULTY_LABELS[r.difficulty_for_hcp]}`}
        </span>
        {r.would_recommend && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#22a06b', fontWeight: 600 }}>
            <ThumbsUp size={13} strokeWidth={2} /> Recommends
          </span>
        )}
      </div>
    </article>
  )
}
