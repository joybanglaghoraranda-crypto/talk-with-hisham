'use client';

import { useEffect } from 'react';

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  }
}

export default function PwaRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // Register the service worker
    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        // Force update check so v2 cache takes effect quickly
        await reg.update();
      } catch (err) {
        console.error('Service worker registration failed:', err);
      }
    };
    register();

    // Track install prompt availability
    let deferredPrompt: BeforeInstallPromptEvent | null = null;
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  return null;
}
