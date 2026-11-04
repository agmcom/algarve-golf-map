'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { href: '/guide', label: 'Guide' },
  { href: '/club-rental', label: 'Club rental' },
  { href: '/shops', label: 'Golf shops' },
  { href: '/partners', label: 'Partner with us' },
]

const ITEM_STYLE: React.CSSProperties = {
  display: 'block', width: '100%',
  padding: '10px 12px', borderRadius: 10,
  border: 'none', background: 'transparent',
  color: '#222', fontSize: 14, fontWeight: 500,
  textAlign: 'left', textDecoration: 'none',
  cursor: 'pointer', fontFamily: 'var(--font-body)',
  whiteSpace: 'nowrap',
  transition: 'background .1s',
}

function highlight(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.background = '#f5f5f5'
}

function unhighlight(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.background = 'transparent'
}

interface SiteMenuProps {
  onContact: () => void
  size?: number
  floating?: boolean
}

export function SiteMenu({ onContact, size = 34, floating = false }: SiteMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onMouseDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const Icon = open ? X : Menu

  return (
    <div ref={rootRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        style={{
          width: size, height: size,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0,
          border: '1px solid #ebebeb', borderRadius: '50%',
          background: '#fff', color: '#222',
          cursor: 'pointer',
          boxShadow: floating ? '0 1px 6px rgba(0,0,0,.06)' : 'none',
        }}
      >
        <Icon size={18} strokeWidth={2} />
      </button>

      {/* Hidden rather than unmounted, so the links stay crawlable on every page */}
      <nav
        aria-label="Site menu"
        style={{
          display: open ? 'block' : 'none',
          position: 'absolute', top: size + 8, right: 0, zIndex: 9999,
          minWidth: 190,
          background: '#fff', border: '1px solid #ebebeb',
          borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,.13)',
          padding: 6,
        }}
      >
        {LINKS.map(link => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            onMouseEnter={highlight}
            onMouseLeave={unhighlight}
            style={ITEM_STYLE}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={() => { setOpen(false); onContact() }}
          onMouseEnter={highlight}
          onMouseLeave={unhighlight}
          style={ITEM_STYLE}
        >
          Contact
        </button>
      </nav>
    </div>
  )
}
