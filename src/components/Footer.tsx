import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ExternalLink, Globe, Scale, BookOpen, AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setActiveView } = useApp();

  const handleLinkClick = (view: any) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0F172A] text-white border-t border-slate-800 mt-20">
      {/* Subtle Tricolour Divider */}
      <div className="tricolour-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded border border-slate-700 bg-white flex flex-col overflow-hidden">
                <div className="h-2 bg-[#FF9933]" />
                <div className="h-2 bg-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full border-[0.4px] border-[#000080]" />
                </div>
                <div className="h-2 bg-[#138808]" />
              </div>
              <span className="text-xl font-bold text-white font-editorial tracking-tight">
                UdyamSetu
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
              {language === 'hi'
                ? 'उद्यमसेतु भारत के वंचित उद्यमियों, महिला संस्थापकों और कारीगरों के लिए सरकारी सहायता योजनाओं की पारदर्शी पात्रता जांच और अवसर खोज मंच है।'
                : 'UdyamSetu is an AI-assisted government support discovery and deterministic eligibility platform connecting marginalized entrepreneurs, women founders, and MSMEs to verified government schemes.'}
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>DPDP Rules 2025 Privacy Compliant • WCAG 2.2 AA Public Access</span>
            </div>
          </div>

          {/* Core Portals & Official Sources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {language === 'hi' ? 'आधिकारिक स्रोत' : 'Official Data Sources'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a
                  href="https://www.myscheme.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition"
                >
                  <span>myScheme.gov.in</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.jansamarth.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition"
                >
                  <span>JanSamarth Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://msme.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition"
                >
                  <span>Ministry of MSME (KVIC/PMEGP)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmvishwakarma.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition"
                >
                  <span>PM Vishwakarma Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmsvanidhi.mohua.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition"
                >
                  <span>PM SVANidhi Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Navigation & Governance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {language === 'hi' ? 'मंच की जानकारी' : 'Platform & Governance'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => handleLinkClick('how-it-works')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  {language === 'hi' ? 'ट्रस्ट सेंटर (डेटा कैसे काम करता है)' : 'Trust Center (How It Works)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('states')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  {language === 'hi' ? 'राज्यवार योजना खोज' : 'State Explorer'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('compare')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  {language === 'hi' ? 'योजनाओं की तुलना' : 'Compare Schemes'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('admin')}
                  className="hover:text-white transition text-left cursor-pointer text-amber-300 font-semibold"
                >
                  {language === 'hi' ? 'प्रशासनिक डेटा कंसोल' : 'Admin & Governance Console'}
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Boundary & Statutory Disclaimer (Non-Negotiable) */}
        <div className="pt-8 border-t border-slate-800">
          <div className="bg-slate-900/80 rounded-lg p-4 border border-slate-800 flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-amber-300">
                {language === 'hi' ? 'महत्वपूर्ण सूचना: ' : 'Official Notice: '}
              </span>
              {language === 'hi'
                ? 'उद्यमसेतु केवल सूचना और मार्गदर्शन प्रदान करता है। अंतिम पात्रता, ऋण स्वीकृति और वित्तीय सहायता संबंधित सरकारी मंत्रालय, नोडल एजेंसी अथवा वित्तीय संस्थान द्वारा उनके आधिकारिक नियमों के अनुसार निर्धारित की जाती है।'
                : 'Information and guidance only. Final eligibility, loan approval, and benefit disbursement are strictly determined by the respective government authority, nodal ministry, or financial institution according to official guidelines.'}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>
              © {new Date().getFullYear()} UdyamSetu. Built for Smart India Hackathon 2026.
            </p>
            <p className="text-slate-400">
              {language === 'hi'
                ? 'सिद्धांत: खोजें → मिलान → समझें → सत्यापित करें → आवेदन → पुनः जांचें'
                : 'Philosophy: Discover → Match → Explain → Verify → Act → Re-check'}
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};
