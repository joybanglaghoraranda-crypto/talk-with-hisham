'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef, type ReactNode } from 'react';

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('fadeIn');
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setTransitionStage('fadeOut');
      prevPathname.current = pathname;
    }
  }, [pathname]);

  const onAnimationEnd = () => {
    if (transitionStage === 'fadeOut') {
      setDisplayChildren(children);
      setTransitionStage('fadeIn');
    }
  };

  return (
    <div
      onAnimationEnd={onAnimationEnd}
      className={transitionStage === 'fadeIn' ? 'page-enter' : 'animate-[fadeOut_0.2s_ease-in]'}
    >
      {displayChildren}
    </div>
  );
}
