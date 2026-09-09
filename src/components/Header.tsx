import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  MapPin,
  Scale,
  BookmarkCheck,
  Bot,
  ShieldAlert,
  Globe,
  Zap,
  Menu,
  X,
  User,
  Shield,
  Layers,
  Sparkles,
  Server,
  ChevronDown,
  LogIn,
  UserPlus,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  onOpenLogin: (mode?: 'login' | 'register') => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLogin }) => {
  const {
    language,
    setLanguage,
    dataSaver,
    setDataSaver,
    isBackendOnline,
    auth,
    logout,
    activeView,
    setActiveView,
    comparedSchemeIds,
    savedApplications,
    loadDemoProfile,
    executeMatching
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoProfiles, setShowDemoProfiles] = useState(false);
  const [showMoreNav, setShowMoreNav] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  interface NavItem {
    id: string;
    label: string;
    icon: any;
    highlight?: boolean;
    badge?: number | null;
  }

  // Core citizen navigation items (always visible on desktop)
  const primaryNavItems: NavItem[] = [
    { id: 'match', label: language === 'hi' ? 'पात्रता खोजें' : 'Find Schemes', icon: Search, highlight: true },
    { id: 'schemes', label: language === 'hi' ? 'सभी योजनाएं' : 'Browse Schemes', icon: Layers },
    { id: 'states', label: language === 'hi' ? 'राज्यवार' : 'States', icon: MapPin },
    { id: 'compare', label: language === 'hi' ? 'तुलना करें' : 'Compare', icon: Scale, badge: comparedSchemeIds.length > 0 ? comparedSchemeIds.length : null },
    { id: 'dashboard', label: language === 'hi' ? 'मेरे आवेदन' : 'My Applications', icon: BookmarkCheck, badge: savedApplications.length > 0 ? savedApplications.length : null },
    { id: 'ask', label: language === 'hi' ? 'उद्यमसेतु AI' : 'Ask AI', icon: Bot }
  ];

  // Secondary/system items grouped under "More"
  const secondaryNavItems: NavItem[] = [
    { id: 'how-it-works', label: language === 'hi' ? 'ट्रस्ट सेंटर' : 'Trust Center', icon: Shield, badge: null },
    { id: 'admin', label: language === 'hi' ? 'गवर्नेंस' : 'Governance', icon: ShieldAlert, badge: null },
    { id: 'motion-lab', label: 'Motion Lab', icon: Sparkles, badge: null }
  ];

  const allNavItems: NavItem[] = [...primaryNavItems, ...secondaryNavItems];

  const handleNavClick = (viewId: any) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
    setShowMoreNav(false);
    setShowUserMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDemoProfile = (persona: string) => {
    setShowDemoProfiles(false);
    if (persona === 'savitri') {
      loadDemoProfile({
        location_state: 'Uttar Pradesh',
        district: 'Varanasi',
        applicant_persona: 'artisan',
        business_type: 'Textile',
        funding_need: ['Starting a business', 'Machinery & Equipment', 'Subsidy'],
        business_size_range: 'micro_under_10l',
        age: 28,
        gender: 'female',
        social_category: 'OBC',
        business_stage: 'new',
        is_street_vendor: false,
        is_traditional_artisan: true,
        has_udyam_registration: false
      });
    } else if (persona === 'rajesh') {
      loadDemoProfile({
        location_state: 'Maharashtra',
        district: 'Pune',
        applicant_persona: 'starting_business',
        business_type: 'Food',
        funding_need: ['Working capital', 'Machinery & Equipment', 'Loan'],
        business_size_range: 'small_10l_50l',
        age: 34,
        gender: 'male',
        social_category: 'General',
        business_stage: 'new',
        is_street_vendor: false,
        is_traditional_artisan: false,
        has_udyam_registration: true
      });
    } else if (persona === 'vendor') {
      loadDemoProfile({
        location_state: 'Delhi',
        district: 'Central Delhi',
        applicant_persona: 'street_vendor',
        business_type: 'Retail',
        funding_need: ['Working capital', 'Loan'],
        business_size_range: 'nano_under_1l',
        age: 42,
        gender: 'male',
        social_category: 'OBC',
        business_stage: 'existing',
        is_street_vendor: true,
        is_traditional_artisan: false,
        has_udyam_registration: false
      });
    }
    setActiveView('match');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
      {/* 1. Thin Tricolour Line on Header Top Edge (Identity Element) */}
      <div className="tricolour-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Product Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            {/* National Identity Icon */}
            <div className="w-8 h-8 rounded border border-slate-300 bg-white flex flex-col overflow-hidden shadow-xs shrink-0">
              <div className="h-2.5 bg-[#FF9933]" />
              <div className="h-3 bg-white flex items-center justify-center relative">
                <div className="w-2 h-2 rounded-full border-[0.6px] border-[#000080]" />
              </div>
              <div className="h-2.5 bg-[#138808]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[#0F172A] font-editorial">
                  UdyamSetu
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1E3A5F]/10 text-[#1E3A5F] px-1.5 py-0.5 rounded">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-[#475569] hidden sm:block leading-none">
                {language === 'hi'
                  ? 'सही योजना। सही सहयोग। सही अवसर।'
                  : 'The right scheme. The right support. The right opportunity.'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation: Core Citizen Flows */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                    item.highlight && !isActive
                      ? 'bg-[#1E3A5F] text-white hover:bg-[#162D4A] shadow-xs'
                      : isActive
                      ? 'bg-[#E2E8F0] text-[#0F172A]'
                      : 'text-[#475569] hover:text-[#0F172A] hover:bg-black/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#F97316] text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* "More" Navigation Dropdown for Secondary Portals */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMoreNav(!showMoreNav)}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                  secondaryNavItems.some((s) => s.id === activeView)
                    ? 'bg-[#E2E8F0] text-[#0F172A]'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-black/5'
                }`}
              >
                <span>{language === 'hi' ? 'अन्य' : 'More'}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showMoreNav && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2 transition ${
                          isActive ? 'bg-[#1E3A5F]/10 text-[#1E3A5F]' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Utility Toolbar: Backend Status + Demo Profiles + Language + Citizen Auth Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Backend Connectivity Status Indicator */}
            {isBackendOnline ? (
              <span
                title="Connected to Python FastAPI 2.2 Backend"
                className="hidden 2xl:inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            ) : (
              <span
                title="Running in client-side fallback mode"
                className="hidden 2xl:inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Offline
              </span>
            )}

            {/* Quick SIH Demo Showcase Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDemoProfiles(!showDemoProfiles)}
                className="flex items-center gap-1 text-xs font-bold bg-[#FF9933]/10 hover:bg-[#FF9933]/20 text-[#B45309] border border-[#FF9933]/30 px-2 py-1.5 rounded-md transition cursor-pointer"
                title="1-Click SIH Judge Showcase Profiles"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                <span className="hidden md:inline">Demo</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showDemoProfiles && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 text-left animate-in fade-in duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Load 30-Second SIH Judge Persona
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectDemoProfile('savitri')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 transition border-b border-slate-100"
                  >
                    <div className="text-xs font-bold text-slate-800">1. Savitri Devi (UP Artisan)</div>
                    <div className="text-[11px] text-slate-500">Woman Weaver • Vishwakarma & PMEGP (35%)</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDemoProfile('rajesh')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 transition border-b border-slate-100"
                  >
                    <div className="text-xs font-bold text-slate-800">2. Rajesh Deshmukh (MH Startup)</div>
                    <div className="text-[11px] text-slate-500">Food Processing • PMEGP & Mudra Tarun</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDemoProfile('vendor')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 transition"
                  >
                    <div className="text-xs font-bold text-slate-800">3. Ramesh Gupta (Delhi Vendor)</div>
                    <div className="text-[11px] text-slate-500">Street Vendor • PM SVANidhi Credit</div>
                  </button>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center text-xs font-semibold bg-white border border-[#CBD5E1] rounded-md p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded transition text-[11px] ${
                  language === 'en' ? 'bg-[#1E3A5F] text-white' : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded transition text-[11px] ${
                  language === 'hi' ? 'bg-[#1E3A5F] text-white' : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* User Auth: Sign In & Register Buttons (Always Prominent & Visible) */}
            {auth.isAuthenticated ? (
              <div className="relative">
                <button
                  id="header-user-profile-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3A5F] bg-[#1E3A5F]/10 hover:bg-[#1E3A5F]/15 px-2.5 py-1.5 rounded-lg transition cursor-pointer border border-[#1E3A5F]/20 shadow-2xs"
                  title="Citizen Profile Details"
                >
                  <User className="w-3.5 h-3.5 text-[#F97316]" />
                  <span className="max-w-[100px] truncate font-bold">{auth.name}</span>
                  {auth.social_category && (
                    <span className="hidden sm:inline-block text-[10px] bg-white text-[#1E3A5F] px-1 py-0.2 rounded font-mono font-bold border border-slate-200">
                      {auth.social_category}
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <p className="text-xs font-bold text-slate-900">{auth.name}</p>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{auth.email || auth.phoneOrEmail}</p>
                      <div className="flex gap-2 mt-1.5 text-[10px] text-slate-600 bg-slate-50 px-2 py-1 rounded">
                        {auth.age && <span>Age: {auth.age}</span>}
                        {auth.social_category && <span>• Cat: {auth.social_category}</span>}
                        {auth.gender && <span>• {auth.gender}</span>}
                      </div>
                    </div>
                    <button
                      id="header-my-profile-btn"
                      onClick={() => {
                        setShowUserMenu(false);
                        handleNavClick('profile');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[#1E3A5F]" />
                      <span>{language === 'hi' ? 'मेरी प्रोफ़ाइल (संपादित करें)' : 'My UdyamSetu Profile'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleNavClick('match');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#1E3A5F] hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 text-[#F97316]" />
                      <span>{language === 'hi' ? 'पात्रता खोजें' : 'Find Schemes (Pre-filled Profile)'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleNavClick('dashboard');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <BookmarkCheck className="w-3.5 h-3.5 text-slate-500" />
                      <span>{language === 'hi' ? 'मेरे आवेदन' : 'My Applications'}</span>
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      id="header-logout-btn"
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-1.5">
                {/* 1. Sign In Button -> Opens top Sign In modal or navigates to login */}
                <button
                  id="header-signin-btn"
                  onClick={() => onOpenLogin('login')}
                  className="flex items-center gap-1 text-xs font-bold text-[#1E3A5F] bg-white hover:bg-slate-50 border border-[#1E3A5F] px-2.5 sm:px-3 py-1.5 rounded-md transition cursor-pointer shadow-2xs"
                  title="Citizen Sign In"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#1E3A5F]" />
                  <span>{language === 'hi' ? 'लॉगिन' : 'Sign In'}</span>
                </button>

                {/* 2. Register Button -> Opens top Registration modal or navigates to register */}
                <button
                  id="header-register-btn"
                  onClick={() => onOpenLogin('register')}
                  className="flex items-center gap-1 text-xs font-bold text-white bg-[#1E3A5F] hover:bg-[#162D4A] px-2.5 sm:px-3 py-1.5 rounded-md transition cursor-pointer shadow-2xs"
                  title="Create Your Account"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#F97316]" />
                  <span className="hidden sm:inline">{language === 'hi' ? 'खाता बनाएं' : 'Register'}</span>
                  <span className="sm:hidden">{language === 'hi' ? 'पंजीकरण' : 'Join'}</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#475569] hover:text-[#0F172A] hover:bg-black/5 rounded-md cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 px-2 border-t border-slate-200 bg-white/95 backdrop-blur-md rounded-b-lg space-y-2">
            {/* Quick Auth buttons in mobile menu */}
            {!auth.isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin('login');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-[#1E3A5F] border border-[#1E3A5F] rounded-lg"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin('register');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-[#1E3A5F] rounded-lg"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>Create Account</span>
                </button>
              </div>
            ) : (
              <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#F97316]" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{auth.name}</p>
                    <p className="text-[10px] text-slate-500">{auth.email || auth.phoneOrEmail}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-xs font-semibold text-red-600 underline"
                >
                  Logout
                </button>
              </div>
            )}

            {allNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md ${
                    isActive ? 'bg-[#1E3A5F] text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] bg-[#F97316] text-white font-bold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
