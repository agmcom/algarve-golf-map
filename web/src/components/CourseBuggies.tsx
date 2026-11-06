import { activeOffers, BUGGY_LAST_CHECKED, type BuggyInfo } from '@/data/buggies'

export function CourseBuggies({ info, phone }: { info: BuggyInfo; phone: string | null }) {
  const offers = activeOffers(info)
  const showContact = (info.status === 'available' || info.status === 'unconfirmed') && phone

  return (
    <section id="buggies" style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#222', margin: '0 0 16px', paddingBottom: 10, borderBottom: '2px solid #ebebeb' }}>Buggies</h2>
      <p style={{ fontSize: 17, lineHeight: 1.7, color: '#333', margin: 0 }}>{info.summary}</p>

      {showContact && (
        <p style={{ fontSize: 15, color: '#333', margin: '10px 0 0' }}>
          Call the course: <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: '#2B6090', fontWeight: 600 }}>{phone}</a>
        </p>
      )}

      {info.notes && info.notes.length > 0 && (
        <p style={{ fontSize: 15, lineHeight: 1.6, color: '#555', margin: '10px 0 0' }}>{info.notes.join(' ')}</p>
      )}

      {offers.length > 0 && (
        <ul style={{ fontSize: 15, lineHeight: 1.6, color: '#333', margin: '12px 0 0', paddingLeft: 20 }}>
          {offers.map(o => <li key={o.text}>{o.text}</li>)}
        </ul>
      )}

      {info.rules && info.rules.length > 0 && (
        <>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#222', margin: '16px 0 6px' }}>Buggy rules</h3>
          <ul style={{ fontSize: 15, lineHeight: 1.6, color: '#333', margin: 0, paddingLeft: 20 }}>
            {info.rules.map(r => <li key={r}>{r}</li>)}
          </ul>
        </>
      )}

      <p style={{ fontSize: 12, lineHeight: 1.6, color: '#767676', margin: '14px 0 0' }}>
        {info.sources.length > 0 && (
          <>
            Source:{' '}
            {info.sources.map((s, i) => (
              <span key={s.url}>
                {i > 0 && ', '}
                <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" style={{ color: '#767676' }}>{s.label}</a>
              </span>
            ))}
            .{' '}
          </>
        )}
        Checked {BUGGY_LAST_CHECKED}. Prices and rules can change, so please confirm with the course before booking.
      </p>
    </section>
  )
}
