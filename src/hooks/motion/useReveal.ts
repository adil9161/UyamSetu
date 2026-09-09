import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { motionConfig } from '../../motion/motionConfig';
import { useReducedMotion } from './useReducedMotion';

export type RevealVariant = 'fade-up' | 'fade-down' | 'fade-in' | 'scale-up' | 'slide-right' | 'slide-left';

interface RevealOptions {
  variant?: RevealVariant;
  duration?: number;
  delay?: number;
  distance?: number;
  ease?: string;
  stagger?: number;
  triggerHook?: string; // e.g. "top 85%"
  once?: boolean;
}

export const useReveal = (
  targetRef: React.RefObject<HTMLElement | null>,
  options: RevealOptions = {}
) => {
  const isReduced = useReducedMotion();
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    if (isReduced) {
      // Instant reveal with zero animation
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    const {
      variant = 'fade-up',
      duration = motionConfig.duration.standard,
      delay = 0,
      distance = motionConfig.distance.md,
      ease = motionConfig.ease.premium,
      triggerHook = 'top 88%',
      once = true,
    } = options;

    let initialVars: gsap.TweenVars = { opacity: 0 };
    let toVars: gsap.TweenVars = { opacity: 1, duration, delay, ease };

    switch (variant) {
      case 'fade-up':
        initialVars.y = distance;
        toVars.y = 0;
        break;
      case 'fade-down':
        initialVars.y = -distance;
        toVars.y = 0;
        break;
      case 'fade-in':
        break;
      case 'scale-up':
        initialVars.scale = motionConfig.scale.subtle;
        toVars.scale = 1;
        break;
      case 'slide-right':
        initialVars.x = -distance;
        toVars.x = 0;
        break;
      case 'slide-left':
        initialVars.x = distance;
        toVars.x = 0;
        break;
    }

    toVars.scrollTrigger = {
      trigger: el,
      start: triggerHook,
      toggleActions: once ? 'play none none none' : 'play reverse play reverse',
    };

    gsap.set(el, initialVars);
    tweenRef.current = gsap.to(el, toVars);

    return () => {
      tweenRef.current?.kill();
    };
  }, [targetRef, isReduced, options.variant, options.delay, options.duration, options.distance]);

  return tweenRef;
};
