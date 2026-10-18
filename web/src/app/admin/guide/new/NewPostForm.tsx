'use client'

import { useActionState } from 'react'
import { createPost } from './actions'
import { CATEGORY_LABELS } from '@/lib/guideCategories'

const inputStyle: React.CSSProperties = {
  padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd',
  fontSize: 14, color: '#111', background: '#fff', width: '100%', boxSizing: 'border-box',
}

export function NewPostForm() {
  const [state, formAction, pending] = useActionState(createPost, null)

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {state?.error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', color: '#b91c1c', fontSize: 14 }}>
          {state.error}
        </div>
      )}

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.06em' }}>Title</span>
        <input name="title" required autoFocus placeholder="e.g. Best time to play golf in the Algarve" style={inputStyle} />
      </label>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.06em' }}>Categories (pick one or more)</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <label key={value} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14, color: '#333' }}>
              <input type="checkbox" name="categories" value={value} style={{ width: 15, height: 15, accentColor: '#2B6090', cursor: 'pointer' }} />
              {label}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        style={{
          padding: '12px 20px', borderRadius: 8, border: 'none',
          background: pending ? '#ccc' : '#1a1a2e', color: '#fff',
          fontSize: 14, fontWeight: 600, cursor: pending ? 'not-allowed' : 'pointer',
        }}
      >
        {pending ? 'Creating…' : 'Create post'}
      </button>
    </form>
  )
}
