import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import Providers from './providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileTabBar from '@/components/layout/MobileTabBar';
import { SpeedInsights } from '@vercel/speed-insights/next';
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
    'Muhib',
    'Muhibbullah',
    'Akondo',
    'Akhund',
    'মুহিব্বুল্লাহ হিশাম',
    'মুহিব্বুল্লাহ',
    'হিশাম',
    'মুহিব',
    'আকন্দ',
    'আখন্দ',
    'Lover of Allah',
    'Generous',
    'Noble',
    'আল্লাহর প্রেমিক',
    'আল্লাহর প্রিয়পাত্র',
    'উদার',
    'মহানুভব',
    'Alia madrasa',
    'Qawmi madrasa',
    'Dawra-e-Hadith',
    'As-Sunnah Dawah & Research Institute',
    'As-Sunnah Dawah',
    'As-Sunnah',
    'Islamic Dawah',
    'Hafiz',
    'Memorization of the Qur\'an',
    'আলিয়া মাদ্রাসা',
    'আলিয়া মাদরাসা',
    'কওমি মাদ্রাসা',
    'কওমী মাদ্রাসা',
    'কওমি মাদরাসা',
    'দাওরায়ে হাদিস',
    'দাওরায়ে হাদীস',
    'দাওরা হাদীস',
    'আস-সুন্নাহ দাওয়াহ এন্ড রিসার্চ ইনস্টিটিউট',
    'আস-সুন্নাহ দাওয়াহ',
    'আস-সুন্নাহ',
    'ইসলামিক দাওয়াহ',
    'হাফেজে কুরআন',
    'হাফেজ',
    'কুরআন মুখস্থ',
    'Dhaka',
    'Mymensingh',
    'Jamalpur',
    'ঢাকা',
    'ময়মনসিংহ',
    'জামালপুর',
    'Conversations',
    'Opinions',
    'Connection',
    'debates',
    'intellectual discourse',
    'talkwithhisham',
    'twhisham',
    'hisham.vercel.app',
    'twhisham.vercel.app'
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
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                'name': 'Talk with Hisham',
                'alternateName': [
                  'Talk With Hisham',
                  'Hisham',
                  'TWH',
                  'talkwithhisham',
                  'twhisham',
                  'Muhibbullah Hisham',
                  'মুহিব্বুল্লাহ হিশাম',
                  'Muhib',
                  'Akondo',
                  'Akhund',
                  'মুহিব',
                  'আকন্দ',
                  'আখন্দ'
                ],
                'url': 'https://twhisham.vercel.app',
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Person',
                'name': 'Muhibbullah Hisham',
                'alternateName': [
                  'Muhib',
                  'Muhibbullah',
                  'Hisham',
                  'Akondo',
                  'Akhund',
                  'মুহিব্বুল্লাহ হিশাম',
                  'মুহিব্বুল্লাহ',
                  'হিশাম',
                  'মুহিব',
                  'আকন্দ',
                  'আখন্দ'
                ],
                'description': 'Educator, researcher, and lifelong learner integrating classical Islamic scholarship with modern thought.',
                'url': 'https://twhisham.vercel.app',
                'birthPlace': {
                  '@type': 'Place',
                  'name': 'Mymensingh, Bangladesh',
                },
                'homeLocation': {
                  '@type': 'Place',
                  'name': 'Dhaka, Bangladesh',
                },
                'alumniOf': [
                  {
                    '@type': 'EducationalOrganization',
                    'name': 'Alia madrasa',
                  },
                  {
                    '@type': 'EducationalOrganization',
                    'name': 'Qawmi madrasa',
                  },
                  {
                    '@type': 'EducationalOrganization',
                    'name': 'As-Sunnah Dawah & Research Institute',
                  }
                ],
                'jobTitle': ['Instructor', 'Educator', 'Assistant Researcher'],
              }
            ]),
          }}
        />
      </head>
      <body className="relative min-h-screen bg-surface-0 text-white overflow-x-hidden">
        <Providers>
          <Navbar />
          <main className="relative z-10 pt-20 pb-20 md:pb-0 min-h-[85vh]">
            {children}
          </main>
          <Footer />
          <MobileTabBar />
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
      </body>
    </html>
  );
}
