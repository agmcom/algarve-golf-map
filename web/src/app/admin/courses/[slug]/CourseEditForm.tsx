'use client'

import { useActionState, useRef } from 'react'
import Link from 'next/link'
import { saveCourse, saveHeroPhoto, type SaveResult } from './actions'

interface Photo { id: string; url: string; alt: string | null; is_hero: boolean; position: number }
interface Course { [key: string]: unknown; photos?: Photo[] }

const initial: SaveResult | null = null

// ── Small helpers ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.06em' }}>
        {label}
      </span>
      {children}
    </label>
  )
}

const input: React.CSSProperties = {
  padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd',
  fontSize: 14, color: '#111', background: '#fff', width: '100%', boxSizing: 'border-box',
}

const textarea: React.CSSProperties = {
  ...input, resize: 'vertical', minHeight: 80, fontFamily: 'inherit',
}

function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        style={{ width: 16, height: 16, accentColor: '#2B6090', cursor: 'pointer' }}
      />
      <span style={{ fontSize: 14, color: '#333' }}>{label}</span>
    </label>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 20px' }}>
        {title}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
        {children}
      </div>
    </div>
  )
}

function Wide({ children }: { children: React.ReactNode }) {
  return <div style={{ gridColumn: '1 / -1' }}>{children}</div>
}

// ── Main form ────────────────────────────────────────────────────────────────

export function CourseEditForm({ course }: { course: Course }) {
  const slug = course.slug as string
  const heroPhoto = (course.photos as Photo[] | undefined)?.find(p => p.is_hero)

  const saveWithSlug = saveCourse.bind(null, slug)
  const savePhotoWithSlug = saveHeroPhoto.bind(null, slug)

  const [result, action, pending] = useActionState(saveWithSlug, initial)
  const [photoResult, photoAction, photoPending] = useActionState(savePhotoWithSlug, initial)

  const str = (key: string) => (course[key] as string | null) ?? ''
  const num = (key: string) => (course[key] != null ? String(course[key]) : '')
  const bool = (key: string) => Boolean(course[key])
  const arrStr = (key: string) => ((course[key] as string[] | null) ?? []).join(', ')

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ background: '#1a1a2e', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/admin/courses" style={{ color: '#aaa', fontSize: 13, textDecoration: 'none' }}>← All courses</Link>
          <span style={{ color: '#555' }}>/</span>
          <span style={{ color: '#fff', fontWeight: 700 }}>{course.name as string}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a
            href={`/courses/${slug}`}
            target="_blank"
            style={{ fontSize: 13, color: '#aaa', textDecoration: 'none' }}
          >
            View page ↗
          </a>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Course details form ─────────────────────────────────────────── */}
        <form action={action}>

          <SaveBar pending={pending} result={result} />

          <Section title="Status">
            <Toggle name="active"   label="Active (visible on map)"        defaultChecked={bool('active')} />
            <Toggle name="featured" label="Featured (shown first in lists)" defaultChecked={bool('featured')} />
          </Section>

          <Section title="Identity">
            <Field label="Name">
              <input style={input} name="name" defaultValue={str('name')} required />
            </Field>
            <Field label="Slug (URL)">
              <input style={{ ...input, background: '#f9f9f9', color: '#888' }} name="slug_display" defaultValue={slug} disabled />
            </Field>
            <Wide>
              <Field label="Blurb (1–2 sentences, shown on cards)">
                <textarea style={textarea} name="blurb" defaultValue={str('blurb')} rows={2} />
              </Field>
            </Wide>
            <Wide>
              <Field label="Description (full text, shown on course page)">
                <textarea style={{ ...textarea, minHeight: 120 }} name="description" defaultValue={str('description')} rows={5} />
              </Field>
            </Wide>
          </Section>

          <Section title="Location">
            <Field label="Town">
              <input style={input} name="town" defaultValue={str('town')} required />
            </Field>
            <Field label="Region">
              <select style={input} name="region" defaultValue={str('region')}>
                <option value="west">West</option>
                <option value="central">Central</option>
                <option value="east">East</option>
              </select>
            </Field>
            <Wide>
              <Field label="Address">
                <input style={input} name="address" defaultValue={str('address')} />
              </Field>
            </Wide>
          </Section>

          <Section title="Course specs">
            <Field label="Holes">
              <input style={input} name="holes" type="number" defaultValue={num('holes')} required />
            </Field>
            <Field label="Par">
              <input style={input} name="par" type="number" defaultValue={num('par')} />
            </Field>
            <Field label="Length (metres)">
              <input style={input} name="length_meters" type="number" defaultValue={num('length_meters')} />
            </Field>
            <Field label="Course type">
              <select style={input} name="course_type" defaultValue={str('course_type')}>
                <option value="">— not set —</option>
                <option value="parkland">Parkland</option>
                <option value="links">Links</option>
                <option value="clifftop">Clifftop</option>
                <option value="heathland">Heathland</option>
                <option value="desert">Desert</option>
                <option value="resort">Resort</option>
              </select>
            </Field>
            <Field label="Difficulty">
              <select style={input} name="difficulty" defaultValue={str('difficulty')}>
                <option value="">— not set —</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
              </select>
            </Field>
            <Field label="Max handicap — Men">
              <input style={input} name="handicap_required_men" type="number" defaultValue={num('handicap_required_men')} />
            </Field>
            <Field label="Max handicap — Ladies">
              <input style={input} name="handicap_required_ladies" type="number" defaultValue={num('handicap_required_ladies')} />
            </Field>
            <Field label="Designer">
              <input style={input} name="designer" defaultValue={str('designer')} />
            </Field>
            <Field label="Year opened">
              <input style={input} name="year_opened" type="number" defaultValue={num('year_opened')} />
            </Field>
          </Section>

          <Section title="Facilities">
            <Toggle name="driving_range"  label="Driving range"  defaultChecked={bool('driving_range')} />
            <Toggle name="pro_shop"       label="Pro shop"       defaultChecked={bool('pro_shop')} />
            <Toggle name="restaurant"     label="Restaurant"     defaultChecked={bool('restaurant')} />
            <Toggle name="caddie_service" label="Caddie service" defaultChecked={bool('caddie_service')} />
            <Toggle name="has_own_hotel"  label="On-site hotel"  defaultChecked={bool('has_own_hotel')} />
            <Toggle name="offers_rental"  label="Club hire"      defaultChecked={bool('offers_rental')} />
            <Wide>
              <Field label="Dress code">
                <input style={input} name="dress_code" defaultValue={str('dress_code')} />
              </Field>
            </Wide>
            <Wide>
              <Field label="Rental brands (comma-separated)">
                <input style={input} name="rental_brands" defaultValue={arrStr('rental_brands')} placeholder="Callaway, TaylorMade" />
              </Field>
            </Wide>
            <Field label="Club hire price (€ / round)">
              <input style={input} name="rental_price_per_round" type="number" defaultValue={num('rental_price_per_round')} />
            </Field>
          </Section>

          <Section title="Contact">
            <Field label="Website">
              <input style={input} name="website" type="url" defaultValue={str('website')} />
            </Field>
            <Field label="Phone">
              <input style={input} name="phone" defaultValue={str('phone')} placeholder="+351 289 000 000" />
            </Field>
            <Field label="Email">
              <input style={input} name="email" type="email" defaultValue={str('email')} />
            </Field>
            <Field label="Booking URL">
              <input style={input} name="booking_url" type="url" defaultValue={str('booking_url')} />
            </Field>
          </Section>

          <Section title="Display & pricing">
            <Field label="Price from (€ / round)">
              <input style={input} name="price_from" type="number" defaultValue={num('price_from')} />
            </Field>
            <Field label="Rating (0–5)">
              <input style={input} name="rating" type="number" step="0.01" min="0" max="5" defaultValue={num('rating')} />
            </Field>
            <Field label="Review count">
              <input style={input} name="review_count" type="number" defaultValue={num('review_count')} />
            </Field>
            <Field label="Course map URL">
              <input style={input} name="course_map_url" type="url" defaultValue={str('course_map_url')} />
            </Field>
            <Wide>
              <Field label="Tags (comma-separated)">
                <input style={input} name="tags" defaultValue={arrStr('tags')} placeholder="Championship, Sea view, 9 holes" />
              </Field>
            </Wide>
            <Wide>
              <Field label="Amenities (comma-separated)">
                <input style={input} name="amenities" defaultValue={arrStr('amenities')} />
              </Field>
            </Wide>
            <Wide>
              <Field label="Languages (comma-separated, e.g. en,pt,de)">
                <input style={input} name="languages" defaultValue={arrStr('languages')} placeholder="en, pt" />
              </Field>
            </Wide>
          </Section>

          <SaveBar pending={pending} result={result} />

        </form>

        {/* ── Hero photo ──────────────────────────────────────────────────── */}
        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 20px' }}>
            Hero photo
          </h3>

          {heroPhoto && (
            <div style={{ marginBottom: 16, borderRadius: 10, overflow: 'hidden', maxHeight: 200, position: 'relative' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroPhoto.url} alt={heroPhoto.alt ?? ''} style={{ width: '100%', objectFit: 'cover', display: 'block', maxHeight: 200 }} />
              <div style={{ position: 'absolute', bottom: 8, left: 10, fontSize: 11, color: 'rgba(255,255,255,.85)', background: 'rgba(0,0,0,.5)', padding: '2px 8px', borderRadius: 6 }}>
                Current hero
              </div>
            </div>
          )}

          <form action={photoAction} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Field label="Photo URL">
                <input style={input} name="hero_url" type="url" defaultValue={heroPhoto?.url ?? ''} required />
              </Field>
              <Field label="Alt text">
                <input style={input} name="hero_alt" defaultValue={heroPhoto?.alt ?? ''} />
              </Field>
            </div>
            <button
              type="submit"
              disabled={photoPending}
              style={{ ...saveBtn, alignSelf: 'flex-end', height: 40 }}
            >
              {photoPending ? 'Saving…' : 'Update photo'}
            </button>
          </form>

          {photoResult && (
            <div style={{ marginTop: 12, padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: photoResult.ok ? '#f0faf4' : '#fff0f0',
              color: photoResult.ok ? '#22a06b' : '#c00',
              border: `1px solid ${photoResult.ok ? '#d4edda' : '#fcc'}`,
            }}>
              {photoResult.ok ? '✓ Photo updated' : `✗ ${photoResult.error}`}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

const saveBtn: React.CSSProperties = {
  padding: '10px 28px', borderRadius: 9, border: 'none',
  background: '#2B6090', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
}

function SaveBar({ pending, result }: { pending: boolean; result: SaveResult | null }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
      {result ? (
        <div style={{
          padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          background: result.ok ? '#f0faf4' : '#fff0f0',
          color: result.ok ? '#22a06b' : '#c00',
          border: `1px solid ${result.ok ? '#d4edda' : '#fcc'}`,
        }}>
          {result.ok ? '✓ Saved successfully' : `✗ ${result.error}`}
        </div>
      ) : <div />}
      <button type="submit" disabled={pending} style={saveBtn}>
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  )
}
