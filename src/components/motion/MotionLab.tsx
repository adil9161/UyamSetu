import React, { useState } from 'react';
import { useMotion } from '../../motion/MotionProvider';
import { SplitText } from './SplitText';
import { MagneticButton } from './MagneticButton';
import { Spotlight } from './Spotlight';
import { Reveal } from './Reveal';
import { Parallax } from './Parallax';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Eye,
  Smartphone,
  Laptop,
  Layers,
  Cpu
} from 'lucide-react';

export const MotionLab: React.FC = () => {
  const { isReducedMotion, isTouch, scrollTo } = useMotion();
  const { setActiveView } = useApp();
  const [pinnedStage, setPinnedStage] = useState(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1E3A5F] text-xs font-bold font-mono mb-2 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
            <span>UDYAMSETU MOTION LAB v2.0</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-editorial text-[#0F172A]">
            Spatial Motion & Cinematic Scroll Playground
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Isolated visual harness to test and tune the motion tokens, GSAP ScrollTrigger timelines, Lenis smooth scrolling, and accessibility fallbacks.
          </p>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
            {isTouch ? <Smartphone className="w-3.5 h-3.5 text-[#FF9933]" /> : <Laptop className="w-3.5 h-3.5 text-[#1E3A5F]" />}
            <span>Device: {isTouch ? 'Touch / Mobile' : 'Desktop / Pointer'}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
            <Sliders className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Reduced Motion: {isReducedMotion ? 'ACTIVE (Bypassed)' : 'OFF (Cinematic)'}</span>
          </div>
          <button
            onClick={() => setActiveView('home')}
            className="px-3 py-1.5 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#162D4A] transition font-bold"
          >
            ← Return to App
          </button>
        </div>
      </div>

      {/* Primitive 1: SplitText */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center font-mono">01</span>
          <h2 className="text-xl font-bold text-[#0F172A] font-editorial">SplitText Scroll Revealer</h2>
        </div>
        <p className="text-xs text-slate-500">
          Animates individual words smoothly upwards with staggered delays without layout shifts, preserving screen reader accessibility via <code>aria-label</code>.
        </p>

        <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
          <div className="text-2xl sm:text-4xl font-bold text-[#1E3A5F] font-editorial leading-tight">
            <SplitText stagger={0.07} duration={0.8}>
              Rules Determine Statutory Eligibility. Intelligence Personalizes. AI Guides.
            </SplitText>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Triggered automatically via ScrollTrigger when scrolled into viewport.
          </p>
        </div>
      </section>

      {/* Primitive 2: MagneticButton */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center font-mono">02</span>
          <h2 className="text-xl font-bold text-[#0F172A] font-editorial">Desktop Magnetic CTA Buttons</h2>
        </div>
        <p className="text-xs text-slate-500">
          Subtle magnetic attraction (max 8px) toward cursor on pointer devices with smooth elastic spring return. Automatically disabled on touch screens.
        </p>

        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-center gap-6">
          <MagneticButton
            onClick={() => setActiveView('match')}
            className="px-8 py-4 bg-[#1E3A5F] hover:bg-[#162D4A] text-white text-sm font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Launch Scheme Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>

          <MagneticButton
            onClick={() => setActiveView('states')}
            className="px-8 py-4 bg-white hover:bg-slate-100 text-[#0F172A] border border-slate-300 text-sm font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Indian States</span>
            <ArrowRight className="w-4 h-4 text-[#F97316]" />
          </MagneticButton>

          <MagneticButton
            onClick={() => scrollTo(0)}
            className="px-6 py-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Lenis Smooth Scroll To Top</span>
          </MagneticButton>
        </div>
      </section>

      {/* Primitive 3: Spotlight & Hover Depth */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center font-mono">03</span>
          <h2 className="text-xl font-bold text-[#0F172A] font-editorial">Spotlight Cards with Cursor Depth</h2>
        </div>
        <p className="text-xs text-slate-500">
          Subtle radial light effect tracking pointer movement across card borders, delivering modern depth without excessive glassmorphism.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Spotlight className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <span className="text-xs font-mono font-bold text-[#FF9933] bg-orange-50 px-2 py-0.5 rounded">LAYER 01</span>
            <h3 className="text-lg font-bold text-[#0F172A] font-editorial">Deterministic Rule Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Zero probabilistic hallucination. Hard statutory age, revenue, stage, and location logic evaluated deterministically.
            </p>
          </Spotlight>

          <Spotlight className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <span className="text-xs font-mono font-bold text-[#1E3A5F] bg-blue-50 px-2 py-0.5 rounded">LAYER 02</span>
            <h3 className="text-lg font-bold text-[#0F172A] font-editorial">Personalization & Ranking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multi-signal trade affinity matching tailored to tailor/artisan personas, working capital needs, and capital grant sizing.
            </p>
          </Spotlight>

          <Spotlight className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <span className="text-xs font-mono font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded">LAYER 03</span>
            <h3 className="text-lg font-bold text-[#0F172A] font-editorial">Grounded AI Advisor</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generates structured "Why this scheme" and "Next 3 Actions" strictly cited from verified ministry source documents.
            </p>
          </Spotlight>
        </div>
      </section>

      {/* Primitive 4: Directional Reveals */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center font-mono">04</span>
          <h2 className="text-xl font-bold text-[#0F172A] font-editorial">Scroll Reveal Variations</h2>
        </div>
        <p className="text-xs text-slate-500">
          Trigger-based entrance animations with custom distances, delays, and directional vectors.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Reveal variant="fade-up" delay={0.1} className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold text-[#1E3A5F] font-mono">fade-up (48px)</span>
            <p className="text-xs text-slate-600">Standard card entrance moving gently upward into view.</p>
          </Reveal>

          <Reveal variant="scale-up" delay={0.2} className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold text-[#1E3A5F] font-mono">scale-up (0.94 → 1)</span>
            <p className="text-xs text-slate-600">Scale expansion for featured schemes and highlighted actions.</p>
          </Reveal>

          <Reveal variant="slide-right" delay={0.3} className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold text-[#1E3A5F] font-mono">slide-right</span>
            <p className="text-xs text-slate-600">Horizontal slide used during wizard step advancement.</p>
          </Reveal>

          <Reveal variant="fade-in" delay={0.4} className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold text-[#1E3A5F] font-mono">fade-in</span>
            <p className="text-xs text-slate-600">Pure opacity fade for informational notes and disclaimers.</p>
          </Reveal>
        </div>
      </section>

      {/* Primitive 5: Pinned ScrollScene Simulation */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center font-mono">05</span>
          <h2 className="text-xl font-bold text-[#0F172A] font-editorial">Pinned Story Simulator (How It Works)</h2>
        </div>
        <p className="text-xs text-slate-500">
          Demonstrates how the pinned viewport transforms internal stages as the user scrolls, keeping layout stable while content advances.
        </p>

        <div className="p-6 bg-[#0F172A] text-white rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF9933]" />
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">
                Interactive Stage Selector
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setPinnedStage(s)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition ${
                    pinnedStage === s ? 'bg-[#FF9933] text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[220px] flex flex-col justify-center">
            {pinnedStage === 1 && (
              <div className="space-y-3 animate-fadeIn">
                <span className="text-xs font-mono text-[#FF9933] font-bold">STAGE 01 — CITIZEN PROFILE INTAKE</span>
                <h3 className="text-2xl font-bold font-editorial text-white">Understand Location, Persona & Needs</h3>
                <p className="text-sm text-slate-400 max-w-xl">
                  Captures normalized trade personas (e.g. Artisan, Street Vendor), residence type (Urban/Rural), business stage, and financing intent.
                </p>
                <div className="flex gap-2 pt-2">
                  <span className="text-xs font-mono px-2 py-1 bg-slate-800 rounded border border-slate-700">Artisan Tailor</span>
                  <span className="text-xs font-mono px-2 py-1 bg-slate-800 rounded border border-slate-700">Rural Uttar Pradesh</span>
                  <span className="text-xs font-mono px-2 py-1 bg-slate-800 rounded border border-slate-700">Machinery Grant</span>
                </div>
              </div>
            )}

            {pinnedStage === 2 && (
              <div className="space-y-3 animate-fadeIn">
                <span className="text-xs font-mono text-[#16A34A] font-bold">STAGE 02 — DETERMINISTIC RULE MATRIX</span>
                <h3 className="text-2xl font-bold font-editorial text-white">Strict 3-Tier Eligibility Partitioning</h3>
                <p className="text-sm text-slate-400 max-w-xl">
                  Evaluates hard statutory conditions. Categorizes schemes into ELIGIBLE, NEAR MATCH (1 condition away), or INELIGIBLE.
                </p>
                <div className="flex gap-3 pt-2">
                  <span className="text-xs font-bold px-3 py-1 bg-emerald-900/60 text-emerald-300 rounded border border-emerald-700">✓ ELIGIBLE: 8 Schemes</span>
                  <span className="text-xs font-bold px-3 py-1 bg-amber-900/60 text-amber-300 rounded border border-amber-700">⚠ NEAR MATCH: 2 Schemes</span>
                  <span className="text-xs font-bold px-3 py-1 bg-red-900/60 text-red-300 rounded border border-red-700">✕ INELIGIBLE: Filtered Out</span>
                </div>
              </div>
            )}

            {pinnedStage === 3 && (
              <div className="space-y-3 animate-fadeIn">
                <span className="text-xs font-mono text-[#38BDF8] font-bold">STAGE 03 — TRADE AFFINITY PERSONALIZATION</span>
                <h3 className="text-2xl font-bold font-editorial text-white">Multi-Signal Relevance & Ranking</h3>
                <p className="text-sm text-slate-400 max-w-xl">
                  Weights sector alignment, funding size match, and special category subsidies to elevate the top 3 highest-impact programs.
                </p>
                <div className="flex gap-2 pt-2">
                  <span className="text-xs font-mono px-3 py-1 bg-blue-900/60 text-blue-300 rounded border border-blue-700">#1 PMEGP (94/100)</span>
                  <span className="text-xs font-mono px-3 py-1 bg-blue-900/60 text-blue-300 rounded border border-blue-700">#2 PM Vishwakarma (91/100)</span>
                  <span className="text-xs font-mono px-3 py-1 bg-blue-900/60 text-blue-300 rounded border border-blue-700">#3 Mudra Kishor (88/100)</span>
                </div>
              </div>
            )}

            {pinnedStage === 4 && (
              <div className="space-y-3 animate-fadeIn">
                <span className="text-xs font-mono text-[#A78BFA] font-bold">STAGE 04 — GROUNDED EXPLANATION & ACTION</span>
                <h3 className="text-2xl font-bold font-editorial text-white">Plain-Language Guidance & Next 3 Steps</h3>
                <p className="text-sm text-slate-400 max-w-xl">
                  AI advisor explains exactly why the scheme matches with official gazette citations and provides a practical application checklist.
                </p>
                <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-xs text-slate-300 space-y-1">
                  <p>1. Prepare Aadhaar + Project DPR for 35% Rural Subsidy.</p>
                  <p>2. Complete free Udyam registration at udyamregistration.gov.in.</p>
                  <p>3. Submit digital application directly to KVIC portal.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Primitive 6: Parallax Background Depth */}
      <section className="space-y-4 pb-8">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center font-mono">06</span>
          <h2 className="text-xl font-bold text-[#0F172A] font-editorial">Parallax Spatial Depth</h2>
        </div>
        <p className="text-xs text-slate-500">
          Scroll-driven velocity offsets for layered visual richness without interfering with reading ergonomics.
        </p>

        <div className="relative h-48 bg-gradient-to-r from-slate-900 to-[#1E3A5F] rounded-2xl overflow-hidden flex items-center justify-center text-white border border-slate-800">
          <Parallax speed={-0.3} className="absolute inset-0 flex items-center justify-center opacity-15 text-8xl font-black font-editorial pointer-events-none select-none">
            UDYAMSETU
          </Parallax>
          <div className="relative z-10 text-center space-y-1">
            <span className="text-xs font-mono text-[#FF9933] font-bold">SPATIAL PARALLAX ACTIVE</span>
            <h4 className="text-xl font-bold font-editorial">Continuous Smooth Scrubbing via GSAP Ticker</h4>
          </div>
        </div>
      </section>
    </div>
  );
};
