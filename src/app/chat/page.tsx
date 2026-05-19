import type { Metadata } from 'next';
import LiveChatRoom from '@/components/chat/LiveChatRoom';

export const metadata: Metadata = {
  title: 'Chat',
  description: 'Real-time general debate — join the live conversation with the community.',
};

export default function ChatPage() {
  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto mesh-bg min-h-screen pb-4">
      <LiveChatRoom />
    </div>
  );
}
