import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  FileCheck,
  Scale,
  Bot,
  Database,
  Users,
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const TrustCenterView: React.FC = () => {
  const { setActiveView, language } = useApp();

  const trustPillars = [
    {
      icon: Database,
      title: 'Where Scheme Information Comes From',
      titleHi: 'योजना की जानकारी कहाँ से आती है?',
      desc: 'We source data exclusively from Tier 1 official government portals (myScheme, JanSamarth, Ministry of MSME, KVIC, PM Vishwakarma, MoHUA). Every scheme carries a verifiable canonical URL and last-verified timestamp.',
      badge: 'Official Source Provenance'
    },
    {
      icon: Scale,
      title: 'How Eligibility is Calculated (Deterministic Rules)',
      titleHi: 'पात्रता की गणना कैसे की जाती है? (कठोर नियम)',
      desc: 'Eligibility is calculated strictly through deterministic, human-approved programmatic rule engines. We NEVER allow an LLM or probabilistic AI to decide whether an entrepreneur qualifies for a government scheme.',
      badge: 'Zero AI Hallucinations'
    },
    {
      icon: Bot,
      title: 'How AI is Used (Explanation Layer Only)',
      titleHi: 'एआई का उपयोग कैसे किया जाता है?',
      desc: 'AI is utilized solely to translate complex government circulars into plain language, generate personalized match reasons, identify missing requirements, and power natural language search.',
      badge: 'Explainability & RAG'
    },
    {
      icon: AlertTriangle,
      title: 'What AI Cannot Do',
      titleHi: 'एआई क्या नहीं कर सकता?',
      desc: 'AI cannot guarantee government loan sanctions, cannot override formal guidelines, cannot represent the Government of India, and cannot process actual bank disbursements.',
      badge: 'Strict Legal Boundary'
    },
    {
      icon: Lock,
      title: 'DPDP Rules 2025 Privacy Compliance',
      titleHi: 'डीपीडीपी 2025 गोपनीयता अनुपालन',
      desc: 'We operate on data minimization. We do not collect or store sensitive identifiers like Aadhaar numbers, PAN cards, or bank credentials. Self-declared profile attributes are used solely for matching.',
      badge: 'Privacy By Design'
    },
    {
      icon: Users,
      title: 'Human-in-the-Loop Governance & Corrections',
      titleHi: 'मानव समीक्षा व डेटा सुधार प्रणाली',
      desc: 'Every scheme record undergoes human review prior to publication. Users can report inaccuracies via the "Report an Issue" mechanism, sending alerts directly to our data review queue.',
      badge: 'Living Data Platform'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      
      {/* Hero Banner */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 sm:p-10 relative overflow-hidden text-center sm:text-left">
        <div className="absolute top-0 left-0 right-0 tricolour-bar" />

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Official Trust & Governance Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] font-editorial leading-tight">
            {language === 'hi' ? 'उद्यमसेतु कैसे काम करता है (ट्रस्ट सेंटर)' : 'How UdyamSetu Works: The Trust Center'}
          </h1>

          <p className="text-sm text-[#475569] mt-3 leading-relaxed">
            {language === 'hi'
              ? 'एआई सरकारी योजनाओं की व्याख्या करता है। यह सरकारी योजनाओं का आविष्कार नहीं करता।'
              : 'AI explains government schemes. It does not invent government schemes. Learn how our deterministic eligibility engine, source provenance, and human-in-the-loop governance safeguard data integrity.'}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveView('match')}
              className="px-5 py-2.5 bg-[#1E3A5F] hover:bg-[#162D4A] text-white text-xs font-bold rounded-lg transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Test Matching Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold rounded-lg transition"
            >
              View Admin Data Console →
            </button>
          </div>
        </div>
      </div>

      {/* Six Pillars of Data Integrity */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#0F172A] font-editorial">
          {language === 'hi' ? 'डेटा विश्वसनीयता के 6 मूलभूत सिद्धांत' : 'The 6 Pillars of Data Trust on UdyamSetu'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trustPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-xs space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#1E3A5F]/5 text-[#1E3A5F] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0F172A] font-editorial">
                  {language === 'hi' ? pillar.titleHi : pillar.title}
                </h3>

                <p className="text-xs text-[#475569] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust States Visual Guide */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-[#0F172A] font-editorial">
          {language === 'hi' ? 'योजना डेटा ट्रस्ट स्थितियां (Trust States)' : 'Our 4 Public Data Trust States'}
        </h2>
        <p className="text-xs text-[#475569]">
          Every piece of scheme data on UdyamSetu carries an explicit trust state so users always know the freshness and verification level of the information.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          <div className="p-4 rounded-lg bg-emerald-50 border-l-4 border-l-[#F97316] border border-emerald-200">
            <span className="text-xs font-bold text-emerald-950 block">🟢 VERIFIED</span>
            <p className="text-[11px] text-emerald-800 mt-1">
              Human-approved against official gazette notification within the freshness cycle.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-amber-50 border-l-4 border-l-amber-500 border border-amber-200">
            <span className="text-xs font-bold text-amber-950 block">🟡 STALE / PENDING</span>
            <p className="text-[11px] text-amber-800 mt-1">
              Data exceeds freshness threshold; marked with a notice to verify with official source.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-red-50 border-l-4 border-l-red-500 border border-red-200">
            <span className="text-xs font-bold text-red-950 block">🔴 FLAGGED</span>
            <p className="text-[11px] text-red-800 mt-1">
              User or monitoring system flagged a guideline change; undergoing re-verification.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border-l-4 border-l-slate-400 border border-slate-200">
            <span className="text-xs font-bold text-slate-900 block">⚪ DEPRECATED</span>
            <p className="text-[11px] text-slate-700 mt-1">
              Historical record retained for audit purposes; official intake closed.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
