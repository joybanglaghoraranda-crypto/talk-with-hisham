import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

const isStandalone = () => {
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
};

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed or dismissed
    if (isStandalone()) return;
    const wasDismissed = localStorage.getItem('twh-install-dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Android / Chrome — native install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 5000);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // iOS — show manual guide after delay
    if (isIOS()) {
      setTimeout(() => setShowIOSGuide(true), 5000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSGuide(false);
    setDismissed(true);
    localStorage.setItem('twh-install-dismissed', 'true');
  };

  // Show nothing if dismissed, already installed, or no prompt available
  if (dismissed || isStandalone()) return null;
  if (!showPrompt && !showIOSGuide) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50"
      >
        <div className="bg-neutral-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-white/30 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30">
              <Smartphone size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white mb-1">Install Talk with Hisham</h3>

              {/* Android / Chrome — direct install */}
              {showPrompt && deferredPrompt && (
                <>
                  <p className="text-xs text-white/40 leading-relaxed mb-3">
                    App হিসেবে ইন্সটল করুন! দ্রুত অ্যাক্সেস, অফলাইন সাপোর্ট এবং নোটিফিকেশন পাবেন।
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleInstall}
                      className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20"
                    >
                      <Download size={14} />
                      Install Now
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="text-xs text-white/40 hover:text-white px-3 py-2 transition-colors"
                    >
                      Not now
                    </button>
                  </div>
                </>
              )}

              {/* iOS — manual guide */}
              {showIOSGuide && !deferredPrompt && (
                <>
                  <p className="text-xs text-white/40 leading-relaxed mb-3">
                    App হিসেবে ইন্সটল করতে:
                  </p>
                  <div className="space-y-2 text-xs text-white/60">
                    <div className="flex items-center gap-2">
                      <Share size={14} className="text-orange-400 flex-shrink-0" />
                      <span>Safari-এ নিচের <strong className="text-white/80">Share</strong> বাটনে ক্লিক করুন</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download size={14} className="text-orange-400 flex-shrink-0" />
                      <span><strong className="text-white/80">"Add to Home Screen"</strong> সিলেক্ট করুন</span>
                    </div>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="text-xs text-white/40 hover:text-white mt-3 transition-colors"
                  >
                    বুঝেছি, পরে করব
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPrompt;
