import type { Metadata } from 'next';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Admin dashboard for Talk with Hisham.',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto mesh-bg min-h-screen pb-12">
      <AdminDashboard />
    </div>
  );
}
