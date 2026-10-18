'use client'

import { useState } from 'react'
import { Star, MailCheck } from 'lucide-react'
import {
  CONDITION_FLAGS, CONDITION_RATINGS, EXPERIENCE_RATINGS, ROUND_TIME_LABELS,
  BUGGY_RULE_LABELS, GROUP_LABELS, TEE_TIME_LABELS, DIFFICULTY_LABELS, COUNTRIES, type RatingKey,
} from '@/lib/reviews'

interface Props {
  courseSlug: string
  courseName: string
  // [{ value: '2026-09', label: 'Sep 2026' }, …] newest first — built on the server.
  monthOptions: { value: string; label: string }[]
}

type Ratings = Partial<Record<RatingKey | 'rating_overall', number>>

export function ReviewForm({ courseSlug, courseName, monthOptions }: Props) {
  const [playedMonth, setPlayedMonth] = useState('')
  const [groupType, setGroupType] = useState<string | null>(null)
  const [teeTime, setTeeTime] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState<string | null>(null)
  const [hiredClubs, setHiredClubs] = useState<boolean | null>(null)
  const [clubHireRating, setClubHireRating] = useState<number | undefined>(undefined)
  const [handicap, setHandicap] = useState('')
  const [country, setCountry] = useState('')
  const [ratings, setRatings] = useState<Ratings>({})
  const [roundTime, setRoundTime] = useState<string | null>(null)
  const [buggyRule, setBuggyRule] = useState<string | null>(null)
  const [flags, setFlags] = useState<string[]>([])
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('')   // honeypot

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState<string | null>(null)

  const setRating = (key: RatingKey | 'rating_overall', v: number) => setRatings(r => ({ ...r, [key]: v }))
  const toggleFlag = (f: string) => setFlags(fs => fs.includes(f) ? fs.filter(x => x !== f) : [...fs, f])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!playedMonth) return setError('Please choose the month you played.')
    if (!ratings.rating_overall || !ratings.rating_greens || !ratings.rating_fairways || !ratings.rating_tees_bunkers) {
      return setError('Please rate the overall experience, greens, fairways and tees & bunkers.')
    }
    if (wouldRecommend == null) return setError('Please say whether you would recommend the course.')
    if (body.trim().length < 50) return setError('Please write at least 50 characters about your round.')
    if (!consent) return setError('Please accept the privacy notice.')

    setStatus('sending')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseSlug, playedMonth, groupType, handicap, country,
          ratingOverall: ratings.rating_overall,
          ratingGreens: ratings.rating_greens,
          ratingFairways: ratings.rating_fairways,
          ratingTeesBunkers: ratings.rating_tees_bunkers,
          ratingLayout: ratings.rating_layout,
          ratingViews: ratings.rating_views,
          ratingPace: ratings.rating_pace,
          ratingStaff: ratings.rating_staff,
          ratingClubhouse: ratings.rating_clubhouse,
          ratingValue: ratings.rating_value,
          teeTime, difficultyForHcp: difficulty,
          hiredCourseClubs: hiredClubs, ratingClubHire: hiredClubs ? clubHireRating : undefined,
          roundTime, buggyRule, conditionFlags: flags, wouldRecommend,
          title, body, reviewerName: name, email, consent, website,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus('idle')
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setStatus('sent')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setStatus('idle')
      setError('Could not reach the server. Please check your connection and try again.')
    }
  }

  if (status === 'sent') {
    return (
      <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: '36px 24px', textAlign: 'center' }}>
        <MailCheck size={36} strokeWidth={1.6} color="#2B6090" />
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#222', margin: '14px 0 8px' }}>Check your inbox</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#444', margin: '0 auto', maxWidth: 440 }}>
          We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click it to confirm your review of {courseName} —
          we&apos;ll then check it and publish it. Can&apos;t see it? Have a look in your spam folder.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* 1 — Your round */}
      <fieldset style={fieldset}>
        <legend style={legend}>Your round</legend>

        <label style={label}>
          <span>When did you play? <Req /></span>
          <select value={playedMonth} onChange={e => setPlayedMonth(e.target.value)} style={input} required>
            <option value="">Choose a month</option>
            {monthOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </label>

        <div style={label}>
          What time did you tee off?
          <ChipGroup
            options={Object.entries(TEE_TIME_LABELS)}
            selected={teeTime ? [teeTime] : []}
            onToggle={v => setTeeTime(teeTime === v ? null : v)}
          />
        </div>

        <div style={label}>
          Who did you play with?
          <ChipGroup
            options={Object.entries(GROUP_LABELS)}
            selected={groupType ? [groupType] : []}
            onToggle={v => setGroupType(groupType === v ? null : v)}
          />
        </div>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <label style={{ ...label, flex: '1 1 140px' }}>
            Your handicap
            <input
              type="number" inputMode="numeric" min={0} max={54} placeholder="e.g. 18"
              value={handicap} onChange={e => setHandicap(e.target.value)} style={input}
            />
          </label>
          <label style={{ ...label, flex: '2 1 200px' }}>
            Country
            <select value={country} onChange={e => setCountry(e.target.value)} style={input}>
              <option value="">Choose a country</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>

        <div style={{ ...label, marginBottom: 4 }}>
          How did the course play for your handicap?
          <ChipGroup
            options={Object.entries(DIFFICULTY_LABELS)}
            selected={difficulty ? [difficulty] : []}
            onToggle={v => setDifficulty(difficulty === v ? null : v)}
          />
        </div>
      </fieldset>

      {/* 2 — Course condition */}
      <fieldset style={fieldset}>
        <legend style={legend}>Course condition</legend>
        <p style={hint}>How was the course on the day you played?</p>

        {CONDITION_RATINGS.map(r => (
          <StarRow key={r.key} label={r.label} required value={ratings[r.key]} onChange={v => setRating(r.key, v)} />
        ))}

        <div style={{ ...label, marginTop: 18 }}>
          Anything unusual on the day?
          <ChipGroup options={Object.entries(CONDITION_FLAGS)} selected={flags} onToggle={toggleFlag} />
        </div>

        <div style={label}>
          How long did your round take?
          <ChipGroup
            options={Object.entries(ROUND_TIME_LABELS)}
            selected={roundTime ? [roundTime] : []}
            onToggle={v => setRoundTime(roundTime === v ? null : v)}
          />
        </div>

        <div style={label}>
          Buggy rules on the day
          <ChipGroup
            options={Object.entries(BUGGY_RULE_LABELS)}
            selected={buggyRule ? [buggyRule] : []}
            onToggle={v => setBuggyRule(buggyRule === v ? null : v)}
          />
        </div>
      </fieldset>

      {/* 3 — Your review */}
      <fieldset style={fieldset}>
        <legend style={legend}>Your review</legend>

        <StarRow label="Overall experience" required large value={ratings.rating_overall} onChange={v => setRating('rating_overall', v)} />

        <p style={{ ...hint, marginTop: 18 }}>Optional — rate anything else you noticed:</p>
        {EXPERIENCE_RATINGS.map(r => (
          <StarRow key={r.key} label={r.label} value={ratings[r.key]} onChange={v => setRating(r.key, v)} />
        ))}

        <div style={{ ...label, marginTop: 18, marginBottom: hiredClubs ? 4 : 16 }}>
          Did you hire clubs from the course?
          <span style={{ fontSize: 12.5, color: '#8a8a8a', fontWeight: 400 }}>
            Only clubs hired at the course itself — not from an external rental shop.
          </span>
          <ChipGroup
            options={[['yes', 'Yes'], ['no', 'No']]}
            selected={hiredClubs == null ? [] : [hiredClubs ? 'yes' : 'no']}
            onToggle={v => {
              const next = v === 'yes'
              setHiredClubs(hiredClubs === next ? null : next)
            }}
          />
        </div>
        {hiredClubs && (
          <div style={{ marginBottom: 12 }}>
            <StarRow label="Quality of the hire clubs" value={clubHireRating} onChange={setClubHireRating} />
          </div>
        )}

        <div style={{ ...label, marginTop: 18 }}>
          <span>Would you recommend {courseName} to a friend? <Req /></span>
          <ChipGroup
            options={[['yes', 'Yes'], ['no', 'No']]}
            selected={wouldRecommend == null ? [] : [wouldRecommend ? 'yes' : 'no']}
            onToggle={v => setWouldRecommend(v === 'yes')}
          />
        </div>

        <label style={label}>
          <span>Title <Req /></span>
          <input
            type="text" maxLength={120} placeholder="Sum up your round in a few words"
            value={title} onChange={e => setTitle(e.target.value)} style={input} required
          />
        </label>

        <label style={label}>
          <span>Your review <Req /></span>
          <textarea
            rows={7} maxLength={3000}
            placeholder="How were the greens and fairways? Pace of play? Staff, clubhouse, value for money? Tips for other visiting golfers?"
            value={body} onChange={e => setBody(e.target.value)} style={{ ...input, resize: 'vertical', lineHeight: 1.6 }} required
          />
          <span style={{ fontSize: 12, color: body.trim().length < 50 ? '#b0b0b0' : '#22a06b', fontWeight: 500 }}>
            {body.trim().length < 50 ? `${50 - body.trim().length} more characters needed` : `${body.length} / 3,000`}
          </span>
        </label>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <label style={{ ...label, flex: '1 1 200px' }}>
            <span>Your first name <Req /></span>
            <input type="text" maxLength={60} autoComplete="given-name" value={name} onChange={e => setName(e.target.value)} style={input} required />
            <span style={{ fontSize: 12, color: '#8a8a8a', fontWeight: 400 }}>Shown with your review</span>
          </label>
          <label style={{ ...label, flex: '1 1 200px' }}>
            <span>Email <Req /></span>
            <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} style={input} required />
            <span style={{ fontSize: 12, color: '#8a8a8a', fontWeight: 400 }}>Never shown — only to confirm your review</span>
          </label>
        </div>

        {/* Honeypot — hidden from people, tempting for bots */}
        <div aria-hidden="true" style={{ position: 'absolute', left: -10000, width: 1, height: 1, overflow: 'hidden' }}>
          <label>Website<input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></label>
        </div>

        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5, lineHeight: 1.55, color: '#444', marginTop: 6, cursor: 'pointer' }}>
          <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: 3, width: 16, height: 16, flexShrink: 0 }} />
          <span>
            I played this course, and I agree that Algarve Golf Map may publish my review with my first name, country and handicap.
            My email is used only to confirm the review and is never shown or shared.
          </span>
        </label>
      </fieldset>

      {error && (
        <div role="alert" style={{ background: '#fdf0ef', border: '1px solid #f3c9c4', color: '#a4332a', borderRadius: 12, padding: '12px 16px', fontSize: 14, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          display: 'block', width: '100%', padding: '15px 0', borderRadius: 12, border: 'none',
          background: '#2B6090', color: '#fff', fontSize: 16, fontWeight: 700,
          cursor: status === 'sending' ? 'wait' : 'pointer', opacity: status === 'sending' ? 0.7 : 1,
          fontFamily: 'inherit',
        }}
      >
        {status === 'sending' ? 'Sending…' : 'Submit review'}
      </button>
      <p style={{ fontSize: 12.5, color: '#8a8a8a', textAlign: 'center', margin: '10px 0 0' }}>
        We&apos;ll email you a link to confirm. Every review is checked before it is published.
      </p>
    </form>
  )
}

function Req() {
  return <span aria-hidden="true" style={{ color: '#c0392b' }}>*</span>
}

function StarRow({ label: text, value, onChange, required, large }: {
  label: string; value?: number; onChange: (v: number) => void; required?: boolean; large?: boolean
}) {
  const [hover, setHover] = useState<number | null>(null)
  const shown = hover ?? value ?? 0
  const size = large ? 32 : 26
  return (
    <div role="radiogroup" aria-label={text} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 0', flexWrap: 'wrap' }}>
      <span style={{ fontSize: large ? 16 : 15, fontWeight: large ? 700 : 600, color: '#222' }}>
        {text} {required && <Req />}
      </span>
      <span style={{ display: 'inline-flex', gap: 4 }} onMouseLeave={() => setHover(null)}>
        {[1, 2, 3, 4, 5].map(i => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === i}
            aria-label={`${i} star${i > 1 ? 's' : ''}`}
            onClick={() => onChange(i)}
            onMouseEnter={() => setHover(i)}
            style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer', lineHeight: 0 }}
          >
            <Star size={size} strokeWidth={1.5} color={i <= shown ? '#e0a526' : '#cfcfcf'} fill={i <= shown ? '#e0a526' : 'transparent'} />
          </button>
        ))}
      </span>
    </div>
  )
}

function ChipGroup({ options, selected, onToggle }: {
  options: [string, string][]; selected: string[]; onToggle: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
      {options.map(([value, text]) => {
        const on = selected.includes(value)
        return (
          <button
            key={value}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(value)}
            style={{
              padding: '8px 14px', borderRadius: 20, fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
              border: `1.5px solid ${on ? '#2B6090' : '#dcdcdc'}`,
              background: on ? '#eaf1f8' : '#fff', color: on ? '#2B6090' : '#333',
              fontFamily: 'inherit',
            }}
          >
            {text}
          </button>
        )
      })}
    </div>
  )
}

const fieldset: React.CSSProperties = {
  border: '1px solid #ebebeb', borderRadius: 16, background: '#fff',
  padding: '20px 20px 18px', margin: '0 0 20px', minWidth: 0,
}
const legend: React.CSSProperties = {
  fontSize: 17, fontWeight: 800, color: '#222', padding: '0 8px', marginLeft: -8,
}
const label: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 6,
  fontSize: 14, fontWeight: 600, color: '#222', marginBottom: 16,
}
const hint: React.CSSProperties = { fontSize: 13.5, color: '#6a6a6a', margin: '0 0 6px' }
const input: React.CSSProperties = {
  width: '100%', padding: '11px 12px', borderRadius: 10, border: '1px solid #dcdcdc',
  fontSize: 15, fontFamily: 'inherit', fontWeight: 400, color: '#222', background: '#fff', boxSizing: 'border-box',
}
