import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotion } from '../../motion/MotionProvider';

interface ScrollSceneProps {
  children: (progress: number) => React.ReactNode;
  height?: string; // e.g. "300vh" for how long it stays pinned
  className?: string;
  onProgress?: (progress: number) => void;
}

export const ScrollScene: React.FC<ScrollSceneProps> = ({
  children,
  height = '300vh',
  className = '',
  onProgress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [currentProgress, setCurrentProgress] = React.useState(0);
  const { isReducedMotion, isTouch } = useMotion();

  useEffect(() => {
    const container = containerRef.current;
    const pin = pinRef.current;
    if (!container || !pin || isReducedMotion || isTouch) return;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      pin: pin,
      pinSpacing: false,
      scrub: 0.8,
      onUpdate: (self) => {
        setCurrentProgress(self.progress);
        onProgress?.(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [isReducedMotion, isTouch, onProgress]);

  if (isReducedMotion || isTouch) {
    // In reduced motion or touch, render static without pin
    return <div className={`relative ${className}`}>{children(1)}</div>;
  }

  return (
    <div ref={containerRef} style={{ height }} className={`relative ${className}`}>
      <div ref={pinRef} className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        {children(currentProgress)}
      </div>
    </div>
  );
};
