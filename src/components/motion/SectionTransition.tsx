import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useMotion } from '../../motion/MotionProvider';
import { motionConfig } from '../../motion/motionConfig';

interface SectionTransitionProps {
  children: React.ReactNode;
  type?: 'dissolve' | 'scale-reveal' | 'spatial-rise';
  className?: string;
}

export const SectionTransition: React.FC<SectionTransitionProps> = ({
  children,
  type = 'scale-reveal',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isReducedMotion } = useMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isReducedMotion) return;

    let fromVars: gsap.TweenVars = {};
    let toVars: gsap.TweenVars = {
      ease: motionConfig.ease.cinematic,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'top 35%',
        scrub: 0.6,
      },
    };

    switch (type) {
      case 'scale-reveal':
        fromVars = { scale: 0.94, opacity: 0.7 };
        toVars = { ...toVars, scale: 1, opacity: 1 };
        break;
      case 'spatial-rise':
        fromVars = { y: 60, opacity: 0.6 };
        toVars = { ...toVars, y: 0, opacity: 1 };
        break;
      case 'dissolve':
      default:
        fromVars = { opacity: 0.3 };
        toVars = { ...toVars, opacity: 1 };
        break;
    }

    gsap.fromTo(el, fromVars, toVars);

    return () => {
      gsap.killTweensOf(el);
    };
  }, [type, isReducedMotion]);

  return (
    <div ref={containerRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
};
