/**
 * UdyamSetu Motion Provider
 * Global React Context initializing Lenis smooth scrolling and GSAP plugins.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import type Lenis from 'lenis';
import { scrollManager } from './scrollManager';
import { prefersReducedMotion, isTouchDevice } from './accessibility';

interface MotionContextType {
  isReducedMotion: boolean;
  isTouch: boolean;
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; immediate?: boolean; duration?: number }) => void;
  refreshScroll: () => void;
}

const MotionContext = createContext<MotionContextType>({
  isReducedMotion: false,
  isTouch: false,
  lenis: null,
  scrollTo: () => {},
  refreshScroll: () => {},
});

export const MotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [touch, setTouch] = useState<boolean>(false);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    const isRed = prefersReducedMotion();
    const isTch = isTouchDevice();
    setReducedMotion(isRed);
    setTouch(isTch);

    const lenis = scrollManager.init();
    setLenisInstance(lenis);

    // Media query listener for prefers-reduced-motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (e.matches) {
        scrollManager.destroy();
        setLenisInstance(null);
      } else {
        const restarted = scrollManager.init();
        setLenisInstance(restarted);
      }
    };

    mediaQuery.addEventListener?.('change', handleChange);

    return () => {
      mediaQuery.removeEventListener?.('change', handleChange);
      scrollManager.destroy();
    };
  }, []);

  const scrollTo = (target: string | number | HTMLElement, options?: { offset?: number; immediate?: boolean; duration?: number }) => {
    scrollManager.scrollTo(target, options);
  };

  const refreshScroll = () => {
    scrollManager.refresh();
  };

  return (
    <MotionContext.Provider
      value={{
        isReducedMotion: reducedMotion,
        isTouch: touch,
        lenis: lenisInstance,
        scrollTo,
        refreshScroll,
      }}
    >
      {children}
    </MotionContext.Provider>
  );
};

export const useMotion = (): MotionContextType => useContext(MotionContext);
