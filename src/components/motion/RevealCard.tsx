/**
 * UdyamSetu RevealCard Component
 * Tactile, interactive card with subtle hover elevation, icon micro-shift (x: 0 -> 3px),
 * physical press feedback (scale: 0.975), and velocity-adapted viewport entrance.
 */
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

interface RevealCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  triggerHook?: string;
  interactive?: boolean;
}

export const RevealCard: React.FC<RevealCardProps> = ({
  children,
  className = '',
  onClick,
  direction = 'fade-up',
  delay = 0,
  duration = motionTokens.duration.standard,
  distance = motionTokens.distance.sm,
  triggerHook = 'top 88%',
  interactive = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { isReducedMotion, isTouch } = useMotion();

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (isReducedMotion) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    const adaptiveDuration = choreographyEngine.getAdaptiveDuration(duration);
    const adaptiveDistance = choreographyEngine.getAdaptiveDistance(distance);

    const initialVars: gsap.TweenVars = { opacity: 0 };
    const toVars: gsap.TweenVars = {
      opacity: 1,
      duration: adaptiveDuration,
      delay,
      ease: easing.premium,
      scrollTrigger: {
        trigger: el,
        start: triggerHook,
        toggleActions: 'play none none none',
      },
    };

    switch (direction) {
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
      case 'scale-up':
        initialVars.scale = motionTokens.scale.subtle;
        toVars.scale = 1;
        break;
      case 'none':
        break;
    }

    gsap.set(el, initialVars);
    const tween = gsap.to(el, toVars);

    return () => {
      tween.kill();
    };
  }, [direction, delay, duration, distance, triggerHook, isReducedMotion]);

  // Micro-interactions for hover & press
  const handleMouseEnter = () => {
    if (isReducedMotion || isTouch || !interactive) return;
    const el = cardRef.current;
    if (!el) return;

    gsap.to(el, {
      y: -3,
      duration: motionTokens.duration.fast,
      ease: easing.premium,
      boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
    });

    const icon = el.querySelector('.card-action-icon');
    if (icon) {
      gsap.to(icon, { x: 3, duration: motionTokens.duration.fast, ease: easing.premium });
    }
  };

  const handleMouseLeave = () => {
    if (isReducedMotion || isTouch || !interactive) return;
    const el = cardRef.current;
    if (!el) return;

    gsap.to(el, {
      y: 0,
      duration: motionTokens.duration.fast,
      ease: easing.premium,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
    });

    const icon = el.querySelector('.card-action-icon');
    if (icon) {
      gsap.to(icon, { x: 0, duration: motionTokens.duration.fast, ease: easing.premium });
    }
  };

  const handleMouseDown = () => {
    if (isReducedMotion || !interactive) return;
    const el = cardRef.current;
    if (!el) return;
    gsap.to(el, { scale: motionTokens.scale.press, duration: motionTokens.duration.micro, ease: easing.subtleOut });
  };

  const handleMouseUp = () => {
    if (isReducedMotion || !interactive) return;
    const el = cardRef.current;
    if (!el) return;
    gsap.to(el, { scale: 1, duration: motionTokens.duration.fast, ease: easing.premium });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`will-change-transform ${interactive && onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
