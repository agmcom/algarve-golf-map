import Link from 'next/link'

export function PartnerPrompt() {
  return (
    <p style={{ margin: '32px 0 0', paddingTop: 16, borderTop: '1px solid #ebebeb', fontSize: 14, color: '#6a6a6a' }}>
      Run a golf-related business in the Algarve?{' '}
      <Link href="/partners" style={{ color: '#2B6090', fontWeight: 600, textDecoration: 'none' }}>
        Partner with us →
      </Link>
    </p>
  )
}
