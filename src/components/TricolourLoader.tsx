import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

interface TricolourLoaderProps {
  onComplete: () => void;
}

export const TricolourLoader: React.FC<TricolourLoaderProps> = ({ onComplete }) => {
  const { language } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      titleEn: 'Analyzing entrepreneur profile & location parameters...',
      titleHi: 'उद्यमी प्रोफाइल और स्थान मापदंडों का विश्लेषण...',
      colorDot: 'bg-[#FF9933]', // Saffron
      badge: 'Profile Analysis'
    },
    {
      titleEn: 'Evaluating deterministic hard eligibility rules...',
      titleHi: 'कठोर पात्रता नियमों का मूल्यांकन...',
      colorDot: 'bg-slate-300', // White / Silver
      badge: 'Deterministic Rules'
    },
    {
      titleEn: 'Calculating multi-factor relevance scores (0–100)...',
      titleHi: 'प्रासंगिकता स्कोर की गणना...',
      colorDot: 'bg-[#138808]', // Green
      badge: 'Relevance Engine'
    },
    {
      titleEn: 'Verifying official government source provenance...',
      titleHi: 'आधिकारिक सरकारी स्रोतों का सत्यापन...',
      colorDot: 'bg-[#FF9933]', // Saffron
      badge: 'Trust Engine'
    },
    {
      titleEn: 'Generating personalized explainability & gap analysis...',
      titleHi: 'व्यक्तिगत स्पष्टीकरण और पात्रता अंतर विश्लेषण...',
      colorDot: 'bg-[#138808]', // Green
      badge: 'Explainable AI'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 400);
          return prev;
        }
      });
    }, 650);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-lg border border-[#E2E8F0] p-6 sm:p-8 overflow-hidden relative">
        
        {/* Tricolour Top Accent */}
        <div className="absolute top-0 left-0 right-0 tricolour-bar" />

        <div className="text-center mb-8 pt-2">
          <div className="inline-flex p-3 rounded-full bg-[#1E3A5F]/5 text-[#1E3A5F] mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] font-editorial">
            {language === 'hi' ? 'आपकी योजनाओं का मिलान हो रहा है' : 'Matching Government Support'}
          </h2>
          <p className="text-xs text-[#475569] mt-1">
            {language === 'hi'
              ? 'उद्यमसेतु का निष्पक्ष पात्रता इंजन सक्रिय है'
              : 'Deterministic rule evaluation in progress • Zero hallucinations'}
          </p>
        </div>

        {/* 5-Step Tricolour Sequence */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isFinished = index < currentStep;
            const isActive = index === currentStep;

            return (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 ${
                  isActive
                    ? 'bg-slate-50 border-[#1E3A5F]/30 shadow-xs translate-x-1'
                    : isFinished
                    ? 'bg-white border-[#E2E8F0] opacity-80'
                    : 'bg-white/40 border-transparent opacity-40'
                }`}
              >
                <div className="mt-0.5 shrink-0 flex items-center justify-center">
                  {isFinished ? (
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  ) : isActive ? (
                    <div className="relative flex items-center justify-center">
                      <span className={`w-3.5 h-3.5 rounded-full ${step.colorDot} animate-ping absolute opacity-75`} />
                      <span className={`w-3.5 h-3.5 rounded-full ${step.colorDot}`} />
                    </div>
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-semibold ${isActive ? 'text-[#0F172A]' : isFinished ? 'text-[#475569]' : 'text-slate-400'}`}>
                      {language === 'hi' ? step.titleHi : step.titleEn}
                    </p>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0 ml-2">
                      {step.badge}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-8 pt-4 border-t border-[#E2E8F0]">
          <div className="flex justify-between items-center text-[11px] font-mono text-[#475569] mb-1.5">
            <span>{language === 'hi' ? 'प्रगति' : 'Engine Progress'}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF9933] via-[#1E3A5F] to-[#138808] transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
