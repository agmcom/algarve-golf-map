'use client'

import { useEffect, useRef } from 'react'
import { Scale } from 'lucide-react'
import type { Course } from '@/types/database'

const PEXELS_FALLBACK = 'https://images.pexels.com/photos/6048946/pexels-photo-6048946.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop'

function heroUrl(course: Course): string {
  return course.photos?.find(p => p.is_hero)?.url ?? PEXELS_FALLBACK
}

interface CompareButtonProps {
  count: number
  onClick: () => void
}

export function CompareButton({ count, onClick }: CompareButtonProps) {
  if (count === 0) return null
  return (
    <button
      onClick={onClick}
      style={{
        height: 44,
        padding: '0 18px',
        background: '#222',
        color: '#fff',
        border: 'none',
        borderRadius: 22,
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(0,0,0,.25)',
        fontFamily: 'var(--font-body)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <Scale size={15} strokeWidth={2.2} />
      Compare courses
      <span style={{
        background: '#2B6090',
        color: '#fff',
        borderRadius: '50%',
        width: 20,
        height: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 800,
      }}>
        {count}
      </span>
    </button>
  )
}

interface ComparePopupProps {
  courses: Course[]
  onRemove: (id: string) => void
  onCompare: () => void
  onClose: () => void
  anchorRect: DOMRect | null
}

export function ComparePopup({ courses, onRemove, onCompare, onClose, anchorRect }: ComparePopupProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const top = anchorRect ? anchorRect.bottom + 10 : 74
  const right = anchorRect ? window.innerWidth - anchorRect.right : 48

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top,
        right,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,.18)',
        border: '1px solid #ebebeb',
        padding: '12px',
        minWidth: 260,
        zIndex: 9999,
      }}
    >
      {/* Arrow */}
      <div style={{
        position: 'absolute',
        top: -7,
        right: 20,
        width: 14,
        height: 14,
        background: '#fff',
        border: '1px solid #ebebeb',
        borderBottom: 'none',
        borderRight: 'none',
        transform: 'rotate(45deg)',
      }} />

      {/* Course rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {courses.map(c => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroUrl(c)} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{
              flex: 1, fontSize: 13, fontWeight: 600, color: '#222',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {c.name}
            </span>
            <button
              onClick={() => onRemove(c.id)}
              style={{
                width: 22, height: 22, borderRadius: '50%',
                background: '#f5f5f5', border: 'none', cursor: 'pointer',
                fontSize: 14, color: '#888', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >×</button>
          </div>
        ))}

        {/* Empty slots */}
        {courses.length < 4 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 8, flexShrink: 0,
              border: '1.5px dashed #d0d0d0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 18, color: '#d0d0d0' }}>+</span>
            </div>
            <span style={{ fontSize: 12, color: '#b0b0b0' }}>
              {4 - courses.length === 1 ? 'Add 1 more' : `Add up to ${4 - courses.length} more`}
            </span>
          </div>
        )}
      </div>

      {/* Compare CTA */}
      <button
        onClick={onCompare}
        disabled={courses.length < 2}
        style={{
          width: '100%', height: 38, borderRadius: 10,
          background: courses.length >= 2 ? '#2B6090' : '#f0f0f0',
          color: courses.length >= 2 ? '#fff' : '#b0b0b0',
          border: 'none',
          cursor: courses.length >= 2 ? 'pointer' : 'default',
          fontSize: 13, fontWeight: 700,
          fontFamily: 'var(--font-body)',
          transition: 'background .15s',
        }}
      >
        {courses.length < 2 ? 'Select at least 2 courses' : `Compare ${courses.length} courses`}
      </button>
    </div>
  )
}
