// Tee-time booking CTAs shown under a course's price table.
// The booking link (Golfscape affiliate) is the primary action; the course
// website stays available as a secondary, outlined button.
// The buttons fill the container: side by side when there is room, stacked
// in narrow spots (mobile, the course page's sticky price card).
// Booking links carry data-tee-time-click so the site-wide GA4 listener in
// layout.tsx can track them as `tee_time_click`.

type Props = {
  bookingUrl: string | null
  websiteUrl: string | null
  phone?: string | null
  courseName: string
  /** Where on the site the buttons sit, sent to GA4 as click_source. */
  source: string
}

function bookingLabel(url: string): string {
  return url.includes('golfscape.com') ? 'Book on Golfscape' : 'Book tee time'
}

const btnBase: React.CSSProperties = {
  flex: '1 1 220px',
  boxSizing: 'border-box',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  minHeight: 50, padding: '0 16px', borderRadius: 12,
  fontSize: 15, fontWeight: 700,
  textDecoration: 'none', cursor: 'pointer', textAlign: 'center',
}

export function TeeTimeButtons({ bookingUrl, websiteUrl, phone, courseName, source }: Props) {
  if (!bookingUrl && !websiteUrl && !phone) return null

  return (
    <div style={{ marginTop: 20 }}>
      {(bookingUrl || websiteUrl) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {bookingUrl && (
            <a
              href={bookingUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              data-tee-time-click={source}
              data-course-name={courseName}
              style={{
                ...btnBase,
                background: '#2B6090', color: '#fff',
                boxShadow: '0 2px 8px rgba(43,96,144,.25)',
              }}
            >
              {bookingLabel(bookingUrl)}
            </a>
          )}

          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={bookingUrl
                ? { ...btnBase, background: '#fff', color: '#2B6090', border: '1.5px solid #cfdcea', fontWeight: 600 }
                : { ...btnBase, background: '#2B6090', color: '#fff' }}
            >
              Course website ↗
            </a>
          )}
        </div>
      )}

      {bookingUrl && (
        <p style={{ fontSize: 11.5, color: '#8a8a8a', textAlign: 'center', margin: '8px 0 0', lineHeight: 1.4 }}>
          Instant confirmation on Golfscape. We may earn a commission if you book.
        </p>
      )}

      {phone && (
        <a href={`tel:${phone}`} style={{
          display: 'block', textAlign: 'center', marginTop: 14,
          fontSize: 13, color: '#6a6a6a', textDecoration: 'none',
        }}>
          📞 {phone}
        </a>
      )}
    </div>
  )
}
