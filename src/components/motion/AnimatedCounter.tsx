/**
 * UdyamSetu Animated Counter
 * High-performance, ease-out numeric and percentage counter for statistics and match scores.
 */
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotion } from '../../motion/MotionProvider';
import { easing } from '../../motion/easing';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (val: number) => string;
  className?: string;
  triggerHook?: string;
  delay?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1.2,
  prefix = '',
  suffix = '',
  formatter,
  className = '',
  triggerHook = 'top 88%',
  delay = 0,
}) => {
  const { isReducedMotion } = useMotion();
  const elementRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState<number>(isReducedMotion ? value : 0);

  useEffect(() => {
    if (isReducedMotion) {
      setDisplayValue(value);
      return;
    }

    const el = elementRef.current;
    if (!el) return;

    const counterObj = { count: 0 };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: triggerHook,
      once: true,
      onEnter: () => {
        gsap.to(counterObj, {
          count: value,
          duration,
          delay,
          ease: easing.premium,
          onUpdate: () => {
            setDisplayValue(Math.floor(counterObj.count));
          },
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [value, duration, delay, triggerHook, isReducedMotion]);

  const formattedNumber = formatter
    ? formatter(displayValue)
    : displayValue.toLocaleString('en-IN');

  return (
    <span ref={elementRef} className={`font-mono tabular-nums will-change-transform ${className}`}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};
