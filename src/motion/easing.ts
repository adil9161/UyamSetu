/**
 * UdyamSetu Easing Curves v2.0
 * Curated easing curves for physical, spatial, and government-grade public service motion.
 */

export const easing = {
  // GSAP ease strings
  standard: 'power2.out',
  premium: 'power3.out',
  cinematic: 'expo.out',
  smooth: 'power1.inOut',
  subtleOut: 'sine.out',
  spring: 'elastic.out(1, 0.5)',

  // CSS cubic-bezier curves
  css: {
    // Premium major entrance curve (Apple / high-end SaaS quality)
    entrance: 'cubic-bezier(0.22, 1, 0.36, 1)',
    // Micro-interaction curve (buttons, icons, toggles)
    micro: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Standard UI ease out
    standard: 'cubic-bezier(0.25, 1, 0.5, 1)',
    // Smooth deceleration
    smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
  }
} as const;
