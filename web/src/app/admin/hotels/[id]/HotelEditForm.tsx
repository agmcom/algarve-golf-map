'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { saveHotel, deleteHotel, type SaveResult } from './actions'

interface Hotel {
  id: string
  name: string
  accommodation_type: string
  town: string
  region: string
  website: string | null
  phone: string | null
  google_rating: number | null
  google_user_ratings_total: number | null
  stars: number | null
  active: boolean
  featured: boolean
  onsite: boolean
  has_golf_package: boolean
  has_shuttle: boolean
  club_storage: boolean
  club_cleaning: boolean
  drying_room: boolean
  early_breakfast: boolean
  late_checkout: boolean
  offers_rental: boolean
  google_place_id: string | null
}

const inputStyle: React.CSSProperties = {
  padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd',
  fontSize: 14, color: '#111', background: '#fff', width: '100%', boxSizing: 'border-box',
}

function Field({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 5, ...(span2 ? { gridColumn: '1 / -1' } : {}) }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.06em' }}>
        {label}
      </span>
      {children}
    </label>
  )
}

function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <input type="checkbox" name={name} defaultChecked={defaultChecked}
        style={{ width: 16, height: 16, accentColor: '#2A6B4A', cursor: 'pointer' }} />
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

const TYPES = ['hotel', 'resort', 'apartment', 'guest_house', 'villa', 'bb']
const TYPE_LABELS: Record<string, string> = {
  hotel: 'Hotel', resort: 'Resort', apartment: 'Apartment',
  guest_house: 'Guest House', villa: 'Villa / Quinta', bb: 'B&B',
}

export default function HotelEditForm({ hotel }: { hotel: Hotel }) {
  const router = useRouter()
  const boundSave = saveHotel.bind(null, hotel.id)
  const [result, formAction, pending] = useActionState(boundSave, null)

  async function handleDelete() {
    if (!confirm(`Delete "${hotel.name}"? This cannot be undone.`)) return
    const res = await deleteHotel(hotel.id)
    if (res.ok) router.push('/admin/hotels')
    else alert('Error: ' + res.error)
  }

  return (
    <form action={formAction}>
      {result && !result.ok && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#b91c1c', fontSize: 14 }}>
          {(result as { ok: false; error: string }).error}
        </div>
      )}
      {result?.ok && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#166534', fontSize: 14 }}>
          Saved
        </div>
      )}

      <Section title="Basic info">
        <Field label="Name" span2>
          <input name="name" defaultValue={hotel.name} required style={inputStyle} />
        </Field>
        <Field label="Type">
          <select name="accommodation_type" defaultValue={hotel.accommodation_type} style={inputStyle}>
            {TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t] ?? t}</option>)}
          </select>
        </Field>
        <Field label="Region">
          <select name="region" defaultValue={hotel.region} style={inputStyle}>
            <option value="west">West Algarve</option>
            <option value="central">Central Algarve</option>
            <option value="east">East Algarve</option>
          </select>
        </Field>
        <Field label="Town">
          <input name="town" defaultValue={hotel.town} style={inputStyle} />
        </Field>
        <Field label="Website">
          <input name="website" defaultValue={hotel.website ?? ''} style={inputStyle} />
        </Field>
        <Field label="Phone">
          <input name="phone" defaultValue={hotel.phone ?? ''} style={inputStyle} />
        </Field>
      </Section>

      <Section title="Ratings">
        <Field label="Google Rating (override)">
          <input name="google_rating" type="number" step="0.1" min="1" max="5"
            defaultValue={hotel.google_rating ?? ''} placeholder="e.g. 4.5" style={inputStyle} />
        </Field>
        <Field label="Stars (1-5)">
          <input name="stars" type="number" min="1" max="5"
            defaultValue={hotel.stars ?? ''} placeholder="e.g. 4" style={inputStyle} />
        </Field>
        {hotel.google_user_ratings_total != null && (
          <Field label="Google Reviews (auto)">
            <input value={hotel.google_user_ratings_total} disabled
              style={{ ...inputStyle, background: '#f5f5f5', color: '#999' }} onChange={() => {}} />
          </Field>
        )}
        {hotel.google_place_id && (
          <Field label="Google Place ID">
            <input value={hotel.google_place_id} disabled
              style={{ ...inputStyle, background: '#f5f5f5', color: '#999', fontSize: 11 }} onChange={() => {}} />
          </Field>
        )}
      </Section>

      <Section title="Visibility">
        <Toggle name="active" label="Active (visible on site)" defaultChecked={hotel.active} />
        <Toggle name="featured" label="Featured" defaultChecked={hotel.featured} />
        <Toggle name="onsite" label="On-site hotel (golf course property)" defaultChecked={hotel.onsite} />
        <Toggle name="has_golf_package" label="Offers golf package" defaultChecked={hotel.has_golf_package} />
      </Section>

      <Section title="Golfer services">
        <Toggle name="has_shuttle" label="Shuttle to course" defaultChecked={hotel.has_shuttle} />
        <Toggle name="club_storage" label="Club storage" defaultChecked={hotel.club_storage} />
        <Toggle name="club_cleaning" label="Club cleaning" defaultChecked={hotel.club_cleaning} />
        <Toggle name="drying_room" label="Drying room" defaultChecked={hotel.drying_room} />
        <Toggle name="early_breakfast" label="Early breakfast" defaultChecked={hotel.early_breakfast} />
        <Toggle name="late_checkout" label="Late checkout" defaultChecked={hotel.late_checkout} />
        <Toggle name="offers_rental" label="Equipment rental" defaultChecked={hotel.offers_rental} />
      </Section>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
        <button
          type="button"
          onClick={handleDelete}
          style={{
            padding: '10px 20px', borderRadius: 8, border: '1px solid #fca5a5',
            background: '#fff', color: '#b91c1c', fontSize: 14, cursor: 'pointer', fontWeight: 600,
          }}
        >
          Delete hotel
        </button>
        <button
          type="submit"
          disabled={pending}
          style={{
            padding: '10px 28px', borderRadius: 8, border: 'none',
            background: pending ? '#ccc' : '#1a1a2e', color: '#fff',
            fontSize: 14, fontWeight: 600, cursor: pending ? 'not-allowed' : 'pointer',
          }}
        >
          {pending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
