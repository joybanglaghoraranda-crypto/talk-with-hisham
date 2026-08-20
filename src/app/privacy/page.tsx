import { ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';
import PrivacyContent from './PrivacyContent';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy and data practices for Talk with Hisham.',
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20">
          <ShieldCheck className="text-white" size={32} />
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">Privacy Policy</h1>
        <p className="text-white/40">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      <PrivacyContent />
    </div>
  );
}
