/**
 * UdyamSetu Accessibility & Hardware Motion Utilities
 */

/**
 * Checks if the user has requested reduced motion at the OS or browser level.
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Checks if the current environment is a touch device.
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};
