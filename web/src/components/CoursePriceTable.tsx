import { MONTH_LABELS, PRICE_SOURCE, type PriceSummary } from '@/lib/prices'

/**
 * Month-by-month green-fee table. Shared by the course detail page
 * (`variant="card"`, must match the previous inline markup pixel-for-pixel)
 * and the standalone green-fees page (`variant="full"`, roomier).
 */
export function CoursePriceTable({
  summary,
  variant = 'card',
  showCaption = true,
}: {
  summary: PriceSummary
  variant?: 'card' | 'full'
  showCaption?: boolean
}) {
  const { byMonth, months, currentMonth, twilightOnly, buggyIncluded, buggyAddOn, hasTwilight } = summary
  if (months.length === 0) return null

  const priceCols: { slot: 'standard' | 'twilight'; label: string }[] = twilightOnly
    ? [{ slot: 'twilight', label: buggyIncluded ? 'Twilight · buggy incl.' : 'Twilight' }]
    : [
        { slot: 'standard', label: 'Standard' },
        ...(hasTwilight ? [{ slot: 'twilight' as const, label: 'Twilight' }] : []),
      ]

  const gridCols = `44px ${priceCols.map(() => '1fr').join(' ')}`

  const full = variant === 'full'
  const cellFont = full ? 15 : 13
  const monthFont = full ? 13 : 12
  const rowPad = full ? '11px 14px' : '8px 12px'
  const headPad = full ? '9px 14px' : '7px 12px'

  return (
    <div style={{ marginBottom: full ? 24 : 20 }}>
      <div style={{ border: '1px solid #ebebeb', borderRadius: 12, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, padding: headPad, background: '#f9f9f9', borderBottom: '1px solid #ebebeb' }}>
          <span />
          {priceCols.map(col => (
            <span key={col.slot} style={{ fontSize: 10, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '.05em', textAlign: 'right' }}>
              {col.label}
            </span>
          ))}
        </div>

        {/* One row per month with data */}
        {months.map(m => {
          const isCurrent = m === currentMonth
          return (
            <div key={m} style={{ display: 'grid', gridTemplateColumns: gridCols, padding: rowPad, borderBottom: '1px solid #f4f4f4', background: isCurrent ? '#fff8f0' : '#fff' }}>
              <span style={{ fontSize: monthFont, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#2B6090' : '#888' }}>
                {MONTH_LABELS[m - 1]}
              </span>
              {priceCols.map((col, idx) => {
                const p = byMonth[m][col.slot]
                const primaryCol = idx === 0
                return (
                  <span
                    key={col.slot}
                    style={{
                      fontSize: cellFont,
                      fontWeight: 700,
                      color: isCurrent ? (primaryCol ? '#222' : '#555') : (primaryCol ? '#444' : '#aaa'),
                      textAlign: 'right',
                    }}
                  >
                    {p ? (
                      <>
                        €{p.price_eur}
                        {p.buggy_included && !twilightOnly && (
                          <span style={{ fontSize: 10, color: '#888', fontWeight: 400 }}> {col.slot === 'standard' ? 'incl. buggy' : 'incl.'}</span>
                        )}
                      </>
                    ) : (
                      '—'
                    )}
                  </span>
                )
              })}
            </div>
          )
        })}

        {/* Optional buggy add-on */}
        {buggyAddOn != null && !buggyIncluded && (
          <div style={{ padding: headPad, fontSize: 11, color: '#888', background: '#fafafa' }}>+ buggy €{buggyAddOn} optional</div>
        )}
      </div>
      {showCaption && (
        <p style={{ fontSize: 10, color: '#b0b0b0', margin: '6px 0 0', textAlign: 'right' }}>Prices indicative · source: {PRICE_SOURCE}</p>
      )}
    </div>
  )
}
