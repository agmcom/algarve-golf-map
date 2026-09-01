const LINKS = [
  { href: '/', label: 'Golf Courses in the Algarve' },
  { href: '/algarve-9-hole-courses', label: 'Algarve 9 Hole Golf Courses' },
  { href: '/club-rental', label: 'Golf Club Rental in the Algarve' },
  { href: '/golf-resorts', label: 'Golf Resorts in the Algarve' },
  { href: '/shops', label: 'Golf Shops in the Algarve' },
  { href: '/guide', label: 'Algarve Golf Guide' },
]

export function SiteFooter() {
  return (
    <footer style={{
      borderTop: '1px solid #ebebeb',
      background: '#fafafa',
      padding: '32px 24px',
    }}>
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        <nav aria-label="Footer">
          <ul style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px 24px',
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}>
            {LINKS.map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  style={{ fontSize: 13, fontWeight: 500, color: '#6a6a6a', textDecoration: 'none' }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <span style={{ fontSize: 12, color: '#9a9a9a' }}>
          © {new Date().getFullYear()} Algarve Golf Map
        </span>
      </div>
    </footer>
  )
}
