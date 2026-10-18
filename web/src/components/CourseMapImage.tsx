'use client'

import { useState } from 'react'

interface CourseMapImageProps {
  src: string
  alt: string
}

export function CourseMapImage({ src, alt }: CourseMapImageProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'block', width: '100%', padding: 0,
          border: '1px solid #ebebeb', borderRadius: 12,
          overflow: 'hidden', cursor: 'zoom-in', background: 'none',
          position: 'relative',
        }}
        aria-label="Expand course map"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', display: 'block', maxHeight: 320, objectFit: 'cover' }}
        />
        <span style={{
          position: 'absolute', bottom: 10, right: 10,
          background: 'rgba(0,0,0,.55)', color: '#fff',
          fontSize: 11, fontWeight: 600, padding: '4px 10px',
          borderRadius: 20, letterSpacing: '.04em',
          backdropFilter: 'blur(4px)',
        }}>
          ⤢ Ampliar
        </span>
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out', padding: 24,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '100%', maxHeight: '90vh',
              borderRadius: 12, display: 'block',
              boxShadow: '0 24px 80px rgba(0,0,0,.6)',
              cursor: 'default',
            }}
          />
          <button
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', top: 20, right: 24,
              background: 'rgba(255,255,255,.15)', border: 'none',
              color: '#fff', fontSize: 22, width: 40, height: 40,
              borderRadius: '50%', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}
