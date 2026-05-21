import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProfileSettings from '@/components/profile/ProfileSettings';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your profile settings on Talk with Hisham.',
};

export default function SettingsPage() {
  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto mesh-bg min-h-screen pb-12">
      <Suspense fallback={<div className="text-white/40 text-center py-12">Loading settings...</div>}>
        <ProfileSettings />
      </Suspense>
    </div>
  );
}
