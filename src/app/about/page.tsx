import type { Metadata } from 'next';
import About from '@/components/home/About';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Muhibbullah Hisham — educator, researcher, and lifelong learner bridging Islamic scholarship with modern thought.',
};

export default function AboutPage() {
  return <About />;
}
