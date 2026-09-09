/**
 * UdyamSetu Motion Variants
 * Presets and variant definitions for reveals, cards, modals, and directional choreography.
 */
import { motionTokens } from './motionTokens';
import { easing } from './easing';

export const motionVariants = {
  reveal: {
    fromLeft: {
      initial: { opacity: 0, x: -motionTokens.distance.md },
      animate: { opacity: 1, x: 0 },
      transition: { duration: motionTokens.duration.standard, ease: easing.premium },
    },
    fromRight: {
      initial: { opacity: 0, x: motionTokens.distance.md },
      animate: { opacity: 1, x: 0 },
      transition: { duration: motionTokens.duration.standard, ease: easing.premium },
    },
    fromBottom: {
      initial: { opacity: 0, y: motionTokens.distance.md },
      animate: { opacity: 1, y: 0 },
      transition: { duration: motionTokens.duration.standard, ease: easing.premium },
    },
    scale: {
      initial: { opacity: 0, scale: motionTokens.scale.subtle },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: motionTokens.duration.standard, ease: easing.premium },
    },
  },

  card: {
    rest: { y: 0, scale: 1, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
    hover: { y: -3, scale: motionTokens.scale.hover, boxShadow: '0 8px 16px -4px rgba(15, 23, 42, 0.08)' },
    press: { y: -1, scale: motionTokens.scale.press },
  },

  modal: {
    backdrop: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: motionTokens.duration.fast },
    },
    container: {
      initial: { opacity: 0, scale: motionTokens.scale.modalEnter, y: motionTokens.distance.sm },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: motionTokens.scale.modalEnter, y: motionTokens.distance.sm },
      transition: { duration: motionTokens.duration.standard, ease: easing.premium },
    },
  },

  wizard: {
    nextEnter: { x: motionTokens.distance.md, opacity: 0 },
    nextExit: { x: -motionTokens.distance.md, opacity: 0 },
    backEnter: { x: -motionTokens.distance.md, opacity: 0 },
    backExit: { x: motionTokens.distance.md, opacity: 0 },
    center: { x: 0, opacity: 1 },
  },
} as const;
