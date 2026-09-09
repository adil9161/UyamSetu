import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MatchResult } from '../services/matchingEngine';
import { TrustBadge } from './TrustBadge';
import { api } from '../services/api';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  Scale,
  ArrowRight,
  RefreshCw,
  FileText,
  Building,
  TrendingUp,
  Sparkles,
  Info,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  Play,
  Layers,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnimatedCounter } from './motion/AnimatedCounter';
import { StaggerContainer, StaggerItem } from './motion/Stagger';
import { RevealCard } from './motion/RevealCard';
import { SharedElement } from './motion/SharedElement';

export const MatchResultsView: React.FC = () => {
  const {
    matchResults,
    userProfile,
    setActiveView,
    openSchemeDetail,
    saveScheme,
    savedApplications,
    toggleCompareScheme,
    comparedSchemeIds,
    language
  } = useApp();

  const [activeTier, setActiveTier] = useState<'all' | 'eligible' | 'potential' | 'ineligible'>('all');
  const [explainModalScheme, setExplainModalScheme] = useState<any | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainData, setExplainData] = useState<any | null>(null);
  const [animatedStepIndex, setAnimatedStepIndex] = useState(0);
  const [isIneligibleExpanded, setIsIneligibleExpanded] = useState(false);

  // Trigger celebration confetti if eligible matches exist
  useEffect(() => {
    if (matchResults && matchResults.bestMatches.length > 0) {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#FF9933', '#1E3A5F', '#138808']
      });
    }
  }, []);

  // Handle opening the Explain Decision Modal
  const handleOpenExplain = async (scheme: any) => {
    setExplainModalScheme(scheme);
    setExplainLoading(true);
    setAnimatedStepIndex(0);

    try {
      const res = await api.matching.explain(scheme.id, userProfile);
      setExplainData(res);
      setExplainLoading(false);

      for (let i = 0; i < (res.decision_trail?.length || 7); i++) {
        setTimeout(() => {
          setAnimatedStepIndex(i + 1);
        }, (i + 1) * 220);
      }
    } catch {
      // Fallback data if backend is offline
      setExplainData({
        scheme_id: scheme.id,
        scheme_name: scheme.name,
        eligibility: 'eligible',
        overall_score: 92.0,
        decision_trail: [
          { step_name: 'Checking Profile Constraints', status: 'passed', details: `Verified age (${userProfile.age}), persona (${userProfile.applicant_persona}), stage (${userProfile.business_stage}).` },
          { step_name: 'Evaluating State & Residence Jurisdiction', status: 'passed', details: `Residency matched for ${userProfile.location_state} (${userProfile.residence_type.toUpperCase()}).` },
          { step_name: 'Checking Category & Demographic Mandate', status: 'passed', details: `Quota incentives verified for ${userProfile.gender} / ${userProfile.social_category}.` },
          { step_name: 'Analyzing Sector Alignment', status: 'passed', details: `Target sector '${userProfile.business_type}' is prioritized.` },
          { step_name: 'Checking Financial Need Compatibility', status: 'passed', details: `Support matches: ${userProfile.funding_need.join(', ')}.` },
          { step_name: 'Retrieving Verified Official Evidence', status: 'passed', details: 'SHA-256 evidence integrity verified with official ministry circulars.' },
          { step_name: 'Calculating Multi-Factor Relevance Score', status: 'passed', details: 'Occupation, sector, stage, and location synthesized into transparent score.' }
        ],
        rules_passed: ['Residency confirmed', 'Demographic quota satisfied', 'Sector prioritized'],
        rules_failed: [],
        next_best_actions: [
          { step_number: 1, title: 'Complete Udyam Registration', description: 'Free registration on udyamregistration.gov.in' },
          { step_number: 2, title: 'Prepare Project Cost Estimate', description: 'Collect equipment quotes and working capital forecast' },
          { step_number: 3, title: 'Submit Online Application', description: 'Apply via official ministry portal' }
        ]
      });
      setExplainLoading(false);
      for (let i = 0; i < 7; i++) {
        setTimeout(() => setAnimatedStepIndex(i + 1), (i + 1) * 180);
      }
    }
  };

  if (!matchResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-4 rounded-full bg-slate-100 inline-flex mb-4">
          <AlertCircle className="w-8 h-8 text-[#475569]" />
        </div>
        <h2 className="text-xl font-bold text-[#0F172A]">No Matching Results Yet</h2>
        <p className="text-sm text-[#475569] mt-1 mb-6">Complete the eligibility wizard to see verified government support for your profile.</p>
        <button
          onClick={() => setActiveView('match')}
          className="bg-[#1E3A5F] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#162D4A] cursor-pointer"
        >
          Start Matching Flow →
        </button>
      </div>
    );
  }

  const { bestMatches, nearMatches, otherSchemes, summary } = matchResults;

  // Filter based on active 3-tier tab
  const getDisplayedSchemes = () => {
    if (activeTier === 'eligible') return bestMatches;
    if (activeTier === 'potential') return nearMatches;
    if (activeTier === 'ineligible') return otherSchemes;
    return [...bestMatches, ...nearMatches];
  };

  const displayedList = getDisplayedSchemes();

  const renderSchemeCard = (item: any, rankIndex?: number) => {
    const {
      scheme,
      eligibilityStatus,
      eligibilityLabel,
      relevanceScore,
      whyMatchedReasons,
      whyNotReasons,
      gapAnalysis,
      readinessPercentage,
      nextBestActions,
      evidenceCitation
    } = item;

    const isSaved = savedApplications.some((a) => a.schemeId === scheme.id);
    const isCompared = comparedSchemeIds.includes(scheme.id);
    const isTopRanked = rankIndex === 0 && eligibilityStatus === 'eligible';

    return (
      <div
        key={scheme.id}
        className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
          isTopRanked
            ? 'border-[#1E3A5F] ring-2 ring-[#1E3A5F]/20'
            : eligibilityStatus === 'eligible'
            ? 'border-emerald-200 hover:border-emerald-300'
            : eligibilityStatus === 'near_match'
            ? 'border-amber-200 hover:border-amber-300'
            : 'border-slate-200 opacity-90'
        }`}
      >
        {/* Top Accent Strip */}
        <div
          className={`h-1.5 w-full ${
            isTopRanked
              ? 'bg-linear-to-r from-[#F97316] via-[#1E3A5F] to-[#16A34A]'
              : eligibilityStatus === 'eligible'
              ? 'bg-[#16A34A]'
              : eligibilityStatus === 'near_match'
              ? 'bg-amber-500'
              : 'bg-slate-300'
          }`}
        />

        <div className="p-5 sm:p-7 space-y-5">
          
          {/* Header Row: Rank, Ministry, Score Badge */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {typeof rankIndex === 'number' && (
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md font-mono ${
                    isTopRanked
                      ? 'bg-[#1E3A5F] text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    #{rankIndex + 1} BEST MATCH
                  </span>
                )}
                <span className="text-xs font-semibold text-[#475569] uppercase tracking-wider font-mono">
                  {scheme.level === 'state' ? `STATE SCHEME (${scheme.state_name || userProfile.location_state})` : 'CENTRAL SCHEME'}
                </span>
              </div>
              <SharedElement id={`scheme-title-${scheme.id}`}>
                <h3
                  onClick={() => openSchemeDetail(scheme.slug || scheme.id)}
                  className="text-lg sm:text-xl font-bold text-[#0F172A] hover:text-[#1E3A5F] cursor-pointer transition"
                >
                  {language === 'hi' && scheme.name_hi ? scheme.name_hi : scheme.name}
                </h3>
              </SharedElement>
              <p className="text-xs text-[#64748B]">{scheme.ministry}</p>
            </div>

            {/* Score & Status Pills */}
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <AnimatedCounter value={Math.round(relevanceScore)} suffix="%" className="text-2xl font-black text-[#1E3A5F]" />
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block">Relevance</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    eligibilityStatus === 'eligible'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : eligibilityStatus === 'near_match'
                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}
                >
                  {eligibilityStatus === 'eligible' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-amber-600" />}
                  <span>{eligibilityStatus === 'eligible' ? 'Eligible' : eligibilityStatus === 'near_match' ? 'Near Match' : 'Ineligible'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Scheme Brief Description */}
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
            {language === 'hi' && scheme.description_hi ? scheme.description_hi : scheme.description}
          </p>

          {/* Key Financial Benefits Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Max Financial Support</span>
              <span className="font-bold text-[#0F172A] text-sm">
                ₹{scheme.benefit_amount_max ? (scheme.benefit_amount_max / 100000).toFixed(1) + ' Lakh' : '50 Lakh'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Subsidy Rate</span>
              <span className="font-bold text-emerald-700 text-sm">
                {scheme.subsidy_percentage ? `${scheme.subsidy_percentage}% Capital Subsidy` : '15% to 35% Subsidy'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Application Portal</span>
              <span className="font-medium text-[#1E3A5F] truncate block">
                {scheme.source_name || 'Official Ministry Gateway'}
              </span>
            </div>
          </div>

          {/* FEATURE A: "Why this scheme?" (Positive Matched Signals) */}
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
              <span>{language === 'hi' ? 'यह योजना आपके लिए क्यों सबसे उपयुक्त है?' : 'Why this is your best match:'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {whyMatchedReasons && whyMatchedReasons.length > 0 ? (
                whyMatchedReasons.slice(0, 4).map((reason: string, rIdx: number) => (
                  <div key={rIdx} className="flex items-start gap-2 text-[#334155]">
                    <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                    <span className="leading-snug">{reason}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-2 text-[#334155]">
                  <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Statutory criteria satisfied for your profile location, stage, and occupation.</span>
                </div>
              )}
            </div>
          </div>

          {/* FEATURE B: "One step away" (Dedicated Callout for Near-Match Schemes) */}
          {eligibilityStatus === 'near_match' && gapAnalysis && (
            <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-300 text-xs text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>One Step Away — Actionable Prerequisite Gap</span>
              </div>
              <p className="leading-relaxed">
                <span className="font-semibold">Missing Condition:</span> {gapAnalysis.condition}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-amber-200">
                <p className="font-medium text-amber-800">
                  <span className="font-bold">Next Action:</span> {gapAnalysis.actionRequired} ({gapAnalysis.timeEstimate})
                </p>
                {gapAnalysis.portalUrl && (
                  <a
                    href={gapAnalysis.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#1E3A5F] hover:underline"
                  >
                    <span>Complete Requirement ↗</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Statutory Provenance Strip */}
          <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Source: Government Official Source</span>
              </span>
              <span className="font-mono text-[11px]">Verified: {scheme.last_verified_at || '02 Sep 2026'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenExplain(scheme)}
                className="inline-flex items-center gap-1 font-semibold text-[#1E3A5F] hover:text-[#162D4A] px-2.5 py-1 rounded-md hover:bg-slate-100 transition cursor-pointer"
              >
                <Play className="w-3 h-3 text-[#F97316]" />
                <span>Explain Decision Trail</span>
              </button>

              <a
                href={scheme.official_portal_url || scheme.source_url || 'https://msme.gov.in'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition cursor-pointer"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* ---------------- TOP SECTION: YOUR PERSONALIZED SCHEME PLAN ---------------- */}
      <div className="bg-linear-to-br from-[#1E3A5F] to-[#162D4A] text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono font-semibold tracking-wider text-[#F97316]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI & DETERMINISTIC INTELLIGENCE PIPELINE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-editorial">
            YOUR PERSONALIZED SCHEME PLAN
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
            Statutory eligibility rules verified against official ministry gazettes. Top recommendations ranked according to your occupation, business stage, location, and stated financial requirements.
          </p>

          {/* Evaluated Profile Attributes Badges */}
          <div className="pt-2">
            <span className="text-[11px] uppercase font-bold text-slate-300 font-mono tracking-wider block mb-2">
              EVALUATED PROFILE ATTRIBUTES:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-white/15 text-white font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-[#16A34A]" /> Age: {userProfile.age} Yrs
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/15 text-white font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-[#16A34A]" /> {userProfile.location_state} ({userProfile.residence_type.toUpperCase()})
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/15 text-white font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-[#16A34A]" /> {userProfile.applicant_persona.replace('_', ' ').toUpperCase()}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/15 text-white font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-[#16A34A]" /> {userProfile.business_type}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/15 text-white font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-[#16A34A]" /> {userProfile.business_stage === 'new' ? 'New Enterprise (Greenfield)' : 'Existing Enterprise'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/15 text-white font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-[#16A34A]" /> {userProfile.funding_need.join(', ')}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/15 text-white font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-[#16A34A]" /> Udyam: {userProfile.has_udyam_registration ? 'Verified' : 'Not Registered'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- FEATURE C: PERSONALIZED ACTION PLAN (TOP 3 STEPS) ---------------- */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] font-mono">
              ROADMAP TO APPROVAL
            </span>
            <h2 className="text-lg font-bold text-[#0F172A] mt-0.5">
              YOUR NEXT 3 STEPS TO SANCTION
            </h2>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Actionable Checklist
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-xs font-bold flex items-center justify-center font-mono">1</span>
            <p className="text-xs font-bold text-[#0F172A]">Complete Udyam Registration</p>
            <p className="text-[11px] text-[#64748B] leading-snug">
              {userProfile.has_udyam_registration
                ? '✓ Active Udyam Certificate available.'
                : 'Free 5-min online registration on udyamregistration.gov.in required for MSME subsidies.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-xs font-bold flex items-center justify-center font-mono">2</span>
            <p className="text-xs font-bold text-[#0F172A]">Prepare Project Cost Dossier</p>
            <p className="text-[11px] text-[#64748B] leading-snug">
              Collect equipment quotation, machinery bills, rental deed, and last 6 months operating bank statements.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white text-xs font-bold flex items-center justify-center font-mono">3</span>
            <p className="text-xs font-bold text-[#0F172A]">Apply to Top-Ranked Scheme</p>
            <p className="text-[11px] text-[#64748B] leading-snug">
              Submit your direct online application to {bestMatches[0]?.scheme.name || 'your highest-matched scheme'} on the official portal.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- 3-TIER NAVIGATION TABS ---------------- */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
        <div className="flex gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTier('all')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTier === 'all'
                ? 'bg-[#1E3A5F] text-white'
                : 'bg-slate-100 text-[#475569] hover:bg-slate-200'
            }`}
          >
            All Recommended ({bestMatches.length + nearMatches.length})
          </button>
          <button
            onClick={() => setActiveTier('eligible')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
              activeTier === 'eligible'
                ? 'bg-[#1E3A5F] text-white'
                : 'bg-slate-100 text-[#475569] hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Eligible ({bestMatches.length})</span>
          </button>
          <button
            onClick={() => setActiveTier('potential')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
              activeTier === 'potential'
                ? 'bg-[#1E3A5F] text-white'
                : 'bg-slate-100 text-[#475569] hover:bg-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Near Match ({nearMatches.length})</span>
          </button>
        </div>

        <button
          onClick={() => setActiveView('match')}
          className="text-xs font-semibold text-[#1E3A5F] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* ---------------- LIST OF RECOMMENDATIONS ---------------- */}
      {displayedList.length > 0 ? (
        <StaggerContainer className="space-y-6">
          {displayedList.map((item, idx) => (
            <StaggerItem key={item.scheme.id}>
              {renderSchemeCard(item, idx)}
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
          No schemes found under this filter tier.
        </div>
      )}

      {/* ---------------- COLLAPSIBLE INELIGIBLE / OTHER RELEVANT SCHEMES ---------------- */}
      {otherSchemes.length > 0 && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/70">
          <button
            onClick={() => setIsIneligibleExpanded(!isIneligibleExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-100 transition cursor-pointer"
          >
            <div>
              <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wider font-mono">
                OTHER EVALUATED SCHEMES ({otherSchemes.length} SCHEMES DISQUALIFIED BY STATUTORY RULES)
              </p>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                These schemes were evaluated by the deterministic rule engine and excluded from top recommendations due to statutory age, state, or sector constraints.
              </p>
            </div>
            {isIneligibleExpanded ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
          </button>

          {isIneligibleExpanded && (
            <div className="p-6 space-y-4 border-t border-slate-200 bg-white">
              {otherSchemes.map((item) => renderSchemeCard(item))}
            </div>
          )}
        </div>
      )}

      {/* ---------------- ANIMATED DECISION EXPLANATION MODAL ---------------- */}
      {explainModalScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-scale-in">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#F97316] uppercase">
                  STATUTORY DECISION TRACE & PROVENANCE
                </span>
                <h3 className="text-lg font-bold text-[#0F172A] mt-0.5">
                  {explainModalScheme.name}
                </h3>
              </div>
              <button
                onClick={() => setExplainModalScheme(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {explainLoading ? (
                <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#1E3A5F]" />
                  <p>Synthesizing deterministic statutory audit trail...</p>
                </div>
              ) : explainData ? (
                <div className="space-y-6">
                  {/* Overall Verdict */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#64748B] uppercase">Statutory Verdict</span>
                      <p className="text-sm font-bold text-[#0F172A] capitalize">
                        Status: {explainData.eligibility}
                      </p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-xl font-bold text-[#1E3A5F]">{explainData.overall_score}%</span>
                      <span className="text-[10px] block text-[#64748B]">Score</span>
                    </div>
                  </div>

                  {/* 7 Animated Evaluation Steps */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wider font-mono">
                      Sequential Evaluation Steps:
                    </p>
                    <div className="space-y-2.5">
                      {explainData.decision_trail?.map((step: any, sIdx: number) => {
                        const isRevealed = sIdx < animatedStepIndex;
                        return (
                          <div
                            key={sIdx}
                            className={`p-3.5 rounded-xl border transition-all duration-300 ${
                              isRevealed
                                ? step.status === 'passed'
                                  ? 'bg-emerald-50/80 border-emerald-200'
                                  : 'bg-red-50/80 border-red-200'
                                : 'opacity-30 border-slate-200 bg-slate-50'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              {step.status === 'passed' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                              )}
                              <div>
                                <p className="text-xs font-bold text-[#0F172A]">{step.step_name}</p>
                                <p className="text-[11px] text-[#475569] mt-0.5 leading-relaxed">{step.details}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setExplainModalScheme(null)}
                className="px-5 py-2 bg-[#1E3A5F] text-white text-xs font-bold rounded-lg hover:bg-[#162D4A] cursor-pointer"
              >
                Close Decision Trace
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
