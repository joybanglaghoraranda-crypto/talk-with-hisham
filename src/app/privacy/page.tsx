import { ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';

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

      <div className="glass-card p-8 space-y-8 text-white/70 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
          <p className="mb-3">
            While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Profile data (when signing in via Google/GitHub)</li>
            <li>Usage Data (analytics)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Data</h2>
          <p className="mb-3">
            We use the collected data for various purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features (like Chat and Feed)</li>
            <li>To provide customer support</li>
            <li>To monitor the usage of our Service (e.g., Vercel Speed Insights)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. Third-Party Services</h2>
          <p>
            We use third-party services to facilitate our platform, including Supabase (for database and authentication), Vercel (for hosting and analytics), and OAuth providers (Google, GitHub). These third parties have access to your Personal Data only to perform these tasks on our behalf.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. Security of Data</h2>
          <p>
            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. We strive to use commercially acceptable means to protect your Personal Data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">5. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact the administrator via the platform.
          </p>
        </section>
      </div>
    </div>
  );
}
