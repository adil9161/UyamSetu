import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { VERIFIED_SCHEMES, Scheme } from '../data/schemes';
import { TrustBadge } from './TrustBadge';
import {
  Search,
  Building,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Scale,
  Bookmark,
  BookmarkCheck,
  MapPin,
  Sparkles
} from 'lucide-react';
import { StaggerContainer, StaggerItem } from './motion/Stagger';
import { RevealCard } from './motion/RevealCard';

export const BrowseSchemesView: React.FC = () => {
  const {
    openSchemeDetail,
    saveScheme,
    savedApplications,
    toggleCompareScheme,
    comparedSchemeIds,
    language
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;

  const filteredSchemes = useMemo(() => {
    return VERIFIED_SCHEMES.filter((scheme) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        scheme.name.toLowerCase().includes(q) ||
        scheme.description.toLowerCase().includes(q) ||
        scheme.ministry.toLowerCase().includes(q) ||
        scheme.code.toLowerCase().includes(q) ||
        (scheme.state_name && scheme.state_name.toLowerCase().includes(q));

      const matchesLevel = selectedLevel === 'all' || scheme.level === selectedLevel;

      const matchesSector =
        selectedSector === 'all' ||
        scheme.business_types.some((bt) => bt.toLowerCase().includes(selectedSector.toLowerCase()));

      return matchesSearch && matchesLevel && matchesSector;
    });
  }, [searchQuery, selectedLevel, selectedSector]);

  // Reset to page 1 on filter change
  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<any>>, value: any) => {
    setter(value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage);
  const displayedSchemes = filteredSchemes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] font-mono">
            {language === 'hi' ? 'राष्ट्रीय योजना भंडार' : 'NATIONAL SCHEME REPOSITORY'}
          </span>
          <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            {VERIFIED_SCHEMES.length} Total Verified Schemes
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-editorial mt-1">
          {language === 'hi'
            ? 'भारत सरकार एवं सभी 35 राज्यों की सत्यापित योजनाएं'
            : 'Browse All Verified Central & State Schemes'}
        </h1>
        <p className="text-sm text-[#475569] mt-1">
          Showing {filteredSchemes.length} matching programs across Central Ministries and State Departments.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
            placeholder={
              language === 'hi'
                ? 'कीवर्ड, राज्य, मंत्रालय या सब्सिडी प्रकार खोजें...'
                : 'Search by keyword, state, ministry, or subsidy type...'
            }
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
          />
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedLevel}
            onChange={(e) => handleFilterChange(setSelectedLevel, e.target.value)}
            className="px-3 py-2.5 text-xs bg-slate-50 border border-[#CBD5E1] rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] w-full md:w-auto"
          >
            <option value="all">All Levels (Central + State)</option>
            <option value="central">Central Government Only (527+)</option>
            <option value="state">State Specific Only (1,539+)</option>
          </select>

          {/* Sector Filter */}
          <select
            value={selectedSector}
            onChange={(e) => handleFilterChange(setSelectedSector, e.target.value)}
            className="px-3 py-2.5 text-xs bg-slate-50 border border-[#CBD5E1] rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] w-full md:w-auto"
          >
            <option value="all">All Sectors</option>
            <option value="Manufacturing">Manufacturing & Industry</option>
            <option value="Services">Services & Trade</option>
            <option value="Retail">Retail & Shopkeepers</option>
            <option value="Food Processing">Food Processing & Agro</option>
            <option value="Handicraft">Handicraft & Artisans</option>
            <option value="Textile">Textile & Handloom</option>
            <option value="Agriculture">Agriculture Allied & Dairy</option>
            <option value="Technology">Technology & Startups</option>
          </select>
        </div>

      </div>

      {/* Schemes Grid with Layout-Aware Stagger */}
      <StaggerContainer
        key={`${selectedLevel}-${selectedSector}-${currentPage}-${searchQuery}`}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {displayedSchemes.map((scheme) => {
          const isSaved = savedApplications.some((a) => a.schemeId === scheme.id);
          const isCompared = comparedSchemeIds.includes(scheme.id);

          return (
            <StaggerItem key={scheme.id}>
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs hover:shadow-md transition p-6 space-y-4 relative overflow-hidden flex flex-col justify-between h-full">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#1E3A5F]" />

                <div className="space-y-3">
                  {/* Meta Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
                          scheme.level === 'central' ? 'bg-[#1E3A5F] text-white' : 'bg-[#F97316] text-white'
                        }`}
                      >
                        {scheme.level === 'central' ? 'CENTRAL' : scheme.state_name ? `STATE — ${scheme.state_name.toUpperCase()}` : 'STATE'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">{scheme.code}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => saveScheme(scheme)}
                        className={`p-1.5 rounded text-xs flex items-center gap-1 font-semibold transition cursor-pointer ${
                          isSaved ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title={isSaved ? 'Saved' : 'Save'}
                      >
                        {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCompareScheme(scheme.id)}
                        className={`p-1.5 rounded text-xs flex items-center gap-1 font-semibold transition cursor-pointer ${
                          isCompared ? 'bg-blue-50 text-[#1E3A5F]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Compare"
                      >
                        <Scale className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h3
                      onClick={() => openSchemeDetail(scheme.slug)}
                      className="text-base sm:text-lg font-bold text-[#0F172A] hover:text-[#1E3A5F] cursor-pointer transition font-editorial leading-snug"
                    >
                      {language === 'hi' ? scheme.name_hi : scheme.name}
                    </h3>
                    <p className="text-xs text-[#475569] mt-1 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{scheme.ministry || scheme.department}</span>
                    </p>
                  </div>

                  {/* Benefit Callout */}
                  <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-lg">
                    <span className="text-[10px] font-bold uppercase text-amber-900 font-mono tracking-wider block">
                      Benefit Summary
                    </span>
                    <p className="text-xs font-semibold text-[#0F172A] mt-0.5 leading-snug line-clamp-2">
                      {scheme.benefit_summary}
                    </p>
                  </div>

                  {/* Target Categories */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {scheme.target_categories.slice(0, 3).map((cat, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {cat}
                      </span>
                    ))}
                    {scheme.target_categories.length > 3 && (
                      <span className="text-[10px] text-slate-400 px-1 py-0.5 font-mono">
                        +{scheme.target_categories.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Source badge */}
                  <TrustBadge
                    trustState={scheme.trust_state}
                    sourceName={scheme.source_name}
                    sourceUrl={scheme.source_url}
                    lastVerifiedAt={scheme.last_verified_at}
                    showDetails={false}
                  />
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <button
                    onClick={() => openSchemeDetail(scheme.slug)}
                    className="text-xs font-bold text-[#1E3A5F] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'hi' ? 'पूर्ण विवरण देखें' : 'View Full Details'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={scheme.official_portal_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-slate-600 hover:text-[#0F172A] flex items-center gap-1"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-6 border-t border-[#E2E8F0] flex items-center justify-between">
          <p className="text-xs text-[#475569] font-mono">
            Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredSchemes.length)} of {filteredSchemes.length} schemes (Page {currentPage} of {totalPages})
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentPage(Math.max(1, currentPage - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-[#0F172A] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => {
                setCurrentPage(Math.min(totalPages, currentPage + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-[#0F172A] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
