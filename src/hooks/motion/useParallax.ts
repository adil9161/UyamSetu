import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from './useReducedMotion';

interface ParallaxOptions {
  speed?: number; // e.g. -0.2 for slower background, 0.2 for faster
  direction?: 'vertical' | 'horizontal';
  start?: string;
  end?: string;
}

export const useParallax = (
  targetRef: React.RefObject<HTMLElement | null>,
  options: ParallaxOptions = {}
) => {
  const isReduced = useReducedMotion();
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = targetRef.current;
    if (!el || isReduced) return;

    const {
      speed = -0.2,
      direction = 'vertical',
      start = 'top bottom',
      end = 'bottom top',
    } = options;

    const distance = speed * 150;
    const prop = direction === 'vertical' ? 'y' : 'x';

    tweenRef.current = gsap.fromTo(
      el,
      { [prop]: -distance },
      {
        [prop]: distance,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub: true,
        },
      }
    );

    return () => {
      tweenRef.current?.kill();
    };
  }, [targetRef, isReduced, options.speed, options.direction, options.start, options.end]);

  return tweenRef;
};
