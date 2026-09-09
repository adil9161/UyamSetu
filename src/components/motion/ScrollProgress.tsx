/**
 * UdyamSetu Scroll Progress Indicator
 * Subtle, non-distracting top reading progress bar communicating service journey.
 */
import React, { useEffect, useState } from 'react';
import { useMotion } from '../../motion/MotionProvider';

export const ScrollProgress: React.FC = () => {
  const { isReducedMotion } = useMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isReducedMotion) return;

    let ticking = false;

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        const scrolled = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setProgress(scrolled);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isReducedMotion]);

  if (isReducedMotion || progress <= 0.5) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#FF9933] via-[#1E3A5F] to-[#138808] transition-transform duration-75 ease-out origin-left will-change-transform"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
};
