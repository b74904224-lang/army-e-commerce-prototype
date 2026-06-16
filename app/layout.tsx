import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { getSiteUrl } from '@/lib/site-routes'
import { SiteShell } from '@/components/site-shell'
import './globals.css'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ARMYTAK | Спорядження для туризму та армії',
    template: '%s | ARMYTAK',
  },
  description:
    'ARMYTAK — каремати, спальні мішки, польові сидіння та розкладні матраци армійського класу. Доставка по Україні.',
  applicationName: 'ARMYTAK',
  generator: 'v0.app',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'ARMYTAK',
    url: siteUrl,
    title: 'ARMYTAK | Спорядження для туризму та армії',
    description:
      'Каремати, спальні мішки, польові сидіння та розкладні матраци армійського класу. Доставка по Україні.',
    locale: 'uk_UA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARMYTAK | Спорядження для туризму та армії',
    description:
      'Каремати, спальні мішки, польові сидіння та розкладні матраци армійського класу.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk" className="bg-background">
      <body className="font-sans antialiased">
        <SiteShell>{children}</SiteShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
