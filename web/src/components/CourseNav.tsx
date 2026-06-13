'use client'

import { useEffect, useState } from 'react'

interface Section {
  id: string
  label: string
}

export function CourseNav({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-10% 0px -80% 0px' }
    )
    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sections])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const offset = 56 + 52
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div style={{
      position: 'sticky',
      top: 56,
      zIndex: 40,
      background: '#fff',
      borderBottom: '1px solid #ebebeb',
    }}>
      <div
        className="no-scrollbar"
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          gap: 0,
          overflowX: 'auto',
        }}
      >
        {sections.map(({ id, label }) => {
          const active = activeId === id
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                flexShrink: 0,
                padding: '0 16px',
                height: 52,
                border: 'none',
                borderBottom: active ? '2px solid #2B6090' : '2px solid transparent',
                background: 'transparent',
                color: active ? '#222' : '#6a6a6a',
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'color .15s, border-color .15s',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
