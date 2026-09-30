'use client'

import { useState, useTransition } from 'react'
import { approveReview, rejectReview } from './actions'

export function ModerateButtons({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const run = (fn: (id: string) => Promise<{ ok: boolean; error?: string }>) =>
    startTransition(async () => {
      setError(null)
      const res = await fn(id)
      if (!res.ok) setError(res.error ?? 'Something went wrong')
    })

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      {status !== 'approved' && (
        <button type="button" disabled={pending} onClick={() => run(approveReview)} style={btn('#22a06b', '#fff')}>
          {status === 'rejected' ? 'Approve after all' : 'Approve'}
        </button>
      )}
      {status !== 'rejected' && (
        <button type="button" disabled={pending} onClick={() => run(rejectReview)} style={btn('#fff', '#c0392b', '#e8b4ae')}>
          {status === 'approved' ? 'Unpublish' : 'Reject'}
        </button>
      )}
      {pending && <span style={{ fontSize: 12, color: '#888' }}>Saving…</span>}
      {error && <span style={{ fontSize: 12, color: '#c0392b' }}>{error}</span>}
    </div>
  )
}

function btn(bg: string, color: string, border = bg): React.CSSProperties {
  return {
    padding: '8px 16px', borderRadius: 8, border: `1px solid ${border}`,
    background: bg, color, fontSize: 13, fontWeight: 600, cursor: 'pointer',
  }
}
