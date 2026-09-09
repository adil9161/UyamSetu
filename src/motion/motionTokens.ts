/**
 * UdyamSetu Motion Design Tokens v2.0
 * Standardized constants for physical, spatial, and government-grade UI motion.
 * Axiom: "Do not make UdyamSetu look animated. Make it feel alive."
 */

export const motionTokens = {
  duration: {
    instant: 0.05,
    micro: 0.15,
    fast: 0.25,
    standard: 0.45,
    content: 0.6,
    hero: 0.9,
    cinematic: 1.1,
  },

  distance: {
    xs: 6,
    sm: 16,
    md: 28,
    lg: 44,
    xl: 64,
  },

  scale: {
    press: 0.975,
    subtle: 0.985,
    hover: 1.012,
    modalEnter: 0.98,
    full: 1.0,
  },

  stagger: {
    tight: 0.04,
    standard: 0.07,
    relaxed: 0.11,
  },

  zIndex: {
    base: 0,
    card: 10,
    pinned: 20,
    header: 40,
    modal: 50,
    progress: 100,
    cursor: 9999,
  },

  velocityThreshold: {
    fast: 1200, // px per second
    ultraFast: 2400,
  },
} as const;

export type MotionTokens = typeof motionTokens;
