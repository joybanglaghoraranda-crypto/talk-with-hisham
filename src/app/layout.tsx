import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import Providers from './providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileTabBar from '@/components/layout/MobileTabBar';
import ReadingProgress from '@/components/layout/ReadingProgress';
import BackToTop from '@/components/layout/BackToTop';
import PwaRegister from '@/components/layout/PwaRegister';
import PageTransition from '@/components/layout/PageTransition';
import LanguageInit from '@/components/layout/LanguageInit';
import ParticleBackground from '@/components/layout/ParticleBackground';
import CommandPalette from '@/components/layout/CommandPalette';
import AiAssistantModal from '@/components/widgets/AiAssistantModal';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { Sora, Inter, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

// Self-hosted variable fonts (no build-time fetch from Google)
const sora = localFont({
  src: './fonts/sora-latin.woff2',
  variable: '--font-heading',
  display: 'swap',
  weight: '100 800',
});

const inter = localFont({
  src: './fonts/inter-latin.woff2',
  variable: '--font-sans',
  display: 'swap',
  weight: '100 900',
});

const jetbrainsMono = localFont({
  src: './fonts/jetbrains-mono-latin.woff2',
  variable: '--font-mono',
  display: 'swap',
  weight: '100 800',
});

export const metadata: Metadata = {
  title: {
    default: 'Muhibbullah Hisham — Educator, Researcher & Mentor',
    template: '%s | Muhibbullah Hisham',
  },
  description:
    'Official site of Muhibbullah Hisham — educator, researcher, and mentor bridging classical Islamic scholarship with modern education, curriculum development, and youth mentoring.',
  metadataBase: new URL('https://twhisham.vercel.app'),
  openGraph: {
    title: 'Muhibbullah Hisham — Educator, Researcher & Mentor',
    description:
      'Educator and researcher bridging classical Islamic scholarship with modern education. Teaching, research, curriculum development, and youth mentoring.',
    type: 'website',
    siteName: 'Muhibbullah Hisham',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Talk with Hisham — Muhibbullah Hisham',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhibbullah Hisham — Educator, Researcher & Mentor',
    description:
      'Educator and researcher bridging classical Islamic scholarship with modern education. Teaching, research, curriculum development, and youth mentoring.',
    images: ['/api/og'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
    'apple-mobile-web-app-title': 'Muhibbullah Hisham',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
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
            ]).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body className="relative min-h-screen bg-surface-0 text-white overflow-x-hidden font-sans">
        <Providers>
          <LanguageInit />
          <ParticleBackground />
          <ReadingProgress />
          <Navbar />
          <main className="relative z-10 pt-20 pb-20 md:pb-0 min-h-[85vh]">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <MobileTabBar />
          <BackToTop />
          <PwaRegister />
          <CommandPalette />
          <AiAssistantModal />
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
