'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface TopBarProps {
  activeFilters: Set<string>
  onToggleFilter: (key: string) => void
  onClearFilters: () => void
  hcpMen: number | null
  hcpLadies: number | null
  onSetHcpMen: (v: number | null) => void
  onSetHcpLadies: (v: number | null) => void
  showTop10?: boolean
  rightSlot?: React.ReactNode
}

const QUICK_FILTERS = [
  { key: 'top_rated',    label: 'Top 10' },
  { key: 'clubs_rental', label: 'Clubs rental' },
  { key: 'under_150',    label: 'Under €150' },
  { key: 'ocean_view',   label: 'Ocean view' },
  { key: 'onsite_hotel', label: 'On-site hotel' },
]

const FARO_OPTIONS = [
  { key: 'faro_30', label: 'Under 30 min' },
  { key: 'faro_60', label: 'Under 1 hour' },
  { key: 'faro_90', label: 'Under 1h 30min' },
]

const MORE_SECTIONS = [
  {
    title: 'Holes',
    filters: [
      { key: 'holes_18', label: '18 holes' },
      { key: 'holes_9',  label: '9 holes' },
      { key: 'holes_27', label: '27 holes' },
    ],
  },
  {
    title: 'Difficulty',
    filters: [
      { key: 'easy',        label: 'Easy (slope < 120)' },
      { key: 'moderate',    label: 'Moderate (120–130)' },
      { key: 'challenging', label: 'Challenging (> 130)' },
    ],
  },
  {
    title: 'Features',
    filters: [
      { key: 'signature',    label: 'Signature' },
      { key: 'driving_range', label: 'Driving range' },
    ],
  },
]

const MORE_KEYS = MORE_SECTIONS.flatMap(s => s.filters.map(f => f.key))

export function TopBar({ activeFilters, onToggleFilter, onClearFilters, hcpMen, hcpLadies, onSetHcpMen, onSetHcpLadies, showTop10 = false, rightSlot }: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState<{ top: number; right: number } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [faroOpen, setFaroOpen] = useState(false)
  const [faroPos, setFaroPos] = useState<{ top: number; left: number } | null>(null)
  const faroButtonRef = useRef<HTMLButtonElement>(null)
  const faroDropdownRef = useRef<HTMLDivElement>(null)

  const [hcpMenOpen, setHcpMenOpen] = useState(false)
  const [hcpMenPos, setHcpMenPos] = useState<{ top: number; left: number } | null>(null)
  const hcpMenButtonRef = useRef<HTMLButtonElement>(null)
  const hcpMenDropdownRef = useRef<HTMLDivElement>(null)

  const [hcpLadiesOpen, setHcpLadiesOpen] = useState(false)
  const [hcpLadiesPos, setHcpLadiesPos] = useState<{ top: number; left: number } | null>(null)
  const hcpLadiesButtonRef = useRef<HTMLButtonElement>(null)
  const hcpLadiesDropdownRef = useRef<HTMLDivElement>(null)

  const activeFaroKey = FARO_OPTIONS.find(o => activeFilters.has(o.key))?.key ?? null

  const openFaro = useCallback(() => {
    if (faroButtonRef.current) {
      const rect = faroButtonRef.current.getBoundingClientRect()
      setFaroPos({ top: rect.bottom + 8, left: rect.left })
    }
    setFaroOpen(v => !v)
  }, [])

  const openHcpMen = useCallback(() => {
    if (hcpMenButtonRef.current) {
      const rect = hcpMenButtonRef.current.getBoundingClientRect()
      setHcpMenPos({ top: rect.bottom + 8, left: rect.left })
    }
    setHcpMenOpen(v => !v)
  }, [])

  const openHcpLadies = useCallback(() => {
    if (hcpLadiesButtonRef.current) {
      const rect = hcpLadiesButtonRef.current.getBoundingClientRect()
      setHcpLadiesPos({ top: rect.bottom + 8, left: rect.left })
    }
    setHcpLadiesOpen(v => !v)
  }, [])

  useEffect(() => {
    if (!faroOpen) return
    function onMouseDown(e: MouseEvent) {
      const target = e.target as Node
      if (
        faroButtonRef.current && !faroButtonRef.current.contains(target) &&
        faroDropdownRef.current && !faroDropdownRef.current.contains(target)
      ) setFaroOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [faroOpen])

  useEffect(() => {
    if (!hcpMenOpen) return
    function onMouseDown(e: MouseEvent) {
      const target = e.target as Node
      if (
        hcpMenButtonRef.current && !hcpMenButtonRef.current.contains(target) &&
        hcpMenDropdownRef.current && !hcpMenDropdownRef.current.contains(target)
      ) setHcpMenOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [hcpMenOpen])

  useEffect(() => {
    if (!hcpLadiesOpen) return
    function onMouseDown(e: MouseEvent) {
      const target = e.target as Node
      if (
        hcpLadiesButtonRef.current && !hcpLadiesButtonRef.current.contains(target) &&
        hcpLadiesDropdownRef.current && !hcpLadiesDropdownRef.current.contains(target)
      ) setHcpLadiesOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [hcpLadiesOpen])

  const openDropdown = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right })
    }
    setDropdownOpen(v => !v)
  }, [])

  useEffect(() => {
    if (!dropdownOpen) return
    function onMouseDown(e: MouseEvent) {
      const target = e.target as Node
      if (
        buttonRef.current && !buttonRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [dropdownOpen])

  const moreActiveCount = MORE_KEYS.filter(k => activeFilters.has(k)).length

  return (
    <>
      <div
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.6) 72%, transparent 100%)',
          paddingTop: 20,
          paddingBottom: 36,
        }}
      >
        <div
          className="pointer-events-none"
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            gap: 16,
            paddingLeft: 48,
            paddingRight: 48,
          }}
        >
        {/* Logo */}
        <div className="pointer-events-auto">
          <div
            className="flex items-center gap-2"
            style={{
              height: 44,
              padding: '0 16px',
              background: '#ffffff',
              border: '1px solid #ebebeb',
              borderRadius: 24,
              boxShadow: '0 2px 12px rgba(0,0,0,.08)',
            }}
          >
            <img src="/logo.svg" alt="" style={{ width: 26, height: 26, flexShrink: 0 }} />
            <span style={{ font: '700 15px var(--font-body)', color: '#222', whiteSpace: 'nowrap' }}>
              Algarve Golf Map
            </span>
          </div>
        </div>

        {/* All filter chips + More filters in one scrollable row */}
        <div className="pointer-events-auto overflow-hidden">
          <div className="flex gap-2 no-scrollbar items-center" style={{ overflowX: 'auto' }}>
            {QUICK_FILTERS.filter(f => f.key !== 'top_rated' || showTop10).map(f => (
              <FilterChip
                key={f.key}
                label={f.label}
                active={activeFilters.has(f.key)}
                onClick={() => onToggleFilter(f.key)}
              />
            ))}

            {/* Faro Airport distance filter */}
            <FilterChip
              label={activeFaroKey ? `✈ Faro · ${FARO_OPTIONS.find(o => o.key === activeFaroKey)?.label}` : '✈ Faro Airport'}
              active={!!activeFaroKey}
              onClick={openFaro}
              buttonRef={faroButtonRef}
              suffix={
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: 4, flexShrink: 0, transition: 'transform .15s', transform: faroOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />

            {/* Men's handicap filter */}
            <FilterChip
              label={hcpMen != null ? `Men HCP ${hcpMen}` : 'Men handicap'}
              active={hcpMen != null}
              onClick={openHcpMen}
              buttonRef={hcpMenButtonRef}
              suffix={
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: 4, flexShrink: 0, transition: 'transform .15s', transform: hcpMenOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />

            {/* Ladies' handicap filter */}
            <FilterChip
              label={hcpLadies != null ? `Ladies HCP ${hcpLadies}` : 'Ladies handicap'}
              active={hcpLadies != null}
              onClick={openHcpLadies}
              buttonRef={hcpLadiesButtonRef}
              suffix={
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: 4, flexShrink: 0, transition: 'transform .15s', transform: hcpLadiesOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />

            {/* More filters chip — dropdown rendered as fixed portal to escape overflow clip */}
            <FilterChip
              label={moreActiveCount > 0 ? `Filters · ${moreActiveCount}` : 'More filters'}
              active={moreActiveCount > 0}
              onClick={openDropdown}
              buttonRef={buttonRef}
              suffix={
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: 4, flexShrink: 0, transition: 'transform .15s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
          </div>
        </div>

        {rightSlot && (
          <div className="pointer-events-auto flex items-center gap-2">
            {rightSlot}
          </div>
        )}
        </div>
      </div>

      {/* Faro Airport dropdown */}
      {faroOpen && faroPos && (
        <div
          ref={faroDropdownRef}
          style={{ position: 'fixed', top: faroPos.top, left: faroPos.left, zIndex: 9999 }}
        >
          <div style={{
            background: '#fff', border: '1px solid #ebebeb',
            borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,.13)',
            padding: '12px 14px', minWidth: 190,
          }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#6a6a6a', letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 10 }}>
              From Faro Airport
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {FARO_OPTIONS.map(o => {
                const isActive = activeFilters.has(o.key)
                return (
                  <button
                    key={o.key}
                    onClick={() => {
                      FARO_OPTIONS.forEach(opt => { if (opt.key !== o.key && activeFilters.has(opt.key)) onToggleFilter(opt.key) })
                      onToggleFilter(o.key)
                      setFaroOpen(false)
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 12px', borderRadius: 10, border: 'none',
                      background: isActive ? '#2B6090' : 'transparent',
                      color: isActive ? '#fff' : '#222',
                      fontSize: 13, fontWeight: 500, cursor: 'pointer',
                      textAlign: 'left', fontFamily: 'var(--font-body)',
                      transition: 'background .1s',
                    }}
                  >
                    <span style={{ fontSize: 15 }}>✈</span>
                    {o.label}
                  </button>
                )
              })}
              {activeFaroKey && (
                <button
                  onClick={() => { onToggleFilter(activeFaroKey); setFaroOpen(false) }}
                  style={{
                    marginTop: 4, padding: '6px 12px', borderRadius: 10,
                    border: 'none', background: 'none', cursor: 'pointer',
                    fontSize: 12, fontWeight: 500, color: '#2B6090',
                    textAlign: 'left', fontFamily: 'var(--font-body)',
                    borderTop: '1px solid #f0f0f0', paddingTop: 10,
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Men's HCP input panel */}
      {hcpMenOpen && hcpMenPos && (
        <div ref={hcpMenDropdownRef} style={{ position: 'fixed', top: hcpMenPos.top, left: hcpMenPos.left, zIndex: 9999 }}>
          <HcpInputPanel
            title="Men's handicap index"
            subtitle="Shows courses where you're allowed to play"
            value={hcpMen}
            onChange={onSetHcpMen}
            onClose={() => setHcpMenOpen(false)}
          />
        </div>
      )}

      {/* Ladies' HCP input panel */}
      {hcpLadiesOpen && hcpLadiesPos && (
        <div ref={hcpLadiesDropdownRef} style={{ position: 'fixed', top: hcpLadiesPos.top, left: hcpLadiesPos.left, zIndex: 9999 }}>
          <HcpInputPanel
            title="Ladies' handicap index"
            subtitle="Shows courses where you're allowed to play"
            value={hcpLadies}
            onChange={onSetHcpLadies}
            onClose={() => setHcpLadiesOpen(false)}
          />
        </div>
      )}

      {/* Dropdown rendered at root level to escape overflow clipping */}
      {dropdownOpen && dropdownPos && (
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            right: dropdownPos.right,
            zIndex: 9999,
          }}
        >
          <MoreDropdown
            sections={MORE_SECTIONS}
            activeFilters={activeFilters}
            onToggle={onToggleFilter}
            onClearAll={onClearFilters}
            onClose={() => setDropdownOpen(false)}
          />
        </div>
      )}
    </>
  )
}

interface FilterChipProps {
  label: string
  active: boolean
  onClick: () => void
  suffix?: React.ReactNode
  buttonRef?: React.RefObject<HTMLButtonElement | null>
}

function FilterChip({ label, active, onClick, suffix, buttonRef }: FilterChipProps) {
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
        padding: '8px 14px',
        borderRadius: 20,
        fontSize: 12.5,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        boxShadow: '0 1px 6px rgba(0,0,0,.06)',
        background: active ? '#2B6090' : '#ffffff',
        color: active ? '#ffffff' : '#222222',
        border: `1px solid ${active ? '#2B6090' : '#ebebeb'}`,
        fontFamily: 'var(--font-body)',
        transition: 'background .12s, color .12s, border-color .12s',
      }}
    >
      {label}
      {suffix}
    </button>
  )
}

interface MoreDropdownProps {
  sections: typeof MORE_SECTIONS
  activeFilters: Set<string>
  onToggle: (key: string) => void
  onClearAll: () => void
  onClose: () => void
}

function MoreDropdown({ sections, activeFilters, onToggle, onClearAll, onClose }: MoreDropdownProps) {
  const hasAny = activeFilters.size > 0

  return (
    <div
      style={{
        width: 272,
        background: '#ffffff',
        border: '1px solid #ebebeb',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,.13)',
        padding: '16px 16px 12px',
      }}
    >
      {sections.map((section, i) => (
        <div key={section.title} style={{ marginBottom: i < sections.length - 1 ? 14 : 0 }}>
          <div style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: '#6a6a6a',
            letterSpacing: '.07em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            {section.title}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {section.filters.map(f => (
              <FilterChip
                key={f.key}
                label={f.label}
                active={activeFilters.has(f.key)}
                onClick={() => onToggle(f.key)}
              />
            ))}
          </div>
        </div>
      ))}

      {hasAny && (
        <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 14, paddingTop: 10 }}>
          <button
            onClick={() => { onClearAll(); onClose() }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
              color: '#2B6090',
              padding: 0,
              fontFamily: 'var(--font-body)',
            }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}

function HcpInputPanel({ title, subtitle, value, onChange, onClose }: {
  title: string
  subtitle: string
  value: number | null
  onChange: (v: number | null) => void
  onClose: () => void
}) {
  const [raw, setRaw] = useState(value != null ? String(value) : '')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const s = e.target.value
    setRaw(s)
    if (s === '') {
      onChange(null)
      return
    }
    const n = parseFloat(s)
    if (!isNaN(n) && n >= 0 && n <= 54) onChange(n)
  }

  return (
    <div style={{
      background: '#fff', border: '1px solid #ebebeb',
      borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,.13)',
      padding: '14px 16px', minWidth: 220,
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#222', marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 11, color: '#b0b0b0', marginBottom: 12 }}>{subtitle}</div>
      <input
        type="number"
        value={raw}
        onChange={handleChange}
        placeholder="Enter your handicap"
        min={0}
        max={54}
        step={1}
        autoFocus
        style={{
          width: '100%',
          padding: '8px 10px',
          fontSize: 13,
          fontWeight: 500,
          color: '#222',
          border: '1.5px solid #ebebeb',
          borderRadius: 10,
          outline: 'none',
          boxSizing: 'border-box',
          fontFamily: 'var(--font-body)',
        }}
        onFocus={e => { e.target.style.borderColor = '#2B6090' }}
        onBlur={e => { e.target.style.borderColor = '#ebebeb' }}
      />
      {value != null && (
        <button
          onClick={() => { onChange(null); setRaw(''); onClose() }}
          style={{
            marginTop: 10, padding: 0, border: 'none', background: 'none',
            cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#2B6090',
            fontFamily: 'var(--font-body)',
          }}
        >
          Clear
        </button>
      )}
    </div>
  )
}
