import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import Providers from './providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Talk with Hisham — Conversations, Opinions & Connection',
    template: '%s | Talk with Hisham',
  },
  description:
    'A personal portfolio and social platform by Muhibbullah Hisham — for real-time debates, communication, and intellectual discourse.',
  metadataBase: new URL('https://twhisham.vercel.app'),
  openGraph: {
    title: 'Talk with Hisham',
    description:
      'Join the conversation. A space for deep conversations, real-time opinions, and cross-platform connection.',
    type: 'website',
    siteName: 'Talk with Hisham',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talk with Hisham',
    description:
      'Join the conversation. A space for deep conversations, real-time opinions, and cross-platform connection.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'qLpGYU0kNvVtbbOh9PLKEZGndZmu3LiqbmX0orkqCFM',
  },
  keywords: [
    'Talk with Hisham',
    'Hisham',
    'Muhibbullah Hisham',
    'Conversations',
    'Opinions',
    'Connection',
    'debates',
    'intellectual discourse',
    'talkwithhisham',
    'twhisham'
  ],
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Talk with Hisham',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              'name': 'Talk with Hisham',
              'alternateName': ['Talk With Hisham', 'Hisham', 'TWH', 'talkwithhisham', 'twhisham'],
              'url': 'https://twhisham.vercel.app',
            }),
          }}
        />
      </head>
      <body className="relative min-h-screen bg-surface-0 text-white overflow-x-hidden">
        <Providers>
          <Navbar />
          <main className="relative z-10 pt-20 min-h-[85vh]">
            {children}
          </main>
          <Footer />
          <Toaster
            richColors
            position="top-right"
            theme="dark"
            toastOptions={{
              style: {
                background: 'rgba(20, 20, 20, 0.95)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
              },
            }}
          />
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
