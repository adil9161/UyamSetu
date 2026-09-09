import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

interface ScrollProgressOptions {
  start?: string;
  end?: string;
  onUpdate?: (progress: number) => void;
  cssVariable?: string; // Automatically update a CSS variable on the element without React re-render
}

export const useScrollProgress = (
  targetRef: React.RefObject<HTMLElement | null>,
  options: ScrollProgressOptions = {}
) => {
  const isReduced = useReducedMotion();
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const el = targetRef.current;
    if (!el || isReduced) return;

    triggerRef.current = ScrollTrigger.create({
      trigger: el,
      start: options.start || 'top bottom',
      end: options.end || 'bottom top',
      onUpdate: (self) => {
        if (options.cssVariable) {
          el.style.setProperty(options.cssVariable, self.progress.toFixed(4));
        }
        if (options.onUpdate) {
          options.onUpdate(self.progress);
        }
      },
    });

    return () => {
      triggerRef.current?.kill();
    };
  }, [targetRef, isReduced, options.start, options.end, options.cssVariable]);

  return triggerRef;
};
