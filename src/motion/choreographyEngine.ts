/**
 * UdyamSetu Centralized Motion Choreography Engine
 * Orchestrates entrance timelines, scroll velocity adaptation, direction tracking, and reduced-motion safety.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionTokens } from './motionTokens';
import { easing } from './easing';
import { prefersReducedMotion, isTouchDevice } from './accessibility';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export type RevealDirection =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'slide-right'
  | 'slide-left'
  | 'fade-in'
  | 'scale-up'
  | 'clip-up'
  | 'none';

export interface ChoreographySequenceItem {
  element: HTMLElement | null | (HTMLElement | null)[];
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  stagger?: number;
}

class ChoreographyEngine {
  private currentScrollDirection: 'down' | 'up' = 'down';
  private lastScrollY = 0;
  private currentVelocity = 0;
  private lastTimestamp = 0;
  private isVelocityInitialized = false;

  constructor() {
    this.initScrollTracker();
  }

  private initScrollTracker(): void {
    if (typeof window === 'undefined') return;
    if (this.isVelocityInitialized) return;

    this.lastScrollY = window.scrollY;
    this.lastTimestamp = performance.now();

    const handleScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const deltaY = currentY - this.lastScrollY;
      const deltaTime = Math.max(1, now - this.lastTimestamp);

      // Pixels per second
      this.currentVelocity = Math.abs((deltaY / deltaTime) * 1000);
      this.currentScrollDirection = deltaY >= 0 ? 'down' : 'up';

      this.lastScrollY = currentY;
      this.lastTimestamp = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    this.isVelocityInitialized = true;
  }

  /**
   * Returns whether user is scrolling fast (velocity > threshold).
   * Used to simplify/shorten animations during rapid scrolling.
   */
  public isFastScrolling(): boolean {
    return this.currentVelocity > motionTokens.velocityThreshold.fast;
  }

  public getScrollDirection(): 'down' | 'up' {
    return this.currentScrollDirection;
  }

  public getVelocity(): number {
    return this.currentVelocity;
  }

  /**
   * Adjusts duration & distance based on scroll velocity and reduced motion preference.
   */
  public getAdaptiveDuration(nominalDuration: number): number {
    if (prefersReducedMotion()) return 0.001;
    if (this.isFastScrolling()) return Math.min(nominalDuration * 0.45, 0.2);
    return nominalDuration;
  }

  public getAdaptiveDistance(nominalDistance: number): number {
    if (prefersReducedMotion()) return 0;
    if (this.isFastScrolling()) return Math.min(nominalDistance * 0.5, 12);
    if (isTouchDevice()) return Math.min(nominalDistance * 0.75, 20);
    return nominalDistance;
  }

  /**
   * Creates an intentional timeline sequence for a major section:
   * Heading -> Supporting Text -> Media / Visual -> Cards -> CTA.
   */
  public createSectionTimeline(
    triggerElement: HTMLElement,
    items: ChoreographySequenceItem[],
    options?: {
      startHook?: string;
      once?: boolean;
    }
  ): gsap.core.Timeline | null {
    if (prefersReducedMotion()) {
      items.forEach((item) => {
        if (!item.element) return;
        gsap.set(item.element, { opacity: 1, x: 0, y: 0, scale: 1, clearProps: 'transform' });
      });
      return null;
    }

    const { startHook = 'top 85%', once = true } = options || {};

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: startHook,
        toggleActions: once ? 'play none none none' : 'play reverse play reverse',
      },
    });

    items.forEach((item, index) => {
      if (!item.element) return;
      const elements = Array.isArray(item.element) ? item.element.filter(Boolean) : [item.element];
      if (elements.length === 0) return;

      const duration = this.getAdaptiveDuration(item.duration ?? motionTokens.duration.standard);
      const distance = this.getAdaptiveDistance(item.distance ?? motionTokens.distance.md);
      const dir = item.direction ?? 'fade-up';
      const itemStagger = item.stagger ?? (elements.length > 1 ? motionTokens.stagger.standard : 0);

      const initialVars: gsap.TweenVars = { opacity: 0 };
      const toVars: gsap.TweenVars = {
        opacity: 1,
        duration,
        ease: easing.premium,
        stagger: itemStagger,
      };

      switch (dir) {
        case 'fade-up':
          initialVars.y = distance;
          toVars.y = 0;
          break;
        case 'fade-down':
          initialVars.y = -distance;
          toVars.y = 0;
          break;
        case 'fade-left':
          initialVars.x = distance;
          toVars.x = 0;
          break;
        case 'fade-right':
          initialVars.x = -distance;
          toVars.x = 0;
          break;
        case 'slide-right':
          initialVars.x = -distance;
          toVars.x = 0;
          break;
        case 'slide-left':
          initialVars.x = distance;
          toVars.x = 0;
          break;
        case 'fade-in':
          break;
        case 'scale-up':
          initialVars.scale = motionTokens.scale.subtle;
          toVars.scale = 1;
          break;
        case 'clip-up':
          initialVars.clipPath = 'inset(100% 0% 0% 0%)';
          toVars.clipPath = 'inset(0% 0% 0% 0%)';
          break;
        case 'none':
          break;
      }

      gsap.set(elements, initialVars);

      const positionInTimeline = index === 0 ? 0 : `+=${item.delay ?? 0.06}`;
      tl.to(elements, toVars, positionInTimeline);
    });

    return tl;
  }
}

export const choreographyEngine = new ChoreographyEngine();
