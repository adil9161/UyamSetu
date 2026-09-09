import React from 'react';
import { useApp } from '../context/AppContext';
import { VERIFIED_SCHEMES } from '../data/schemes';
import {
  BookmarkCheck,
  CheckCircle2,
  Trash2,
  ExternalLink,
  FileText,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  User,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  Users
} from 'lucide-react';
import { StaggerContainer, StaggerItem } from './motion/Stagger';
import { AnimatedCounter } from './motion/AnimatedCounter';
import { Reveal } from './motion/Reveal';

export const ApplicationsDashboard: React.FC = () => {
  const {
    savedApplications,
    removeSavedScheme,
    toggleDocCompletion,
    updateApplicationNotes,
    openSchemeDetail,
    setActiveView,
    language,
    auth,
    userProfile
  } = useApp();

  const ProfileSummaryCard = () => {
    if (!auth.isAuthenticated) return null;
    return (
      <div className="bg-white rounded-2xl border border-[#CBD5E1] shadow-sm p-6 mb-8 overflow-hidden relative">
        <div className="tricolour-bar absolute top-0 left-0 right-0" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {auth.name ? auth.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 font-editorial">{auth.name}</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Citizen Profile
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{auth.email || auth.phoneOrEmail}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('match')}
            className="inline-flex items-center gap-2 bg-[#1E3A5F] hover:bg-[#162D4A] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Find Matching Schemes →</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Age</span>
            <span className="font-bold text-slate-800">{userProfile.age || 28} years</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Gender</span>
            <span className="font-bold text-slate-800 capitalize">{userProfile.gender || 'Female'}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
            <span className="font-bold text-slate-800">{userProfile.social_category || 'General'}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Qualification</span>
            <span className="font-bold text-slate-800 truncate block">{userProfile.educational_qualification || userProfile.education_level || '10th Pass'}</span>
          </div>
        </div>

        {userProfile.address && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{userProfile.address}</span>
          </div>
        )}
      </div>
    );
  };

  if (savedApplications.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ProfileSummaryCard />
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 sm:p-12 text-center shadow-sm">
          <div className="p-4 rounded-full bg-slate-100 inline-flex mb-4">
            <BookmarkCheck className="w-8 h-8 text-[#475569]" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">No Saved Applications Yet</h2>
          <p className="text-sm text-[#475569] mt-1 mb-6 max-w-md mx-auto">
            Save schemes from your matching results to track document preparation status, personal notes, and direct links to official ministry portals.
          </p>
          <button
            onClick={() => setActiveView('match')}
            className="bg-[#1E3A5F] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#162D4A] cursor-pointer"
          >
            Run Eligibility Matcher →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Citizen Profile Summary Banner */}
      <ProfileSummaryCard />

      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] font-mono">
          {language === 'hi' ? 'आवेदन तैयारी डैशबोर्ड' : 'APPLICATION PREPARATION DASHBOARD'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-editorial mt-1">
          {language === 'hi' ? 'मेरे सहेजे गए आवेदन और दस्तावेज़ तैयारी' : 'My Saved Applications & Document Readiness'}
        </h1>
        <p className="text-sm text-[#475569] mt-1">
          Tracking {savedApplications.length} active enterprise preparation workflows.
        </p>
      </div>

      {/* Production Distinction Banner: Assistance Layer vs Official Portal */}
      <div className="bg-slate-900 text-white rounded-xl p-5 mb-8 border border-slate-800 flex items-start gap-3.5">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-white">
            {language === 'hi' ? 'तैयारी बनाम आधिकारिक स्थिति: ' : 'Preparation Status vs Official Application Status: '}
          </span>
          {language === 'hi'
            ? 'उद्यमसेतु पर आप आवश्यक दस्तावेजों और परियोजना रिपोर्ट की तैयारी को ट्रैक करते हैं। आधिकारिक आवेदन पत्र जमा करने और ऋण स्वीकृति की प्रक्रिया संबंधित सरकारी पोर्टल (जैसे KVIC / JanSamarth) पर पूरी होती है।'
            : 'UdyamSetu tracks your local readiness and document checklist. Official submission, reference IDs, and sanction letters are processed directly on official government portals.'}
        </div>
      </div>

      {/* List of Saved Application Cards */}
      <StaggerContainer className="space-y-6">
        {savedApplications.map((app) => {
          const scheme = VERIFIED_SCHEMES.find((s) => s.id === app.schemeId);
          if (!scheme) return null;

          return (
            <StaggerItem key={app.schemeId}>
              <div
                className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 space-y-6 relative overflow-hidden"
              >
              {/* Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#1E3A5F]" />

              {/* Card Title & Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    SAVED: {app.savedAt}
                  </span>
                  <h3
                    onClick={() => openSchemeDetail(scheme.slug)}
                    className="text-lg font-bold text-[#0F172A] hover:text-[#1E3A5F] cursor-pointer transition font-editorial mt-1"
                  >
                    {language === 'hi' ? scheme.name_hi : scheme.name}
                  </h3>
                  <p className="text-xs text-[#475569] mt-0.5">{scheme.ministry}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeSavedScheme(app.schemeId)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Remove from saved applications"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Document Preparation Checklist Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
                    Document Readiness ({app.completedDocs.length}/{scheme.documents_required.length} Prepared)
                  </span>
                  <span className="text-xs font-mono font-bold text-[#16A34A]">{app.preparationStatus}%</span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#16A34A] transition-all duration-300"
                    style={{ width: `${app.preparationStatus}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {scheme.documents_required.map((doc) => {
                    const isChecked = app.completedDocs.includes(doc.id);
                    return (
                      <div
                        key={doc.id}
                        onClick={() => toggleDocCompletion(app.schemeId, doc.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition ${
                          isChecked ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-[#475569]'
                        }`}
                      >
                        <span className="truncate pr-2">{doc.title}</span>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-[#16A34A] border-[#16A34A] text-white' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Personal Application Notes */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Personal Preparation Notes & Bank Follow-up
                </label>
                <textarea
                  rows={2}
                  value={app.notes}
                  onChange={(e) => updateApplicationNotes(app.schemeId, e.target.value)}
                  placeholder="Add notes e.g. Met DIC General Manager on Monday; quotation received from machinery supplier..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                />
              </div>

              {/* Official Action Controls */}
              <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => openSchemeDetail(scheme.slug)}
                  className="text-xs font-bold text-[#1E3A5F] hover:underline"
                >
                  View Scheme Guidelines →
                </button>

                <a
                  href={scheme.official_portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#1E3A5F] hover:bg-[#162D4A] text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>Open Official Application Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

    </div>
  );
};
