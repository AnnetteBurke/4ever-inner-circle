import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter, Yellowtail, Sacramento } from 'next/font/google';
import './globals.css';

/* ─────────────────────────────────────────────────────────────
   Fonts — wired up as Next.js variables, used in tailwind.config.ts
   ───────────────────────────────────────────────────────────── */

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap'
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap'
});

const yellowtail = Yellowtail({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-yellowtail',
  display: 'swap'
});

const sacramento = Sacramento({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-sacramento',
  display: 'swap'
});

/* ─────────────────────────────────────────────────────────────
   Metadata — SEO + PWA
   ───────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: '4Ever Inner Circle — A wedding experience, considered',
  description:
    'A private space for booked clients of 4Ever Photos. Quiet care, the right rhythm, your people looked after.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '4Ever Inner Circle'
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png'
  },
  openGraph: {
    title: '4Ever Inner Circle',
    description: 'A wedding experience, considered. By 4Ever Photos.',
    type: 'website'
  }
};

export const viewport: Viewport = {
  themeColor: '#FAF4F0',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${yellowtail.variable} ${sacramento.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
