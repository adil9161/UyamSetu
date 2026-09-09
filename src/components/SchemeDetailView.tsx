import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VERIFIED_SCHEMES, Scheme } from '../data/schemes';
import schemeFaqsRaw from '../data/scheme_faqs.json';
import { TrustBadge } from './TrustBadge';
import { ReportIssueModal } from './ReportIssueModal';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Scale,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building,
  FileText,
  DollarSign,
  Users,
  ShieldCheck,
  Flag,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { SharedElement } from './motion/SharedElement';
import { AnimatedCounter } from './motion/AnimatedCounter';
import { Reveal } from './motion/Reveal';

export const SchemeDetailView: React.FC = () => {
  const {
    selectedSchemeSlug,
    setActiveView,
    userProfile,
    saveScheme,
    savedApplications,
    toggleCompareScheme,
    comparedSchemeIds,
    language
  } = useApp();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [completedDocs, setCompletedDocs] = useState<string[]>(['doc-1', 'doc-aadhaar']);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const scheme = VERIFIED_SCHEMES.find((s) => s.slug === selectedSchemeSlug) || VERIFIED_SCHEMES[0];

  const isSaved = savedApplications.some((a) => a.schemeId === scheme.id);
  const isCompared = comparedSchemeIds.includes(scheme.id);

  // Get FAQs from scheme or scheme_faqs.json mapping
  const faqsMap = schemeFaqsRaw as Record<string, { question: string; answer: string }[]>;
  const schemeFaqs: { question: string; answer: string }[] = scheme.faqs || faqsMap[scheme.slug] || [
    {
      question: `Who is eligible for ${scheme.name}?`,
      answer: `Applicants meeting the age criteria (${scheme.min_age || 18}+ years) and belonging to target sectors (${scheme.business_types.slice(0, 3).join(', ')}) with required KYC documents are eligible to apply.`
    },
    {
      question: "Is there any collateral requirement?",
      answer: "Most micro and small enterprise loans under this category are covered by government credit guarantees or margin money subsidies without third-party collateral."
    },
    {
      question: "How is the subsidy or loan disbursed?",
      answer: "Direct Benefit Transfer (DBT) directly into the applicant's Aadhaar-linked savings or business loan bank account following nodal verification."
    }
  ];

  const toggleDoc = (docId: string) => {
    if (completedDocs.includes(docId)) {
      setCompletedDocs(completedDocs.filter((id) => id !== docId));
    } else {
      setCompletedDocs([...completedDocs, docId]);
    }
  };

  const totalDocs = Math.max(1, scheme.documents_required.length);
  const readinessPercent = Math.round((completedDocs.length / totalDocs) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Top Breadcrumb & Controls */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => setActiveView('results')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3A5F] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? '← परिणामों पर वापस जाएं' : '← Back to Match Results'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => saveScheme(scheme)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
              isSaved
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-[#16A34A]" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'Saved to Applications' : 'Save Scheme'}</span>
          </button>

          <button
            onClick={() => toggleCompareScheme(scheme.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
              isCompared
                ? 'bg-blue-50 text-[#1E3A5F] border-blue-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>
        </div>
      </div>

      {/* Main Scheme Hero Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 mb-8 relative overflow-hidden">
        
        {/* Tricolour Accent Line on top of scheme card */}
        <div className="absolute top-0 left-0 right-0 tricolour-bar" />

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
              scheme.level === 'central' ? 'bg-[#1E3A5F] text-white' : 'bg-[#F97316] text-white'
            }`}
          >
            {scheme.level === 'central' ? 'CENTRAL SCHEME' : scheme.state_name ? `STATE SCHEME — ${scheme.state_name.toUpperCase()}` : 'STATE SCHEME'}
          </span>
          <span className="text-xs font-mono text-slate-500">{scheme.code}</span>
        </div>

        <SharedElement id={`scheme-title-${scheme.id}`}>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-editorial leading-tight">
            {language === 'hi' ? scheme.name_hi : scheme.name}
          </h1>
        </SharedElement>

        <div className="flex items-center gap-2 text-xs text-[#475569] mt-2">
          <Building className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{scheme.ministry || scheme.department}</span>
        </div>

        {/* Personalized Match Callout */}
        <div className="mt-6 p-4 rounded-lg bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-emerald-950">
              {language === 'hi'
                ? '✅ आपकी प्रोफाइल के अनुसार पात्रता पुष्टि'
                : '✅ Verified Opportunity for your Entrepreneur Profile'}
            </p>
            <p className="text-xs text-emerald-900 mt-0.5 leading-relaxed">
              {language === 'hi'
                ? `यह योजना आपके क्षेत्र (${userProfile.business_type}), राज्य (${userProfile.location_state}) और श्रेणी (${userProfile.social_category}) के लिए लागू होती है।`
                : `This scheme aligns with your sector (${userProfile.business_type}), location (${userProfile.location_state}), and profile attributes.`}
            </p>
          </div>
        </div>

        {/* Official Source Banner with Saffron Accent */}
        <div className="mt-6">
          <TrustBadge
            trustState={scheme.trust_state}
            sourceName={scheme.source_name}
            sourceUrl={scheme.source_url}
            lastVerifiedAt={scheme.last_verified_at}
          />
        </div>
      </div>

      {/* Grid: Scheme Details & Readiness Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Comprehensive Scheme Breakdown */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: What is it? */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-[#0F172A] font-editorial flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#1E3A5F]" />
              <span>{language === 'hi' ? 'योजना क्या है? (सरल भाषा में)' : 'What is this scheme?'}</span>
            </h2>
            <p className="text-sm text-[#334155] leading-relaxed whitespace-pre-line">
              {language === 'hi' ? scheme.description_hi : scheme.description}
            </p>
          </div>

          {/* Section 2: Financial Benefits & Subsidy Details */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-[#0F172A] font-editorial flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#16A34A]" />
              <span>{language === 'hi' ? 'वित्तीय लाभ व सब्सिडी सहायता' : 'Financial Assistance & Benefit Structure'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  {language === 'hi' ? 'अधिकतम वित्तीय सीमा' : 'Maximum Financial Limit'}
                </span>
                <p className="text-xl font-bold text-[#0F172A] font-editorial">
                  ₹{(scheme.benefit_amount_max / 100000).toFixed(1)} Lakh
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Min: ₹{(scheme.benefit_amount_min / 1000).toLocaleString('en-IN')}
                </p>
              </div>

              {scheme.subsidy_percentage ? (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider block mb-1">
                    {language === 'hi' ? 'सरकारी पूंजीगत सब्सिडी' : 'Capital Subsidy Grant'}
                  </span>
                  <p className="text-xl font-bold text-amber-900 font-editorial">
                    Up to {scheme.subsidy_percentage}%
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Direct Benefit Transfer into loan account
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-[10px] uppercase font-bold text-[#1E3A5F] tracking-wider block mb-1">
                    Support Type
                  </span>
                  <p className="text-sm font-bold text-[#1E3A5F] capitalize">
                    {scheme.benefit_type.join(' • ').replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Formal institutional financing
                  </p>
                </div>
              )}
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg text-xs text-[#475569] leading-relaxed">
              <span className="font-bold text-[#0F172A]">Benefit Summary:</span> {scheme.benefit_summary}
            </div>
          </div>

          {/* Section 3: Who Can Apply? */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-[#0F172A] font-editorial flex items-center gap-2">
              <Users className="w-5 h-5 text-[#1E3A5F]" />
              <span>{language === 'hi' ? 'पात्रता मापदंड (कौन आवेदन कर सकता है?)' : 'Who Can Apply?'}</span>
            </h2>

            <div className="space-y-3">
              {scheme.eligibility_text ? (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {scheme.eligibility_text}
                </div>
              ) : (
                scheme.rules.map((rule) => (
                  <div key={rule.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">{rule.label}</p>
                      <p className="text-xs text-[#475569] mt-0.5">{rule.explanation}</p>
                    </div>
                  </div>
                ))
              )}

              {scheme.exclusions_text && (
                <div className="p-3 bg-red-50/60 border border-red-200 rounded-lg text-xs text-red-950">
                  <span className="font-bold text-red-900 block mb-1">⚠ Exclusions / Ineligibility:</span>
                  <p>{scheme.exclusions_text}</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: How To Apply (Visual Timeline) */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-[#0F172A] font-editorial flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#1E3A5F]" />
              <span>{language === 'hi' ? 'आवेदन कैसे करें (चरणबद्ध प्रक्रिया)' : 'How to Apply (Visual Timeline)'}</span>
            </h2>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1E3A5F]/20">
              {scheme.application_steps.map((step) => (
                <div key={step.step} className="relative group">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#1E3A5F] text-white text-[11px] font-bold flex items-center justify-center ring-4 ring-white">
                    {step.step}
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200/80">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-[#0F172A]">{step.title}</h4>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 truncate max-w-[140px]">
                        {step.portalName}
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Official Apply CTA */}
            <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#0F172A]">Ready to submit your application?</p>
                <p className="text-[11px] text-[#64748B]">Official government application portal</p>
              </div>

              <a
                href={scheme.official_portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-[#1E3A5F] hover:bg-[#162D4A] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-xs transition"
              >
                <span>Proceed to Official Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Section 5: Frequently Asked Questions (Kaggle Dataset FAQ) */}
          {schemeFaqs.length > 0 && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#0F172A] font-editorial flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#1E3A5F]" />
                <span>{language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न (FAQs)' : 'Frequently Asked Questions (FAQs)'}</span>
              </h2>

              <div className="space-y-3">
                {schemeFaqs.map((faq, fIdx) => {
                  const isOpen = openFaqIndex === fIdx;
                  return (
                    <div
                      key={fIdx}
                      className="border border-[#E2E8F0] rounded-lg overflow-hidden transition"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                        className="w-full p-3.5 bg-slate-50 hover:bg-slate-100/80 text-left flex items-center justify-between gap-3 text-xs font-bold text-[#0F172A]"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-[#1E3A5F] shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                      </button>

                      {isOpen && (
                        <div className="p-4 bg-white text-xs text-[#475569] leading-relaxed border-t border-[#E2E8F0]">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right 1 Col: Interactive Document Checklist & Report Issue */}
        <div className="space-y-6">
          
          {/* Interactive Document Checklist Card */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs sticky top-24 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0F172A] font-editorial">
                  {language === 'hi' ? 'आवश्यक दस्तावेज चेकलिस्ट' : 'Application Document Checklist'}
                </h3>
                <AnimatedCounter value={readinessPercent} suffix="% Ready" className="text-xs font-mono font-bold text-[#1E3A5F]" />
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                Tick the documents you have ready to track your preparation status.
              </p>
            </div>

            {/* Progress bar */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#16A34A] transition-all duration-300"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>

            <div className="space-y-2.5">
              {scheme.documents_required.map((doc) => {
                const isChecked = completedDocs.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleDoc(doc.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition flex items-start gap-2.5 ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-[#16A34A] border-[#16A34A] text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${isChecked ? 'text-emerald-950' : 'text-[#0F172A]'}`}>
                        {doc.title} {doc.isMandatory && <span className="text-red-500">*</span>}
                      </p>
                      <p className="text-[11px] text-[#64748B] mt-0.5 leading-tight">{doc.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Statutory Assistance Layer Notice */}
            <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-[#64748B] leading-relaxed border border-slate-200/60">
              UdyamSetu tracks your <strong>document preparation status</strong>. Official submission receipt and loan status are issued directly by the participating bank.
            </div>

            {/* Report Data Issue Feedback Button */}
            <div className="pt-2 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-[#F97316] font-semibold hover:underline cursor-pointer py-1"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'क्या कुछ गलत है? रिपोर्ट करें →' : 'Is something wrong? Report an issue →'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Report Issue Modal */}
      {isReportModalOpen && (
        <ReportIssueModal scheme={scheme} onClose={() => setIsReportModalOpen(false)} />
      )}

    </div>
  );
};
