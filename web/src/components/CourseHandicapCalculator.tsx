'use client'

import { useState } from 'react'
import { courseHandicap, isJuniorTee, type RatedLoop } from '@/data/course-ratings'

function fmt(n: number): string {
  return n < 0 ? `+${Math.abs(n)}` : String(n)
}

export function CourseHandicapCalculator({ loops, courseName, nineHole = false }: { loops: RatedLoop[]; courseName: string; nineHole?: boolean }) {
  const [raw, setRaw] = useState('18')
  const [who, setWho] = useState<'men' | 'women'>('men')
  const value = raw.trim().replace(',', '.').replace(/^\+/, '-')
  const index = value === '' ? NaN : Number(value)
  const valid = Number.isFinite(index) && index >= -10 && index <= 54
  // Tees rated for one sex but not the other (junior tees aside), e.g. back tees rated for men only.
  const other = who === 'men' ? 'women' : 'men'
  const unrated = [...new Set(loops.flatMap(l => l.tees)
    .filter(t => !isJuniorTee(t) && t[other] && !t[who])
    .map(t => t.colour))]

  return (
    <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 14, padding: '18px 18px 14px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', marginBottom: 16 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600, color: '#444' }}>
          Your Handicap Index
          <input
            inputMode="decimal"
            value={raw}
            onChange={e => setRaw(e.target.value)}
            aria-label="Your Handicap Index"
            style={{ width: 110, padding: '9px 12px', fontSize: 16, border: '1px solid #d6d6d6', borderRadius: 10, fontFamily: 'inherit' }}
          />
        </label>
        <div role="group" aria-label="Tees for" style={{ display: 'flex', border: '1px solid #d6d6d6', borderRadius: 10, overflow: 'hidden' }}>
          {(['men', 'women'] as const).map(w => (
            <button
              key={w}
              type="button"
              onClick={() => setWho(w)}
              aria-pressed={who === w}
              style={{
                padding: '9px 16px', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                background: who === w ? '#2B6090' : '#fff', color: who === w ? '#fff' : '#444',
              }}
            >
              {w === 'men' ? 'Men' : 'Women'}
            </button>
          ))}
        </div>
      </div>

      {!valid ? (
        <p style={{ fontSize: 14, color: '#a33', margin: 0 }}>Enter a Handicap Index between 0 and 54 (use + for plus handicaps).</p>
      ) : (
        loops.map(loop => {
          const tees = loop.tees.filter(t => t[who] && !isJuniorTee(t))
          if (tees.length === 0) return null
          return (
            <div key={loop.fpgName} style={{ marginBottom: 12 }}>
              {loops.length > 1 && <div style={{ fontSize: 13, fontWeight: 700, color: '#222', margin: '4px 0 6px' }}>{loop.name}</div>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {tees.map(t => (
                  <div key={t.colour} style={{ border: '1px solid #ebebeb', borderRadius: 10, padding: '8px 12px', minWidth: 96 }}>
                    <div style={{ fontSize: 12, color: '#6a6a6a' }}>{t.colour} tees</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#222' }}>{fmt(courseHandicap(index, t[who]!))}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}
      {valid && unrated.length > 0 && (
        <p style={{ fontSize: 13, color: '#444', margin: '4px 0 8px', lineHeight: 1.6 }}>
          {`Only tees with an official ${who === 'men' ? "men's" : "women's"} rating are shown. The federation doesn't rate the ${
            unrated.length === 1 ? unrated[0] : `${unrated.slice(0, -1).join(', ')} and ${unrated[unrated.length - 1]}`
          } tees for ${who} here, so if you'd like to play from them, ask the club how your handicap will be worked out.`}
        </p>
      )}
      <p style={{ fontSize: 12, color: '#8a8a8a', margin: '6px 0 0', lineHeight: 1.6 }}>
        {nineHole ? 'These figures are for 18 holes, playing the nine twice. ' : ''}Course handicap = Handicap Index × slope ÷ 113 + (course rating − par), rounded. In competitions your playing handicap may
        be a percentage of this. Ask {courseName} which tees you can play.
      </p>
    </div>
  )
}
