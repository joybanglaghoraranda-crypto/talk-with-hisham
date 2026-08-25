'use client';

import { type ReactNode } from 'react';

export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <div className="animate-[fadeIn_0.15s_ease-out]">
      {children}
    </div>
  );
}
