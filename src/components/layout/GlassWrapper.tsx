import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlassWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const GlassWrapper: React.FC<GlassWrapperProps> = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default GlassWrapper;
