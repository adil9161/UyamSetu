/**
 * UdyamSetu Stagger Component System
 * Orchestrates progressive sequential reveals of cards and lists (stagger: 0.06-0.12s, y: 25 -> 0, scale: 0.98 -> 1).
 */
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotion } from '../../motion/MotionProvider';
import { choreographyEngine } from '../../motion/choreographyEngine';
import { motionTokens } from '../../motion/motionTokens';
import { easing } from '../../motion/easing';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  triggerHook?: string;
  delay?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  stagger = motionTokens.stagger.standard,
  triggerHook = 'top 85%',
  delay = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isReducedMotion } = useMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const items = el.querySelectorAll('.stagger-item');
    if (!items.length) return;

    if (isReducedMotion) {
      gsap.set(items, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const adaptiveStagger = choreographyEngine.isFastScrolling()
      ? motionTokens.stagger.tight
      : stagger;
    const adaptiveDistance = choreographyEngine.getAdaptiveDistance(motionTokens.distance.sm);

    gsap.set(items, {
      opacity: 0,
      y: adaptiveDistance,
      scale: motionTokens.scale.subtle,
    });

    const tween = gsap.to(items, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: motionTokens.duration.standard,
      delay,
      stagger: adaptiveStagger,
      ease: easing.premium,
      scrollTrigger: {
        trigger: el,
        start: triggerHook,
        toggleActions: 'play none none none',
      },
    });

    return () => {
      tween.kill();
    };
  }, [stagger, triggerHook, delay, isReducedMotion]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`stagger-item will-change-transform ${className}`}>
      {children}
    </div>
  );
};
