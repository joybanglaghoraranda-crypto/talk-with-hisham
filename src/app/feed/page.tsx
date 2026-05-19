import type { Metadata } from 'next';
import PublicFeed from '@/components/feed/PublicFeed';

export const metadata: Metadata = {
  title: 'Feed',
  description: 'Public discourse and community feed — follow discussions, react, and share opinions.',
};

export default function FeedPage() {
  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto mesh-bg min-h-screen pb-4">
      <PublicFeed />
    </div>
  );
}
