import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotion } from '../../motion/MotionProvider';
import { choreographyEngine, RevealDirection } from '../../motion/choreographyEngine';
import { motionTokens } from '../../motion/motionTokens';
import { easing } from '../../motion/easing';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface RevealProps {
  children: React.ReactNode;
  variant?: RevealDirection;
  duration?: number;
  delay?: number;
  distance?: number;
  className?: string;
  triggerHook?: string;
  once?: boolean;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  variant = 'fade-up',
  duration = motionTokens.duration.standard,
  delay = 0,
  distance = motionTokens.distance.md,
  className = '',
  triggerHook = 'top 88%',
  once = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isReducedMotion } = useMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (isReducedMotion) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    const adaptiveDuration = choreographyEngine.getAdaptiveDuration(duration);
    const adaptiveDistance = choreographyEngine.getAdaptiveDistance(distance);

    let initialVars: gsap.TweenVars = { opacity: 0 };
    let toVars: gsap.TweenVars = {
      opacity: 1,
      duration: adaptiveDuration,
      delay,
      ease: easing.premium,
      scrollTrigger: {
        trigger: el,
        start: triggerHook,
        toggleActions: once ? 'play none none none' : 'play reverse play reverse',
      },
    };

    switch (variant) {
      case 'fade-up':
        initialVars.y = adaptiveDistance;
        toVars.y = 0;
        break;
      case 'fade-down':
        initialVars.y = -adaptiveDistance;
        toVars.y = 0;
        break;
      case 'fade-left':
        initialVars.x = adaptiveDistance;
        toVars.x = 0;
        break;
      case 'fade-right':
        initialVars.x = -adaptiveDistance;
        toVars.x = 0;
        break;
      case 'slide-right':
        initialVars.x = -adaptiveDistance;
        toVars.x = 0;
        break;
      case 'slide-left':
        initialVars.x = adaptiveDistance;
        toVars.x = 0;
        break;
      case 'fade-in':
        break;
      case 'scale-up':
        initialVars.scale = motionTokens.scale.subtle;
        toVars.scale = 1;
        break;
      case 'clip-up':
        initialVars.clipPath = 'inset(100% 0% 0% 0%)';
        toVars.clipPath = 'inset(0% 0% 0% 0%)';
        break;
      case 'none':
        break;
    }

    gsap.set(el, initialVars);
    const tween = gsap.to(el, toVars);

    return () => {
      tween.kill();
    };
  }, [variant, delay, duration, distance, triggerHook, once, isReducedMotion]);

  return (
    <div ref={containerRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
};
