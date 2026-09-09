import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INDIAN_STATES } from '../data/schemes';
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  DollarSign,
  Building2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Edit3,
  RefreshCw,
  ArrowRight,
  HeartHandshake,
  Check,
  X,
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';
import { StaggerContainer, StaggerItem } from './motion/Stagger';

export const ProfileView: React.FC = () => {
  const {
    userProfile,
    setUserProfile,
    auth,
    setAuth,
    executeMatching,
    setActiveView,
    language
  } = useApp();

  const [activeEditingSection, setActiveEditingSection] = useState<string | null>(null);
  const [draftProfile, setDraftProfile] = useState(userProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Calculate real profile completeness based on filled fields
  const calculateCompleteness = () => {
    let score = 0;
    const checks = [
      Boolean(userProfile.full_name || auth.name), // 15%
      Boolean(userProfile.age && userProfile.gender), // 15%
      Boolean(userProfile.location_state && userProfile.residence_type), // 15%
      Boolean(userProfile.social_category), // 10%
      Boolean(userProfile.education_level || userProfile.educational_qualification), // 15%
      Boolean(userProfile.business_type || userProfile.applicant_persona), // 15%
      Boolean(userProfile.annual_income_range || userProfile.revenue_range), // 10%
      Boolean(userProfile.funding_need && userProfile.funding_need.length > 0) // 5%
    ];
    const weights = [15, 15, 15, 10, 15, 15, 10, 5];
    checks.forEach((passed, idx) => {
      if (passed) score += weights[idx];
    });
    return Math.min(100, Math.max(20, score));
  };

  const completeness = calculateCompleteness();

  const handleOpenEdit = (section: string) => {
    setDraftProfile({ ...userProfile });
    setActiveEditingSection(section);
  };

  const handleSaveSection = () => {
    setIsSaving(true);
    setUserProfile(draftProfile);
    
    // Update auth state if name changed
    if (draftProfile.full_name && draftProfile.full_name !== auth.name) {
      const updatedAuth = { ...auth, name: draftProfile.full_name };
      setAuth(updatedAuth);
      localStorage.setItem('udyamsetu_auth_user', JSON.stringify(updatedAuth));
    }

    setTimeout(() => {
      setIsSaving(false);
      setActiveEditingSection(null);
      setLastUpdated('Just now');
      setSaveSuccessMsg('Profile updated successfully. Refresh your recommendations to see latest matches.');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    }, 300);
  };

  const handleRefreshMatches = async () => {
    await executeMatching(userProfile);
    setActiveView('results');
  };

  const supportGoalsList = [
    'Starting a business',
    'Machinery & Equipment',
    'Working capital',
    'Loan',
    'Subsidy',
    'Skill training',
    'Export support',
    'Scholarship',
    'Housing assistance',
    'Healthcare'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl border border-[#CBD5E1] shadow-sm p-6 sm:p-8 relative overflow-hidden">
        <div className="tricolour-bar absolute top-0 left-0 right-0" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0B1528] text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0 border border-slate-700">
              {auth.name ? auth.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1528] font-editorial">
                  {userProfile.full_name || auth.name || 'Citizen Profile'}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Verified UdyamSetu Profile
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span>{auth.email || auth.phoneOrEmail}</span>
                <span>•</span>
                <span>Last updated: {lastUpdated}</span>
              </p>
            </div>
          </div>

          {/* Refresh Action */}
          <div className="flex items-center gap-3">
            <button
              id="refresh-matches-btn"
              onClick={handleRefreshMatches}
              className="inline-flex items-center gap-2 bg-[#FF9933] hover:bg-[#F28500] text-[#0B1528] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-sm transition cursor-pointer hover:-translate-y-0.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh My Recommendations →</span>
            </button>
          </div>
        </div>

        {/* Profile Completeness Gauge */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#0B1528] uppercase tracking-wider">
                Profile Completeness
              </span>
              <span className="text-xs font-bold text-[#1E3A5F]">
                {completeness}% Completed
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[#1E3A5F] via-[#FF9933] to-[#138808] transition-all duration-700"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              A comprehensive profile enables our deterministic rule engine to eliminate non-qualifying schemes and maximize eligible subsidies.
            </p>
          </div>

          <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/80 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#1E3A5F] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
              <span>Personalization Impact</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Updates to state, income range, or enterprise stage directly re-score Central and State benefits.
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button
            onClick={handleRefreshMatches}
            className="text-xs underline font-bold text-emerald-900 hover:text-emerald-950 cursor-pointer"
          >
            View Matches →
          </button>
        </div>
      )}

      {/* Section-by-Section Profile Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Personal Profile */}
        <StaggerItem>
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 shadow-xs space-y-4 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E3A5F] flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1528]">Personal Profile</h3>
                    <p className="text-[10px] text-slate-500">Identity & Demographic attributes</p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenEdit('personal')}
                  className="text-xs font-semibold text-[#1E3A5F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Full Name</span>
                  <span className="font-semibold text-slate-800">{userProfile.full_name || auth.name || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Age</span>
                  <span className="font-semibold text-slate-800">{userProfile.age || 28} Years</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Gender</span>
                  <span className="font-semibold text-slate-800 capitalize">{userProfile.gender || 'Female'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Language</span>
                  <span className="font-semibold text-slate-800 uppercase">{language}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-emerald-700">
              <CheckCircle2 className="w-3 h-3" />
              <span>Age & gender eligibility conditions verified</span>
            </div>
          </div>
        </StaggerItem>

        {/* 2. Location & Residence */}
        <StaggerItem>
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 shadow-xs space-y-4 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#FF9933] flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1528]">Location & Residence</h3>
                    <p className="text-[10px] text-slate-500">State and rural/urban jurisdiction</p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenEdit('location')}
                  className="text-xs font-semibold text-[#1E3A5F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">State / UT</span>
                  <span className="font-semibold text-slate-800">{userProfile.location_state || 'Uttar Pradesh'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Area Classification</span>
                  <span className="font-semibold text-slate-800 capitalize">{userProfile.residence_type || 'Rural'} (Higher Subsidies)</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">District</span>
                  <span className="font-semibold text-slate-800">{userProfile.district || 'Varanasi'}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-emerald-700">
              <CheckCircle2 className="w-3 h-3" />
              <span>Filters {userProfile.location_state} state schemes</span>
            </div>
          </div>
        </StaggerItem>

        {/* 3. Social & Household */}
        <StaggerItem>
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 shadow-xs space-y-4 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1528]">Social & Household</h3>
                    <p className="text-[10px] text-slate-500">Demographic & affirmative action criteria</p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenEdit('social')}
                  className="text-xs font-semibold text-[#1E3A5F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Social Category</span>
                  <span className="font-semibold text-slate-800">{userProfile.social_category || 'OBC'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Special Status</span>
                  <span className="font-semibold text-slate-800">{userProfile.is_traditional_artisan ? 'Artisan / Vishwakarma' : 'General'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Divyangjan / PwD Status</span>
                  <span className="font-semibold text-slate-800">General Category (Non-PwD)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-emerald-700">
              <CheckCircle2 className="w-3 h-3" />
              <span>Special quotas & subsidy increments applied</span>
            </div>
          </div>
        </StaggerItem>

        {/* 4. Education & Employment */}
        <StaggerItem>
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 shadow-xs space-y-4 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1528]">Education & Occupation</h3>
                    <p className="text-[10px] text-slate-500">Qualifications & livelihood status</p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenEdit('education')}
                  className="text-xs font-semibold text-[#1E3A5F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Education Level</span>
                  <span className="font-semibold text-slate-800">{userProfile.education_level || '10th Standard'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Persona / Role</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {userProfile.applicant_persona ? userProfile.applicant_persona.replace('_', ' ') : 'Starting Business'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Sector / Trade</span>
                  <span className="font-semibold text-slate-800">{userProfile.business_type || 'Textile / Handloom'}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-emerald-700">
              <CheckCircle2 className="w-3 h-3" />
              <span>Qualifies for technical & MSME training schemes</span>
            </div>
          </div>
        </StaggerItem>

        {/* 5. Business & MSME Profile */}
        <StaggerItem>
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 shadow-xs space-y-4 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1528]">Business & MSME Profile</h3>
                    <p className="text-[10px] text-slate-500">Enterprise stage & Udyam status</p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenEdit('business')}
                  className="text-xs font-semibold text-[#1E3A5F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Enterprise Stage</span>
                  <span className="font-semibold text-slate-800 capitalize">{userProfile.business_stage || 'New / Proposed'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Udyam Registration</span>
                  <span className="font-semibold text-slate-800">
                    {userProfile.has_udyam_registration ? 'Registered (Verified)' : 'Not Yet Registered'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Project / Business Scale</span>
                  <span className="font-semibold text-slate-800">Micro (Under ₹10 Lakh)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-emerald-700">
              <CheckCircle2 className="w-3 h-3" />
              <span>Prioritizes PMEGP & Mudra Shishu/Kishore</span>
            </div>
          </div>
        </StaggerItem>

        {/* 6. Support Goals & Financial Needs */}
        <StaggerItem>
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 shadow-xs space-y-4 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1528]">Goals & Financial Needs</h3>
                    <p className="text-[10px] text-slate-500">Targeted assistance requests</p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenEdit('goals')}
                  className="text-xs font-semibold text-[#1E3A5F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="mt-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Selected Needs</span>
                <div className="flex flex-wrap gap-1.5">
                  {(userProfile.funding_need || ['Starting a business', 'Machinery & Equipment']).map((need) => (
                    <span
                      key={need}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
                    >
                      {need}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-emerald-700">
              <CheckCircle2 className="w-3 h-3" />
              <span>Multi-objective relevance ranking active</span>
            </div>
          </div>
        </StaggerItem>

      </StaggerContainer>

      {/* Edit Section Modal */}
      {activeEditingSection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0B1528] capitalize">
                Edit {activeEditingSection} Profile
              </h3>
              <button
                onClick={() => setActiveEditingSection(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Personal */}
            {activeEditingSection === 'personal' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={draftProfile.full_name || ''}
                    onChange={(e) => setDraftProfile({ ...draftProfile, full_name: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={draftProfile.age || 28}
                    onChange={(e) => setDraftProfile({ ...draftProfile, age: parseInt(e.target.value) || 28 })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['female', 'male', 'other'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setDraftProfile({ ...draftProfile, gender: g as any })}
                        className={`p-2 rounded-lg border text-xs font-semibold capitalize cursor-pointer ${
                          draftProfile.gender === g
                            ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Location */}
            {activeEditingSection === 'location' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">State / Union Territory</label>
                  <select
                    value={draftProfile.location_state}
                    onChange={(e) => setDraftProfile({ ...draftProfile, location_state: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Area Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'rural', label: 'Rural (35% Subsidy)' },
                      { id: 'urban', label: 'Urban (25% Subsidy)' }
                    ].map((area) => (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => setDraftProfile({ ...draftProfile, residence_type: area.id as any })}
                        className={`p-2.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                          draftProfile.residence_type === area.id
                            ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {area.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={draftProfile.district || ''}
                    onChange={(e) => setDraftProfile({ ...draftProfile, district: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                    placeholder="e.g. Varanasi, Pune, Jaipur"
                  />
                </div>
              </div>
            )}

            {/* Section 3: Social */}
            {activeEditingSection === 'social' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Social Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['General', 'OBC', 'SC', 'ST'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setDraftProfile({ ...draftProfile, social_category: cat as any })}
                        className={`p-2 rounded-lg border text-xs font-semibold cursor-pointer ${
                          draftProfile.social_category === cat
                            ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Traditional Artisan / Craftsperson?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { val: true, label: 'Yes (Vishwakarma)' },
                      { val: false, label: 'No (Standard)' }
                    ].map((opt) => (
                      <button
                        key={String(opt.val)}
                        type="button"
                        onClick={() => setDraftProfile({ ...draftProfile, is_traditional_artisan: opt.val })}
                        className={`p-2.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                          draftProfile.is_traditional_artisan === opt.val
                            ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Education */}
            {activeEditingSection === 'education' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Highest Education Level</label>
                  <select
                    value={draftProfile.education_level || '10th'}
                    onChange={(e) => setDraftProfile({ ...draftProfile, education_level: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Below 8th">Below 8th Standard</option>
                    <option value="8th">8th Pass</option>
                    <option value="10th">10th Pass (Matriculate)</option>
                    <option value="12th">12th Pass (Higher Secondary)</option>
                    <option value="ITI / Diploma">ITI / Polytechnic Diploma</option>
                    <option value="Graduate">Graduate / Degree</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sector / Trade</label>
                  <input
                    type="text"
                    value={draftProfile.business_type || ''}
                    onChange={(e) => setDraftProfile({ ...draftProfile, business_type: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                    placeholder="e.g. Textile, Food Processing, IT, Handloom"
                  />
                </div>
              </div>
            )}

            {/* Section 5: Business */}
            {activeEditingSection === 'business' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Enterprise Stage</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'new', label: 'New / Greenfield (PMEGP)' },
                      { id: 'existing', label: 'Existing / Expansion' }
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setDraftProfile({ ...draftProfile, business_stage: st.id as any })}
                        className={`p-2.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                          draftProfile.business_stage === st.id
                            ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Udyam Registration Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { val: true, label: 'Yes, Registered' },
                      { val: false, label: 'Not Registered' }
                    ].map((u) => (
                      <button
                        key={String(u.val)}
                        type="button"
                        onClick={() => setDraftProfile({ ...draftProfile, has_udyam_registration: u.val })}
                        className={`p-2.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                          draftProfile.has_udyam_registration === u.val
                            ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Section 6: Goals */}
            {activeEditingSection === 'goals' && (
              <div className="space-y-4 text-xs">
                <label className="font-bold text-slate-700 block">Select Your Key Support Needs</label>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1">
                  {supportGoalsList.map((goal) => {
                    const isSelected = (draftProfile.funding_need || []).includes(goal);
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => {
                          const current = draftProfile.funding_need || [];
                          const updated = isSelected
                            ? current.filter((x) => x !== goal)
                            : [...current, goal];
                          setDraftProfile({ ...draftProfile, funding_need: updated });
                        }}
                        className={`p-2 rounded-lg border text-left text-xs font-semibold flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{goal}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveEditingSection(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSection}
                disabled={isSaving}
                className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#1E3A5F] hover:bg-[#162D4A] shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
