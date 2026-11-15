'use client'

import { Fragment, useState } from 'react'
import type { Scorecard, ScorecardHole } from '@/data/scorecards'
import { teeSwatch, teeLength, parOf, toYards, fmtNum } from '@/lib/scorecard'

// GA4 event if gtag is on the page (it is loaded in layout.tsx); never blocks the UI.
function trackEvent(name: string, params: Record<string, string>) {
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag
  try { g?.('event', name, params) } catch { /* ignore */ }
}

type Unit = 'm' | 'yd'

export function ScorecardTable({ card, courseName }: { card: Scorecard; courseName: string }) {
  const [unit, setUnit] = useState<Unit>('m')
  const [focus, setFocus] = useState<string | null>(null)

  const holes = card.loops.flatMap(l => l.holes)
  const hasLadiesSi = holes.some(h => h.siLadies != null && h.siLadies !== h.si)
  const hasLadiesPar = holes.some(h => h.parLadies != null && h.parLadies !== h.par)
  const hasSi = holes.some(h => h.si != null)
  const dist = (m: number | null | undefined) => (m == null ? '—' : fmtNum(unit === 'm' ? m : toYards(m)))

  const changeUnit = (u: Unit) => {
    setUnit(u)
    trackEvent('scorecard_unit', { unit: u })
  }

  const cellBg = (tee: string) => (focus === tee ? '#f3f8ee' : undefined)

  const totalRow = (label: string, hs: ScorecardHole[], strong = false) => (
    <tr style={{ background: strong ? '#f4f4f4' : '#fafafa' }}>
      <th scope="row" style={{ ...tdFirst, background: strong ? '#f4f4f4' : '#fafafa', fontWeight: 800 }}>{label}</th>
      <td style={{ ...td, fontWeight: 800 }}>{parOf(hs)}</td>
      {hasLadiesPar && <td style={{ ...td, fontWeight: 800 }}>{hs.every(h => h.parLadies != null) ? parOf(hs.map(h => ({ ...h, par: h.parLadies! }))) : '—'}</td>}
      {hasSi && <td style={td} />}
      {hasLadiesSi && <td style={td} />}
      {card.tees.map(t => (
        <td key={t} style={{ ...td, fontWeight: 800, background: cellBg(t) }}>{dist(teeLength(hs, t))}</td>
      ))}
    </tr>
  )

  const holeRow = (h: ScorecardHole) => (
    <tr key={h.n}>
      <th scope="row" style={tdFirst}>{h.n}</th>
      <td style={{ ...td, fontWeight: 700 }}>{h.par}</td>
      {hasLadiesPar && <td style={td}>{h.parLadies ?? h.par}</td>}
      {hasSi && <td style={td}>{h.si ?? '—'}</td>}
      {hasLadiesSi && <td style={td}>{h.siLadies ?? '—'}</td>}
      {card.tees.map(t => (
        <td key={t} style={{ ...td, background: cellBg(t) }}>{dist(h.m[t])}</td>
      ))}
    </tr>
  )

  return (
    <div className="scorecard">
      {/* Controls */}
      <div className="scorecard-controls" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div role="group" aria-label="Distance unit" style={{ display: 'inline-flex', border: '1px solid #dcdcdc', borderRadius: 999, overflow: 'hidden' }}>
          {(['m', 'yd'] as Unit[]).map(u => (
            <button
              key={u}
              type="button"
              onClick={() => changeUnit(u)}
              aria-pressed={unit === u}
              style={{
                padding: '7px 16px', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
                background: unit === u ? '#222' : '#fff', color: unit === u ? '#fff' : '#444',
              }}
            >
              {u === 'm' ? 'Metres' : 'Yards'}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => { trackEvent('scorecard_print', {}); window.print() }}
          style={{ padding: '7px 16px', fontSize: 13, fontWeight: 700, border: '1px solid #dcdcdc', borderRadius: 999, background: '#fff', color: '#444', cursor: 'pointer' }}
        >
          Print scorecard
        </button>
      </div>

      {card.tees.length > 1 && (
        <div className="scorecard-controls" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#6a6a6a', marginRight: 4 }}>Highlight your tees:</span>
          {card.tees.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setFocus(focus === t ? null : t)}
              aria-pressed={focus === t}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', fontSize: 13, fontWeight: 600,
                borderRadius: 999, cursor: 'pointer', color: '#333',
                border: focus === t ? '1.5px solid #222' : '1px solid #dcdcdc', background: focus === t ? '#f3f8ee' : '#fff',
              }}
            >
              <span aria-hidden="true" style={{ width: 11, height: 11, borderRadius: '50%', background: teeSwatch(t), border: '1px solid rgba(0,0,0,.25)' }} />
              {t}
            </button>
          ))}
        </div>
      )}

      {card.loops.map(loop => {
        const single18 = loop.holes.length === 18
        const front = loop.holes.slice(0, 9)
        const back = loop.holes.slice(9)
        return (
          <div key={loop.name ?? 'main'} style={{ marginBottom: 20 }}>
            {card.loops.length > 1 && (
              <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#222', margin: '0 0 8px' }}>{loop.name} loop</h3>
            )}
            <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid #ebebeb', background: '#fff' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14.5, color: '#333', fontVariantNumeric: 'tabular-nums' }}>
                <caption style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                  {courseName}{loop.name ? ` ${loop.name} loop` : ''} scorecard: par, stroke index and {unit === 'm' ? 'metres' : 'yards'} from each tee
                </caption>
                <thead>
                  <tr>
                    <th scope="col" style={{ ...th, ...stickyFirst, background: '#fff' }}>Hole</th>
                    <th scope="col" style={th}>{hasLadiesPar ? 'Par (men)' : 'Par'}</th>
                    {hasLadiesPar && <th scope="col" style={th}>Par (ladies)</th>}
                    {hasSi && <th scope="col" style={th} title="Stroke index: 1 is the hardest hole">{hasLadiesSi ? 'SI (men)' : 'SI'}</th>}
                    {hasLadiesSi && <th scope="col" style={th}>SI (ladies)</th>}
                    {card.tees.map(t => (
                      <th key={t} scope="col" style={{ ...th, background: cellBg(t) }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: '50%', background: teeSwatch(t), border: '1px solid rgba(0,0,0,.25)', flexShrink: 0 }} />
                          {t}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {single18 ? (
                    <>
                      {front.map(holeRow)}
                      {totalRow('Out', front)}
                      {back.map(holeRow)}
                      {totalRow('In', back)}
                      {totalRow('Total', loop.holes, true)}
                    </>
                  ) : (
                    <Fragment>
                      {loop.holes.map(holeRow)}
                      {totalRow(card.loops.length > 1 ? `${loop.name} total` : 'Total', loop.holes, true)}
                    </Fragment>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}

      <p style={{ fontSize: 12, color: '#8a8a8a', margin: '4px 0 0', lineHeight: 1.6 }}>
        {unit === 'yd'
          ? `Yards are converted from the club's official metres and rounded to the nearest yard.`
          : card.convertedFromYards
            ? `The club's card is in yards; metres are converted and rounded.`
            : `Distances in metres, as printed on the club's official card.`}
        {hasSi ? ' SI = stroke index: 1 is the hole the club rates hardest, and it decides where you receive your handicap shots.' : ''}
      </p>
    </div>
  )
}

const th: React.CSSProperties = {
  textAlign: 'center', padding: '10px 10px', fontSize: 12.5, fontWeight: 700,
  color: '#6a6a6a', borderBottom: '1px solid #ebebeb', whiteSpace: 'nowrap',
}
const td: React.CSSProperties = { textAlign: 'center', padding: '8px 10px', borderBottom: '1px solid #f2f2f2', whiteSpace: 'nowrap' }
const stickyFirst: React.CSSProperties = { position: 'sticky', left: 0, zIndex: 1 }
const tdFirst: React.CSSProperties = { ...td, ...stickyFirst, background: '#fff', fontWeight: 700, color: '#222', borderRight: '1px solid #f2f2f2' }
