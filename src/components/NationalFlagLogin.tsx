import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, ShieldCheck, CheckCircle2, Lock, Eye, Globe } from 'lucide-react';

interface NationalFlagLoginProps {
  onClose?: () => void;
}

export const NationalFlagLogin: React.FC<NationalFlagLoginProps> = ({ onClose }) => {
  const { login, language, setLanguage, setActiveView } = useApp();
  const [name, setName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) {
      setError(language === 'hi' ? 'कृपया मोबाइल नंबर या ईमेल दर्ज करें' : 'Please enter your mobile number or email');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      login(name.trim() || (language === 'hi' ? 'उद्यमी' : 'Entrepreneur'), phoneOrEmail.trim());
      setIsSubmitting(false);
      if (onClose) onClose();
      setActiveView('home');
    }, 600);
  };

  const handleSkip = () => {
    if (onClose) onClose();
    setActiveView('home');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAFAF7] rounded-xl max-w-md w-full shadow-2xl overflow-hidden border border-[#E2E8F0] my-8 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Tricolour Top Strip */}
        <div className="tricolour-bar-lg" />

        <div className="p-6 md:p-8">
          {/* Language Switcher on Login */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3A5F] bg-[#E2E8F0]/60 px-2.5 py-1 rounded-full">
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'भाषा:' : 'Language:'}</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded transition ${language === 'en' ? 'bg-[#1E3A5F] text-white' : 'text-[#475569] hover:text-[#0F172A]'}`}
              >
                EN
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-1.5 py-0.5 rounded transition ${language === 'hi' ? 'bg-[#1E3A5F] text-white' : 'text-[#475569] hover:text-[#0F172A]'}`}
              >
                हिंदी
              </button>
            </div>
            
            <button
              onClick={handleSkip}
              className="text-xs font-medium text-[#475569] hover:text-[#0F172A] flex items-center gap-1 transition"
            >
              {language === 'hi' ? 'बिना खाते के जारी रखें →' : 'Browse without account →'}
            </button>
          </div>

          {/* Cinematic Indian National Flag - 3:2 Aspect Ratio */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-40 sm:w-48 flag-container border border-slate-200/80 shadow-md">
              <div className="flag-cloth">
                <div className="flag-saffron" />
                <div className="flag-white">
                  {/* Ashoka Chakra with 24 spokes (SVG) */}
                  <svg
                    className="ashoka-chakra"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#000080" strokeWidth="4" />
                    <circle cx="50" cy="50" r="8" fill="#000080" />
                    {/* 24 spokes */}
                    {Array.from({ length: 24 }).map((_, i) => {
                      const angle = (i * 360) / 24;
                      return (
                        <line
                          key={i}
                          x1="50"
                          y1="50"
                          x2="50"
                          y2="8"
                          stroke="#000080"
                          strokeWidth="2.2"
                          transform={`rotate(${angle} 50 50)`}
                        />
                      );
                    })}
                  </svg>
                </div>
                <div className="flag-green" />
              </div>
              {/* Realistic cloth wave overlay */}
              <div className="flag-wave-overlay" />
            </div>

            {/* Brand Wordmark & Official Tagline */}
            <div className="text-center mt-5">
              <h1 className="text-2xl font-bold tracking-wider text-[#0F172A] font-editorial uppercase">
                U D Y A M S E T U
              </h1>
              <p className="text-xs sm:text-sm font-medium text-[#475569] mt-1.5 leading-snug">
                {language === 'hi'
                  ? 'सही योजना। सही सहयोग। सही अवसर।'
                  : 'The right scheme. The right support. The right opportunity.'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                {language === 'hi' ? 'आपका नाम (वैकल्पिक)' : 'Your Name (Optional)'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'hi' ? 'उदा. सावित्री देवी' : 'e.g. Savitri Devi'}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                {language === 'hi' ? 'मोबाइल नंबर या ईमेल *' : 'Mobile Number or Email *'}
              </label>
              <input
                type="text"
                value={phoneOrEmail}
                onChange={(e) => {
                  setPhoneOrEmail(e.target.value);
                  setError('');
                }}
                placeholder={language === 'hi' ? '+91 98765 43210' : '+91 98765 43210 or name@domain.com'}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent transition ${
                  error ? 'border-red-500 bg-red-50/50' : 'border-[#CBD5E1]'
                }`}
              />
              {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1E3A5F] hover:bg-[#162D4A] text-white font-semibold text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-200 shadow-sm cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{language === 'hi' ? 'ओटीपी / लॉगिन के साथ जारी रखें' : 'Continue to Find Schemes'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Privacy & Trust Badge */}
          <div className="mt-6 pt-4 border-t border-[#E2E8F0] space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#475569]">
              <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>
                {language === 'hi'
                  ? 'डीपीडीपी नियम 2025 के तहत पूर्ण डेटा सुरक्षा। कोई आधार/पैन संग्रहीत नहीं होता।'
                  : 'DPDP 2025 Compliant. No Aadhaar or bank account numbers stored.'}
              </span>
            </div>
            
            <p className="text-[11px] text-[#94A3B8] text-center leading-relaxed">
              {language === 'hi'
                ? 'उद्यमसेतु एक स्वतंत्र तकनीकी मंच है। यह भारत सरकार या किसी मंत्रालय का प्रतिनिधित्व नहीं करता है।'
                : 'UdyamSetu is an independent guidance platform. It is not the Government of India or any official ministry.'}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
