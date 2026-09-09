import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useMotion } from '../../motion/MotionProvider';
import { motionConfig } from '../../motion/motionConfig';

interface SplitTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  stagger?: number;
  delay?: number;
  duration?: number;
  triggerHook?: string;
}

export const SplitText: React.FC<SplitTextProps> = ({
  children,
  className = '',
  as: Component = 'span',
  stagger = motionConfig.stagger.standard,
  delay = 0,
  duration = motionConfig.duration.standard,
  triggerHook = 'top 85%',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const { isReducedMotion } = useMotion();

  // Split string into words
  const words = children.split(' ');

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isReducedMotion) return;

    const wordEls = el.querySelectorAll('.split-word-inner');
    if (!wordEls.length) return;

    gsap.fromTo(
      wordEls,
      { y: '100%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration,
        stagger,
        delay,
        ease: motionConfig.ease.cinematic,
        scrollTrigger: {
          trigger: el,
          start: triggerHook,
          toggleActions: 'play none none none',
        },
      }
    );

    return () => {
      gsap.killTweensOf(wordEls);
    };
  }, [children, isReducedMotion, stagger, delay, duration, triggerHook]);

  if (isReducedMotion) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component
      ref={containerRef as any}
      className={`inline-block overflow-hidden ${className}`}
      aria-label={children}
    >
      {words.map((word, idx) => (
        <span
          key={idx}
          className="inline-block overflow-hidden mr-[0.25em] align-bottom"
          aria-hidden="true"
        >
          <span className="split-word-inner inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
};
