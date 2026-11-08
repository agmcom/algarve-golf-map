'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ContactModal } from './ContactModal'
import { SiteMenu } from './SiteMenu'

interface SiteHeaderProps {
  showBackToMap?: boolean
  /** Point the back link somewhere other than the map (e.g. a parent listing). */
  back?: { href: string; label: string; shortLabel: string }
}

export function SiteHeader({ showBackToMap = false, back }: SiteHeaderProps) {
  const backLink = back ?? { href: '/', label: 'Back to map', shortLabel: 'Map' }
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
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src="/logo.svg" alt="" style={{ width: 24, height: 24, flexShrink: 0 }} />
              <span className="site-header__wordmark" style={{ fontSize: 14, fontWeight: 700, color: '#222', whiteSpace: 'nowrap' }}>
                Algarve Golf Map
              </span>
            </Link>
            {(showBackToMap || back) && (
              <>
                <span className="site-header__wordmark" style={{ color: '#d0d0d0', fontSize: 16 }}>|</span>
                <Link href={backLink.href} style={{
                  fontSize: 13, fontWeight: 500, color: '#6a6a6a',
                  textDecoration: 'none', whiteSpace: 'nowrap',
                }}>
                  <span className="site-header__back-full">← {backLink.label}</span>
                  <span className="site-header__back-short">← {backLink.shortLabel}</span>
                </Link>
              </>
            )}
          </div>

          {/* Right: site menu */}
          <SiteMenu onContact={() => setContactOpen(true)} />
        </div>
      </nav>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </>
  )
}
