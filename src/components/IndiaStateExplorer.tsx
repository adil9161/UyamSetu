import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INDIAN_STATES, VERIFIED_SCHEMES } from '../data/schemes';
import edaAnalyticsRaw from '../data/eda_analytics.json';
import {
  MapPin,
  Building,
  ArrowRight,
  Layers,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Globe2,
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const IndiaStateExplorer: React.FC = () => {
  const { userProfile, setUserProfile, setActiveView, openSchemeDetail, language } = useApp();
  const [selectedState, setSelectedState] = useState(INDIAN_STATES[0]);
  const [showEdaAnalytics, setShowEdaAnalytics] = useState(true);

  const stateSchemes = VERIFIED_SCHEMES.filter(
    (s) => s.level === 'central' || (s.level === 'state' && s.state_name?.toLowerCase() === selectedState.name.toLowerCase())
  );

  const handleSelectStateAndMatch = (st: typeof INDIAN_STATES[0]) => {
    setUserProfile({ ...userProfile, location_state: st.name });
    setActiveView('match');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const top15States = edaAnalyticsRaw.top_15_states.slice(0, 15);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] font-mono">
              {language === 'hi' ? 'राज्यवार योजना अन्वेषक एवं ईडीए' : 'HYPER-LOCAL SCHEME DISCOVERY & EDA'}
            </span>
            <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              35 States & UTs • 2,066 Schemes
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-editorial mt-1">
            {language === 'hi'
              ? 'राज्य एवं केंद्र शासित प्रदेश अनुसार सरकारी सहयोग खोजें'
              : 'Explore Government Support by Indian State'}
          </h1>
          <p className="text-sm text-[#475569] mt-1 max-w-2xl">
            {language === 'hi'
              ? 'प्रत्येक राज्य एमएसएमई, महिला उद्यमियों और कारीगरों के लिए अद्वितीय सब्सिडी और सहायता कार्यक्रम संचालित करता है।'
              : 'Interactive state scheme registry integrated with myScheme official welfare taxonomy.'}
          </p>
        </div>

        {/* Kaggle EDA Toggle Button */}
        <button
          onClick={() => setShowEdaAnalytics(!showEdaAnalytics)}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 border self-start md:self-center cursor-pointer ${
            showEdaAnalytics
              ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] shadow-xs'
              : 'bg-white text-[#1E3A5F] border-[#CBD5E1] hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#FF9933]" />
          <span>{showEdaAnalytics ? 'Hide Top 15 States EDA' : 'Show Top 15 States EDA'}</span>
        </button>
      </div>

      {/* ---------------- Kaggle EDA Section: Top 15 States by Number of Schemes ---------------- */}
      {showEdaAnalytics && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 space-y-6 relative overflow-hidden animate-in fade-in duration-300">
          <div className="absolute top-0 left-0 right-0 tricolour-bar" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#1E3A5F]" />
                <h3 className="text-base font-bold text-[#0F172A] font-editorial">
                  {language === 'hi'
                    ? 'योजनाओं की संख्या अनुसार शीर्ष 15 राज्य (myScheme EDA विश्लेषण)'
                    : 'Top 15 States by Number of Schemes (myScheme EDA Analysis)'}
                </h3>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Benchmark aggregation derived from the national welfare scheme dataset (2,066+ records).
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-[#1E3A5F]" /> Central: {edaAnalyticsRaw.central_schemes_count}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-[#F97316]" /> State: {edaAnalyticsRaw.state_schemes_count}
              </span>
            </div>
          </div>

          {/* Interactive Top 15 Horizontal Bar Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 pt-1">
            {top15States.map((item, idx) => {
              const maxVal = top15States[0].state_schemes;
              const barWidth = Math.max(8, Math.round((item.state_schemes / maxVal) * 100));
              const isCurrent = selectedState.name.toLowerCase() === item.state.toLowerCase();

              return (
                <div
                  key={idx}
                  onClick={() => {
                    const stObj = INDIAN_STATES.find((s) => s.name.toLowerCase() === item.state.toLowerCase());
                    if (stObj) setSelectedState(stObj);
                  }}
                  className={`p-2.5 rounded-lg border transition cursor-pointer flex items-center gap-3 ${
                    isCurrent
                      ? 'bg-blue-50/80 border-[#1E3A5F] shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs font-mono font-bold text-slate-400 w-5 text-right">
                    #{idx + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-[#0F172A] truncate">{item.state}</span>
                      <span className="font-mono font-bold text-[#1E3A5F]">
                        {item.state_schemes} <span className="text-[10px] text-slate-500 font-normal">State ({item.total_accessible} Total)</span>
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#1E3A5F] to-[#F97316] rounded-full transition-all duration-300"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Application Modes Overview */}
          <div className="pt-4 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-3 gap-3">
            {edaAnalyticsRaw.application_modes.map((mode, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 font-mono tracking-wider block">
                  Application Mode
                </span>
                <p className="font-bold text-[#0F172A]">{mode.mode}</p>
                <div className="flex justify-between text-slate-600 font-mono text-[11px] pt-1">
                  <span>{mode.count} Schemes</span>
                  <span className="font-bold text-[#1E3A5F]">{mode.percentage}%</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ---------------- Main Grid: 35 State Explorer & Deep-Dive ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: State Selector Grid */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              All 35 Indian States & UTs
            </h3>
            <span className="text-xs font-mono text-[#1E3A5F] font-semibold">{INDIAN_STATES.length} Regions</span>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {INDIAN_STATES.map((st) => {
              const isSelected = selectedState.id === st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedState(st)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#1E3A5F] border-[#1E3A5F] text-white shadow-xs'
                      : 'bg-white border-[#E2E8F0] hover:border-slate-300 text-[#0F172A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#FF9933]' : 'text-[#1E3A5F]'}`} />
                    <div>
                      <p className="text-xs font-bold">{st.name}</p>
                      <p className={`text-[10px] ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>{st.name_hi}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-mono font-bold ${isSelected ? 'text-emerald-300' : 'text-[#1E3A5F]'}`}>
                      {st.total_schemes}
                    </span>
                    <span className={`text-[10px] block ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>Schemes</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Selected State Deep-Dive */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* State Summary Banner */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#1E3A5F]" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#F97316] uppercase">Selected State Registry</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {selectedState.total_schemes} Verified Programs
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-[#0F172A] font-editorial mt-1">
                  {selectedState.name} ({selectedState.name_hi})
                </h2>
              </div>

              <button
                onClick={() => handleSelectStateAndMatch(selectedState)}
                className="px-4 py-2.5 bg-[#1E3A5F] hover:bg-[#162D4A] text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
              >
                <span>Find Schemes in {selectedState.name} →</span>
              </button>
            </div>

            {/* Scheme Distribution Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#E2E8F0]">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Central Programs</span>
                <p className="text-lg font-bold text-[#1E3A5F] font-editorial mt-0.5">{selectedState.central_schemes}</p>
                <p className="text-[10px] text-slate-500">Pan-India access</p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-[10px] uppercase font-bold text-amber-900 font-mono">State-Specific</span>
                <p className="text-lg font-bold text-amber-900 font-editorial mt-0.5">{selectedState.state_schemes}</p>
                <p className="text-[10px] text-amber-700">Domicile required</p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-emerald-900 font-mono">Priority Sectors</span>
                <p className="text-lg font-bold text-emerald-900 font-editorial mt-0.5">{selectedState.top_sectors.length}</p>
                <p className="text-[10px] text-emerald-700">Target industries</p>
              </div>
            </div>

            {/* Top Sectors in this State */}
            <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
              <span className="text-[10px] font-bold uppercase text-slate-500 font-mono tracking-wider block mb-2">
                Top Priority Sectors in {selectedState.name}
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedState.top_sectors.map((sec, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-[#0F172A] font-medium border border-slate-200"
                  >
                    {sec.sector} <strong className="text-[#1E3A5F]">({sec.count})</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Key State Departments */}
            <div className="mt-4 text-xs text-[#475569]">
              <span className="font-semibold text-[#0F172A]">Nodal Agencies:</span> {selectedState.key_departments.join(' • ')}
            </div>
          </div>

          {/* List of Available Schemes in Selected State */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] font-mono">
              Verified Schemes Available in {selectedState.name} ({stateSchemes.length})
            </h3>

            <div className="space-y-3">
              {stateSchemes.slice(0, 15).map((scheme) => (
                <div
                  key={scheme.id}
                  onClick={() => openSchemeDetail(scheme.slug)}
                  className="bg-white rounded-lg p-4 border border-[#E2E8F0] hover:border-[#1E3A5F]/40 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded font-mono ${
                          scheme.level === 'central' ? 'bg-[#1E3A5F] text-white' : 'bg-[#F97316] text-white'
                        }`}
                      >
                        {scheme.level.toUpperCase()}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">{scheme.code}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#0F172A] hover:text-[#1E3A5F]">
                      {language === 'hi' ? scheme.name_hi : scheme.name}
                    </h4>
                    <p className="text-xs text-[#64748B] line-clamp-1">{scheme.benefit_summary}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <span className="text-xs font-bold text-[#1E3A5F] flex items-center gap-1">
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {stateSchemes.length > 15 && (
              <div className="text-center pt-2">
                <button
                  onClick={() => setActiveView('schemes')}
                  className="text-xs font-bold text-[#1E3A5F] hover:underline"
                >
                  View all {stateSchemes.length} schemes in directory →
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
