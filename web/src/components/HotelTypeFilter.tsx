import { TYPE_GROUPS, type HotelTypeGroup } from '@/lib/hotels'

// "All · Hotels & resorts · Villas & apartments · B&Bs & guest houses" with counts.
// Groups with no hotels are hidden; the bar disappears when there's nothing to filter.
export function HotelTypeFilter({ value, onChange, total, counts }: {
  value: HotelTypeGroup | 'all'
  onChange: (v: HotelTypeGroup | 'all') => void
  total: number
  counts: Record<HotelTypeGroup, number>
}) {
  const groups = TYPE_GROUPS.filter(g => counts[g.key] > 0)
  if (groups.length < 2) return null
  const options: { key: HotelTypeGroup | 'all'; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: total },
    ...groups.map(g => ({ key: g.key, label: g.label, count: counts[g.key] })),
  ]
  return (
    <div role="group" aria-label="Filter by type" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
      {options.map(o => {
        const active = value === o.key
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.key)}
            style={{
              fontSize: 12, fontWeight: 600, padding: '6px 11px', borderRadius: 999, cursor: 'pointer',
              border: `1px solid ${active ? '#2B6090' : '#dcdcdc'}`,
              background: active ? '#2B6090' : '#fff',
              color: active ? '#fff' : '#4a4a4a',
              fontFamily: 'inherit',
            }}
          >
            {o.label} <span style={{ opacity: 0.75, fontWeight: 500 }}>{o.count}</span>
          </button>
        )
      })}
    </div>
  )
}
