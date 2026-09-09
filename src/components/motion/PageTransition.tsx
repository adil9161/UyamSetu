/**
 * UdyamSetu PageTransition Component
 * Seamless, spatial view transition wrapper providing Apple-quality continuity between portal routes.
 */
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useMotion } from '../../motion/MotionProvider';
import { motionTokens } from '../../motion/motionTokens';
import { easing } from '../../motion/easing';

interface PageTransitionProps {
  children: React.ReactNode;
  viewKey: string;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  viewKey,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isReducedMotion } = useMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (isReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      el,
      { opacity: 0, y: motionTokens.distance.xs },
      {
        opacity: 1,
        y: 0,
        duration: motionTokens.duration.fast,
        ease: easing.premium,
        clearProps: 'transform',
      }
    );
  }, [viewKey, isReducedMotion]);

  return (
    <div ref={containerRef} className={`w-full will-change-transform ${className}`}>
      {children}
    </div>
  );
};
