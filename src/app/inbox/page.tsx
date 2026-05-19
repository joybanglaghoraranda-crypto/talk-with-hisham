import type { Metadata } from 'next';
import MyMessages from '@/components/profile/MyMessages';

export const metadata: Metadata = {
  title: 'Inbox',
  description: 'Your private inbox — send and receive messages from Hisham.',
};

export default function InboxPage() {
  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto mesh-bg min-h-screen pb-12">
      <MyMessages />
    </div>
  );
}
