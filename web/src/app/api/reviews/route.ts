import { createHash, randomBytes } from 'crypto'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { CONDITION_FLAGS, COUNTRIES } from '@/lib/reviews'

// Simple in-memory rate limiter: max 5 submissions per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return false
  }
  if (entry.count >= 5) return true
  entry.count++
  return false
}

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex')

const GROUP_TYPES = ['couple', 'friends', 'society', 'solo']
const ROUND_TIMES = ['<4h', '4-4.5h', '4.5-5h', '>5h']
const BUGGY_RULES = ['fairways', '90-degree', 'paths-only', 'walked']
const TEE_TIMES = ['morning', 'midday', 'twilight']
const DIFFICULTIES = ['easier', 'as-expected', 'harder']
const MAX_MONTHS_AGO = 24

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status })
}

function rating(v: unknown, required: boolean): number | null | undefined {
  if (v == null || v === '') return required ? undefined : null
  const n = Number(v)
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : undefined
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return bad('Too many reviews submitted. Please try again later.', 429)
  }

  let b: Record<string, unknown>
  try {
    b = await req.json()
  } catch {
    return bad('Invalid request')
  }

  // Honeypot — real people never fill this hidden field. Pretend it worked.
  if (typeof b.website === 'string' && b.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const str = (k: string) => (typeof b[k] === 'string' ? (b[k] as string).trim() : '')

  const courseSlug = str('courseSlug')
  const reviewerName = str('reviewerName')
  const email = str('email').toLowerCase()
  const country = str('country') || null
  const title = str('title')
  const body = str('body')
  const playedMonth = str('playedMonth')   // 'YYYY-MM'

  if (!courseSlug || !reviewerName || !email || !title || !body || !playedMonth) {
    return bad('Please fill in all required fields.')
  }
  if (reviewerName.length > 60) return bad('Name is too long.')
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad('Please enter a valid email address.')
  if (country && !COUNTRIES.includes(country)) return bad('Invalid country.')
  if (title.length < 3 || title.length > 120) return bad('The title should be between 3 and 120 characters.')
  if (body.length < 50) return bad('Please write at least 50 characters about your round.')
  if (body.length > 3000) return bad('Your review is too long (3,000 characters max).')
  if (b.consent !== true) return bad('Please accept the privacy notice.')

  // Played month: valid, not in the future, not older than MAX_MONTHS_AGO
  if (!/^\d{4}-\d{2}$/.test(playedMonth)) return bad('Please choose the month you played.')
  const [py, pm] = playedMonth.split('-').map(Number)
  const now = new Date()
  const monthsAgo = (now.getUTCFullYear() - py) * 12 + (now.getUTCMonth() + 1 - pm)
  if (pm < 1 || pm > 12 || monthsAgo < 0 || monthsAgo > MAX_MONTHS_AGO) {
    return bad('Please choose a month within the last two years.')
  }

  let handicap: number | null = null
  if (b.handicap != null && b.handicap !== '') {
    const h = Number(b.handicap)
    if (!Number.isInteger(h) || h < 0 || h > 54) return bad('Handicap should be a whole number from 0 to 54.')
    handicap = h
  }

  const groupType = str('groupType') || null
  const roundTime = str('roundTime') || null
  const buggyRule = str('buggyRule') || null
  if (groupType && !GROUP_TYPES.includes(groupType)) return bad('Invalid group type.')
  if (roundTime && !ROUND_TIMES.includes(roundTime)) return bad('Invalid round time.')
  if (buggyRule && !BUGGY_RULES.includes(buggyRule)) return bad('Invalid buggy rule.')

  const teeTime = str('teeTime') || null
  const difficulty = str('difficultyForHcp') || null
  if (teeTime && !TEE_TIMES.includes(teeTime)) return bad('Invalid tee time.')
  if (difficulty && !DIFFICULTIES.includes(difficulty)) return bad('Invalid difficulty answer.')

  const hiredCourseClubs = typeof b.hiredCourseClubs === 'boolean' ? b.hiredCourseClubs : null

  const flags = Array.isArray(b.conditionFlags)
    ? [...new Set((b.conditionFlags as unknown[]).filter((f): f is string => typeof f === 'string' && f in CONDITION_FLAGS))]
    : []

  if (typeof b.wouldRecommend !== 'boolean') return bad('Please say whether you would recommend the course.')

  const ratings = {
    rating_overall:      rating(b.ratingOverall, true),
    rating_greens:       rating(b.ratingGreens, true),
    rating_fairways:     rating(b.ratingFairways, true),
    rating_tees_bunkers: rating(b.ratingTeesBunkers, true),
    rating_layout:       rating(b.ratingLayout, false),
    rating_views:        rating(b.ratingViews, false),
    rating_pace:         rating(b.ratingPace, false),
    rating_staff:        rating(b.ratingStaff, false),
    rating_clubhouse:    rating(b.ratingClubhouse, false),
    rating_value:        rating(b.ratingValue, false),
    // Club-hire quality only makes sense if they hired from the course.
    rating_club_hire:    hiredCourseClubs ? rating(b.ratingClubHire, false) : null,
  }
  if (Object.values(ratings).some(v => v === undefined)) {
    return bad('Please rate the overall experience, greens, fairways and tees & bunkers.')
  }

  const { data: course } = await supabaseAdmin
    .from('courses')
    .select('id, name, slug')
    .eq('slug', courseSlug)
    .eq('active', true)
    .single()
  if (!course) return bad('Course not found.', 404)

  const token = randomBytes(32).toString('base64url')

  // A previous unconfirmed attempt for the same round (e.g. email never
  // arrived) is replaced rather than blocking the resubmission.
  await supabaseAdmin
    .from('course_reviews')
    .delete()
    .eq('course_id', course.id)
    .eq('email', email)
    .eq('played_month', `${playedMonth}-01`)
    .eq('status', 'unverified')

  const { data: inserted, error: insertError } = await supabaseAdmin.from('course_reviews').insert({
    course_id: course.id,
    status: 'unverified',
    reviewer_name: reviewerName,
    email,
    country,
    handicap,
    played_month: `${playedMonth}-01`,
    group_type: groupType,
    tee_time: teeTime,
    difficulty_for_hcp: difficulty,
    hired_course_clubs: hiredCourseClubs,
    ...ratings,
    round_time: roundTime,
    buggy_rule: buggyRule,
    condition_flags: flags,
    would_recommend: b.wouldRecommend,
    title,
    body,
    verify_token_hash: sha256(token),
    verify_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    ip_hash: sha256(`reviews:${ip}`),
  }).select('id').single()

  if (insertError) {
    if (insertError.code === '23505') {
      return bad(`You have already reviewed a round at ${course.name} for that month.`, 409)
    }
    console.error('review insert error:', insertError.message)
    return bad('Something went wrong saving your review. Please try again.', 500)
  }

  const origin = new URL(req.url).origin
  const confirmUrl = `${origin}/reviews/confirm?token=${token}`

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error: mailError } = await resend.emails.send({
    from: 'Algarve Golf Map <contact@algarvegolfmap.com>',
    to: email,
    subject: `Please confirm your review of ${course.name}`,
    text:
      `Hi ${reviewerName},\n\n` +
      `Thanks for reviewing ${course.name}. Please confirm your review by opening this link:\n\n${confirmUrl}\n\n` +
      `Once confirmed, we'll check it and publish it on Algarve Golf Map. The link expires in 7 days.\n\n` +
      `If you didn't write this review, you can ignore this email.\n\nAlgarve Golf Map`,
    html:
      `<p>Hi ${escapeHtml(reviewerName)},</p>` +
      `<p>Thanks for reviewing <strong>${escapeHtml(course.name)}</strong>. Please confirm your review:</p>` +
      `<p><a href="${confirmUrl}" style="display:inline-block;padding:12px 22px;border-radius:10px;background:#2B6090;color:#fff;text-decoration:none;font-weight:700">Confirm my review</a></p>` +
      `<p>Once confirmed, we'll check it and publish it on Algarve Golf Map. The link expires in 7 days.</p>` +
      `<p style="color:#888">If you didn't write this review, you can ignore this email.</p>`,
  })

  if (mailError) {
    console.error('review confirmation email error:', mailError.message)
    if (inserted) await supabaseAdmin.from('course_reviews').delete().eq('id', inserted.id)
    return bad('We could not send the confirmation email. Please check the address and try again.', 500)
  }

  return NextResponse.json({ ok: true })
}
