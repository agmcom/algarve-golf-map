'use client'

import { useState } from 'react'
import { ContactModal } from './ContactModal'

interface SiteHeaderProps {
  showBackToMap?: boolean
}

export function SiteHeader({ showBackToMap = false }: SiteHeaderProps) {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#fff', borderBottom: '1px solid #ebebeb',
        height: 56,
      }}>
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '0 24px',
          height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Left: logo + back link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 18 }}>⛳️</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#222', whiteSpace: 'nowrap' }}>
                Algarve Golf Map
              </span>
            </a>
            {showBackToMap && (
              <>
                <span style={{ color: '#d0d0d0', fontSize: 16 }}>|</span>
                <a href="/" style={{
                  fontSize: 13, fontWeight: 500, color: '#6a6a6a',
                  textDecoration: 'none', whiteSpace: 'nowrap',
                }}>
                  ← Back to map
                </a>
              </>
            )}
          </div>

          {/* Right: contact button */}
          <button
            onClick={() => setContactOpen(true)}
            style={{
              height: 34, padding: '0 16px',
              border: '1.5px solid #ebebeb', borderRadius: 20,
              background: '#fff', color: '#222',
              fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-body)',
              whiteSpace: 'nowrap',
              transition: 'border-color .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#2A6B4A')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#ebebeb')}
          >
            Contact
          </button>
        </div>
      </nav>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </>
  )
}
