import { Star } from 'lucide-react'

// Read-only star rating. Supports fractional averages (e.g. 4.3 → 4 full + partial).
export function ReviewStars({ value, size = 16, color = '#e0a526' }: { value: number; size?: number; color?: string }) {
  return (
    <span role="img" aria-label={`${value} out of 5 stars`} style={{ display: 'inline-flex', gap: 2, verticalAlign: 'middle' }}>
      {[1, 2, 3, 4, 5].map(i => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)))
        return (
          <span key={i} style={{ position: 'relative', width: size, height: size, display: 'inline-block' }}>
            <Star size={size} strokeWidth={1.6} color="#d8d8d8" fill="#ececec" style={{ position: 'absolute', inset: 0 }} />
            {fill > 0 && (
              <span style={{ position: 'absolute', inset: 0, width: `${fill * 100}%`, overflow: 'hidden' }}>
                <Star size={size} strokeWidth={1.6} color={color} fill={color} />
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}
