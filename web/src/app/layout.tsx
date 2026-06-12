import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
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
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⛳</text></svg>',
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
    <html lang="en-GB" className={`${figtree.variable} h-full`}>
      <body className="h-full antialiased">{children}</body>
    </html>
  )
}
