import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
})

const SITE_URL = 'https://algarvegolfmap.com'
const SITE_NAME = 'Algarve Golf Map'
const DEFAULT_DESCRIPTION =
  'Explore and compare every golf course in the Algarve on an interactive map. Filter by price, difficulty, ocean views, and facilities. Plan your perfect golf holiday in Portugal.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Algarve Golf Map — Find & Compare Golf Courses in Portugal',
    template: '%s | Algarve Golf Map',
  },
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/logo.svg',
  },
  keywords: [
    'Algarve golf courses',
    'golf Portugal',
    'golf Algarve',
    'golf holidays Portugal',
    'best golf courses Algarve',
    'Algarve golf map',
    'golf Vilamoura',
    'golf Quinta do Lago',
    'golf Vale do Lobo',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  verification: {
    other: { 'msvalidate.01': 'E48F87A8CAA873FD3D1286775E6B3C6C' },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_GB',
    url: '/',
    title: 'Algarve Golf Map — Find & Compare Golf Courses in Portugal',
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Algarve Golf Map — interactive golf course finder for Portugal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Algarve Golf Map — Find & Compare Golf Courses in Portugal',
    description: DEFAULT_DESCRIPTION,
    images: ['/og-default.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${figtree.variable}`}>
      <body className="antialiased">
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-95WX0L3Z7W"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-95WX0L3Z7W');
            `,
          }}
        />
        <Script
          id="stay22"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function (s, t, a, y, twenty, two) {
                s.Stay22 = s.Stay22 || {};
                s.Stay22.params = { lmaID: '6a2dc17dc9f8953830746ec2' };
                twenty = t.createElement(a);
                two = t.getElementsByTagName(a)[0];
                twenty.async = 1;
                twenty.src = y;
                two.parentNode.insertBefore(twenty, two);
              })(window, document, 'script', 'https://scripts.stay22.com/letmeallez.js');
            `,
          }}
        />
      </body>
    </html>
  )
}
