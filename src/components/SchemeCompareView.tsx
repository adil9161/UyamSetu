import React from 'react';
import { useApp } from '../context/AppContext';
import { VERIFIED_SCHEMES, Scheme } from '../data/schemes';
import { Scale, X, CheckCircle2, ArrowRight, ExternalLink, Sparkles, Building, DollarSign } from 'lucide-react';

export const SchemeCompareView: React.FC = () => {
  const {
    comparedSchemeIds,
    toggleCompareScheme,
    clearCompare,
    openSchemeDetail,
    setActiveView,
    language
  } = useApp();

  const comparedSchemes = VERIFIED_SCHEMES.filter((s) => comparedSchemeIds.includes(s.id));

  if (comparedSchemes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-4 rounded-full bg-slate-100 inline-flex mb-4">
          <Scale className="w-8 h-8 text-[#475569]" />
        </div>
        <h2 className="text-xl font-bold text-[#0F172A]">No Schemes Selected for Comparison</h2>
        <p className="text-sm text-[#475569] mt-1 mb-6">
          Browse or match schemes and click "Compare" on up to 3 schemes to analyze subsidy limits, collateral requirements, and timeline differences.
        </p>
        <button
          onClick={() => setActiveView('schemes')}
          className="bg-[#1E3A5F] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#162D4A]"
        >
          Browse All Schemes →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] font-mono">
            {language === 'hi' ? 'तुलना विश्लेषण' : 'SIDE-BY-SIDE EVALUATION'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-editorial mt-1">
            {language === 'hi' ? 'सरकारी योजनाओं की तुलना' : 'Compare Government Support Schemes'}
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Evaluating {comparedSchemes.length} of 3 maximum schemes.
          </p>
        </div>

        <button
          onClick={clearCompare}
          className="text-xs text-red-600 hover:text-red-800 font-semibold underline self-start sm:self-center cursor-pointer"
        >
          {language === 'hi' ? 'तुलना साफ़ करें' : 'Clear Comparison'}
        </button>
      </div>

      {/* AI Opportunity Comparison Insight */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex items-start gap-3.5">
        <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950 font-mono">
            UdyamSetu Comparative Insight
          </h3>
          <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
            {comparedSchemes.some((s) => s.slug === 'pmegp') && comparedSchemes.some((s) => s.slug === 'standup-india')
              ? 'Recommendation: If setting up a greenfield unit with investment under ₹50 Lakh, PMEGP offers an attractive 15–35% capital subsidy grant. For higher loan requirements up to ₹1 Crore for Women/SC/ST promoters, Stand-Up India provides larger single-window composite debt.'
              : 'Compare the capital subsidy percentage versus debt repayment tenure below to determine the most cost-effective financing mechanism for your enterprise.'}
          </p>
        </div>
      </div>

      {/* Comparison Table / Responsive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {comparedSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 space-y-5 relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#1E3A5F]" />

            <div className="space-y-4">
              {/* Remove button & Code */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {scheme.level.toUpperCase()}
                </span>
                <button
                  onClick={() => toggleCompareScheme(scheme.id)}
                  className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  title="Remove from comparison"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title */}
              <div>
                <h3
                  onClick={() => openSchemeDetail(scheme.slug)}
                  className="text-base font-bold text-[#0F172A] hover:text-[#1E3A5F] cursor-pointer transition font-editorial"
                >
                  {language === 'hi' ? scheme.name_hi : scheme.name}
                </h3>
                <p className="text-[11px] text-[#64748B] mt-1 flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-400" />
                  <span className="line-clamp-1">{scheme.ministry}</span>
                </p>
              </div>

              {/* Financial Comparison Metrics */}
              <div className="space-y-3 pt-3 border-t border-[#E2E8F0] text-xs">
                
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Max Benefit Limit</span>
                  <p className="text-base font-bold text-[#0F172A] font-editorial">
                    ₹{(scheme.benefit_amount_max / 100000).toFixed(1)} Lakh
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subsidy / Grant Rate</span>
                  <p className="font-semibold text-amber-900">
                    {scheme.subsidy_percentage ? `Up to ${scheme.subsidy_percentage}% Capital Subsidy` : 'Interest Subvention / Guarantee'}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Eligible Sectors</span>
                  <p className="text-[#475569] leading-snug">{scheme.business_types.slice(0, 4).join(', ')}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mandatory Verification</span>
                  <p className="text-[#475569]">{scheme.education_required || 'No minimum education restriction'}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Application Portal</span>
                  <p className="font-mono text-[11px] text-[#1E3A5F] truncate">{scheme.source_name}</p>
                </div>

              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
              <button
                onClick={() => openSchemeDetail(scheme.slug)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold rounded-lg transition"
              >
                View Full Details
              </button>

              <a
                href={scheme.official_portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-[#1E3A5F] hover:bg-[#162D4A] text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <span>Apply Officially</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
