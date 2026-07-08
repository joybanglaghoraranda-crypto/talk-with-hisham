'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, RefreshCw, Send, CheckCircle } from 'lucide-react';

export default function SentryExamplePage() {
  const [errorStatus, setErrorStatus] = useState<'idle' | 'triggered'>('idle');

  const triggerError = () => {
    setErrorStatus('triggered');
    
    // We intentionally call an undefined function to trigger an error
    setTimeout(() => {
      try {
        // @ts-expect-error
        myUndefinedFunction();
      } catch (err) {
        // Throw it globally so Sentry captures it as an unhandled error
        setTimeout(() => {
          throw err;
        });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-rose-500/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-500">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Sentry Test Integration</h1>
            <p className="text-sm text-slate-400">Verify your Next.js error tracking setup</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Clicking the button below will intentionally execute a non-existent function (`myUndefinedFunction()`) on the client side. This will trigger a `TypeError` which Sentry will intercept and report to your dashboard.
        </p>

        <div className="space-y-4">
          <button
            onClick={triggerError}
            disabled={errorStatus === 'triggered'}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium py-3.5 px-4 rounded-xl shadow-lg shadow-rose-500/25 transition duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {errorStatus === 'triggered' ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Triggering Error...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Trigger Test Error</span>
              </>
            )}
          </button>

          {errorStatus === 'triggered' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-start space-x-3"
            >
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5 text-white">Error Triggered Successfully!</span>
                Check your Sentry Dashboard. The error `TypeError: myUndefinedFunction is not a function` should appear in your Issues list momentarily.
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
