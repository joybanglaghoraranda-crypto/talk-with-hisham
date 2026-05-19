import type { Metadata } from 'next';
import ProfilePage from '@/components/profile/ProfilePage';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Your personal profile on Talk with Hisham.',
};

export default function Profile() {
  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto mesh-bg min-h-screen pb-12">
      <ProfilePage />
    </div>
  );
}
