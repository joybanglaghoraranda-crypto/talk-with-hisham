'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 mesh-bg">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="text-8xl md:text-9xl font-heading font-bold gradient-text mb-4"
      >
        404
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-white/35 text-lg mb-8"
      >
        This page doesn&apos;t exist
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link
          href="/"
          className="bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all"
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
}
