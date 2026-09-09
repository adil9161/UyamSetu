import React, { useRef } from 'react';
import { useParallax } from '../../hooks/motion/useParallax';

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  className?: string;
  start?: string;
  end?: string;
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = -0.2,
  direction = 'vertical',
  className = '',
  start,
  end,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useParallax(containerRef, {
    speed,
    direction,
    start,
    end,
  });

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};
