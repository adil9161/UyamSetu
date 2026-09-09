/**
 * UdyamSetu Global Motion Configuration
 */
import { motionTokens } from './motionTokens';
import { easing } from './easing';

export const motionConfig = {
  duration: motionTokens.duration,
  distance: motionTokens.distance,
  scale: motionTokens.scale,
  stagger: motionTokens.stagger,
  ease: easing,

  scroll: {
    smoothing: 0.1,
    scrub: 0.8,
    mobileSmoothing: 0,
  },

  magnetic: {
    maxOffset: 8, // Max 8px cursor attraction
    speed: 0.35,
    ease: easing.standard,
  },

  viewTransitions: {
    duration: motionTokens.duration.fast,
    ease: easing.premium,
  },
} as const;

export type MotionConfig = typeof motionConfig;
