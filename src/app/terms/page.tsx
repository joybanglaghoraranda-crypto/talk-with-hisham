import { BookOpen } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service and usage guidelines for Talk with Hisham.',
};

export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20">
          <BookOpen className="text-white" size={32} />
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">Terms of Service</h1>
        <p className="text-white/40">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="glass-card p-8 space-y-8 text-white/70 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the "Talk with Hisham" platform, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. User Accounts</h2>
          <p>
            When you create an account with us (via Email, Google, or GitHub), you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. Content and Conduct</h2>
          <p className="mb-3">
            Our platform allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content that you post on or through the Service.
          </p>
          <p>
            You agree not to post content that is:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Unlawful, defamatory, or fraudulent.</li>
            <li>Offensive, hateful, or promoting discrimination.</li>
            <li>Infringing on any third party's intellectual property rights.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. Termination</h2>
          <p>
            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">5. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">6. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us via the platform or email.
          </p>
        </section>
      </div>
    </div>
  );
}
