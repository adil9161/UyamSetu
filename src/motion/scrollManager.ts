/**
 * UdyamSetu Scroll Manager
 * Synchronizes Lenis smooth scroll with GSAP ticker and ScrollTrigger.
 */
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, isTouchDevice } from './accessibility';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

class ScrollManager {
  private lenis: Lenis | null = null;
  private isInitialized = false;
  private tickerCallback: ((time: number) => void) | null = null;

  public init(): Lenis | null {
    if (typeof window === 'undefined') return null;
    if (this.isInitialized && this.lenis) return this.lenis;

    // If reduced motion is requested or user is on mobile/touch, skip heavy inertia
    const skipSmooth = prefersReducedMotion() || isTouchDevice();

    if (!skipSmooth) {
      this.lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
      });

      // Synchronize ScrollTrigger with Lenis
      this.lenis.on('scroll', () => {
        ScrollTrigger.update();
      });

      // Bind Lenis animation frame to GSAP ticker for 60fps frame synchronization
      this.tickerCallback = (time: number) => {
        this.lenis?.raf(time * 1000);
      };
      gsap.ticker.add(this.tickerCallback);
      gsap.ticker.lagSmoothing(0);
    }

    this.isInitialized = true;
    return this.lenis;
  }

  public getLenis(): Lenis | null {
    return this.lenis;
  }

  public scrollTo(target: string | number | HTMLElement, options?: { offset?: number; immediate?: boolean; duration?: number }): void {
    if (this.lenis) {
      this.lenis.scrollTo(target, options);
    } else if (typeof window !== 'undefined') {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' });
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' });
      }
    }
  }

  public refresh(): void {
    if (typeof window !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  public destroy(): void {
    if (this.tickerCallback) {
      gsap.ticker.remove(this.tickerCallback);
      this.tickerCallback = null;
    }
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
    this.isInitialized = false;
  }
}

export const scrollManager = new ScrollManager();
