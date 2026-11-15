'use client'

import { useState } from 'react'

// Click-to-play YouTube video: shows the thumbnail until clicked, so a page with 18 videos
// stays fast and loads nothing from YouTube until the visitor asks for it.
export function HoleVideo({ id, title }: { id: string; title: string }) {
  const [on, setOn] = useState(false)

  const play = () => {
    setOn(true)
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag
    try { g?.('event', 'hole_video_play', { video_id: id }) } catch { /* ignore */ }
  }

  return (
    <div className="no-print" style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: 12, overflow: 'hidden', background: '#111', marginTop: 12 }}>
      {on ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
        />
      ) : (
        <button
          type="button"
          onClick={play}
          aria-label={`Play video: ${title}`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', padding: 0, border: 0, cursor: 'pointer', background: 'none' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.85 }}
          />
          <span aria-hidden="true" style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 64, height: 44, borderRadius: 12, background: 'rgba(0,0,0,.72)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '17px solid #fff', marginLeft: 4 }} />
          </span>
          <span style={{ position: 'absolute', left: 12, bottom: 10, fontSize: 12.5, fontWeight: 600, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,.7)' }}>
            Watch the hole
          </span>
        </button>
      )}
    </div>
  )
}
