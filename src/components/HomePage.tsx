/**
 * UdyamSetu World-Class Landing Page
 * Inspired by official myScheme.gov.in UX/UI architecture with Digital India + AI-SaaS engineering.
 * 10 Core Sections: Full-Width Hero -> Personalized Finder -> Category Grid -> State Explorer ->
 * Central Ministries -> 3-Step How It Works -> Trust Policy -> Ask AI -> Flagship Schemes -> Final CTA.
 */
import React, { useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useApp } from '../context/AppContext';
import { useMotion } from '../motion/MotionProvider';
import { HeroCarousel } from './HeroCarousel';
import { Reveal } from './motion/Reveal';
import { RevealCard } from './motion/RevealCard';
import { StaggerContainer, StaggerItem } from './motion/Stagger';
import { AnimatedCounter } from './motion/AnimatedCounter';
import { MagneticButton } from './motion/MagneticButton';
import { INDIAN_STATES, FLAGSHIP_SCHEMES } from '../data/schemes';
import { TrustBadge } from './TrustBadge';
import {
  Search,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Bot,
  MapPin,
  Building2,
  GraduationCap,
  Sprout,
  Users,
  Cpu,
  HeartPulse,
  Home,
  Briefcase,
  Layers,
  FileCheck,
  Scale,
  Award,
  Zap,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const HomePage: React.FC = () => {
  const { setActiveView, setUserProfile, userProfile, language, openSchemeDetail } = useApp();
  const { isReducedMotion } = useMotion();

  // Quick search state
  const [searchInput, setSearchInput] = useState('');

  // 3-Step Quick Finder State
  const [finderPersona, setFinderPersona] = useState<string>('existing_entrepreneur');
  const [finderState, setFinderState] = useState<string>('Uttar Pradesh');
  const [finderNeed, setFinderNeed] = useState<string>('Loan');

  // Intelligence Awakening visual pipeline step
  const [activePipelineStep, setActivePipelineStep] = useState<1 | 2 | 3 | 4>(1);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      setActiveView('schemes');
    } else {
      setActiveView('schemes');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch Personalised Search from 3-step Finder
  const handleLaunchPersonalizedSearch = () => {
    setUserProfile({
      ...userProfile,
      applicant_persona: finderPersona,
      location_state: finderState,
      funding_need: [finderNeed, 'Subsidy']
    });
    setActiveView('match');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 12 myScheme-Inspired Government Categories
  const categories = [
    {
      id: 'agriculture',
      nameEn: 'Agriculture, Rural & Dairy',
      nameHi: 'कृषि, ग्रामीण एवं डेयरी',
      descEn: 'Solar pumps, agri-infrastructure grants, KCC credit, and dairy unit subsidies',
      descHi: 'सोलर पंप, कृषि बुनियादी ढांचा अनुदान, किसान क्रेडिट व डेयरी सब्सिडी',
      count: '420+ Schemes',
      icon: Sprout,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      sector: 'Agriculture'
    },
    {
      id: 'business_msme',
      nameEn: 'Business, MSME & Startups',
      nameHi: 'व्यापार, एमएसएमई एवं स्टार्टअप',
      descEn: 'Collateral-free loans, 35% capital subsidy under PMEGP, and CGTMSE guarantee',
      descHi: 'बिना गारंटी बैंक ऋण, 35% तक पूंजीगत सब्सिडी और सीजीटीएमएसई गारंटी',
      count: '510+ Schemes',
      icon: Building2,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      sector: 'Manufacturing'
    },
    {
      id: 'education',
      nameEn: 'Education, Scholarships & Skill',
      nameHi: 'शिक्षा, छात्रवृत्ति एवं कौशल',
      descEn: 'Merit DBT scholarships, fee waivers, PMKVY training stipends, and higher ed grants',
      descHi: 'मेधावी डीबीटी छात्रवृत्तियां, शुल्क छूट, कौशल प्रशिक्षण व उच्च शिक्षा अनुदान',
      count: '310+ Schemes',
      icon: GraduationCap,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
      sector: 'Services'
    },
    {
      id: 'banking_loans',
      nameEn: 'Banking, Financial Services & Credit',
      nameHi: 'बैंकिंग, वित्तीय सेवाएं एवं ऋण',
      descEn: 'Pradhan Mantri Mudra Yojana, Stand-Up India, credit subvention, and working capital',
      descHi: 'प्रधानमंत्री मुद्रा योजना, स्टैंड-अप इंडिया, ब्याज अनुदान व कार्यशील पूंजी',
      count: '380+ Schemes',
      icon: Zap,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      sector: 'Retail'
    },
    {
      id: 'women_child',
      nameEn: 'Women, Youth & Child Development',
      nameHi: 'महिला, युवा एवं बाल विकास',
      descEn: '75% machinery grants for women collectives, incubation funds, and SHG credit',
      descHi: 'महिला समूहों के लिए 75% तक मशीनरी अनुदान, स्टार्टअप फंड व एसएचजी ऋण',
      count: '240+ Schemes',
      icon: Users,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      sector: 'Textile'
    },
    {
      id: 'social_welfare',
      nameEn: 'Social Welfare & Empowerment',
      nameHi: 'सामाजिक कल्याण एवं सशक्तीकरण',
      descEn: 'PM Vishwakarma toolkits, Divyangjan support, SC/ST entrepreneur schemes',
      descHi: 'पीएम विश्वकर्मा टूलकिट अनुदान, दिव्यांगजन सहयोग, एससी/एसटी उद्यमी योजनाएं',
      count: '280+ Schemes',
      icon: Award,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      sector: 'Handicraft'
    },
    {
      id: 'health_wellness',
      nameEn: 'Health, Wellness & Sanitation',
      nameHi: 'स्वास्थ्य, कल्याण एवं स्वच्छता',
      descEn: 'Ayushman Bharat coverage, medical equipment grants, and rural hygiene programs',
      descHi: 'आयुष्मान भारत सुरक्षा, चिकित्सा उपकरण अनुदान व ग्रामीण स्वच्छता कार्यक्रम',
      count: '150+ Schemes',
      icon: HeartPulse,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      sector: 'Services'
    },
    {
      id: 'housing_shelter',
      nameEn: 'Housing & Urban Development',
      nameHi: 'आवास एवं शहरी विकास',
      descEn: 'PMAY interest subsidies, rural home construction support, and civic infrastructure',
      descHi: 'पीएम आवास ब्याज सब्सिडी, ग्रामीण आवास निर्माण सहायता व नागरिक सुविधाएं',
      count: '95+ Schemes',
      icon: Home,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
      sector: 'Construction'
    },
    {
      id: 'skills_employment',
      nameEn: 'Skills, Employment & Livelihood',
      nameHi: 'कौशल, रोजगार एवं आजीविका',
      descEn: 'Apprenticeship stipends, street vendor working capital under PM SVANidhi',
      descHi: 'प्रशिक्षुता मानदेय, पीएम स्वनिधि के तहत स्ट्रीट वेंडर्स कार्यशील पूंजी ऋण',
      count: '190+ Schemes',
      icon: Briefcase,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      sector: 'Retail'
    },
    {
      id: 'science_tech',
      nameEn: 'Science, IT & Innovation',
      nameHi: 'विज्ञान, आईटी एवं नवाचार',
      descEn: 'BIRAC biotech grants, AI startup seed funds, and intellectual property rebates',
      descHi: 'जैव प्रौद्योगिकी अनुदान, एआई स्टार्टअप सीड फंड व पेटेंट शुल्क छूट',
      count: '110+ Schemes',
      icon: Cpu,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      sector: 'Services'
    },
    {
      id: 'transport_infra',
      nameEn: 'Transport, Logistics & Trade',
      nameHi: 'परिवहन, लॉजिस्टिक्स एवं व्यापार',
      descEn: 'Electric vehicle subsidies, commercial transport credit, and cold-chain logistics',
      descHi: 'ई-वाहन सब्सिडी, वाणिज्यिक परिवहन ऋण व कोल्ड-चेन बुनियादी ढांचा',
      count: '85+ Schemes',
      icon: TrendingUp,
      color: 'text-slate-700 bg-slate-100 border-slate-300',
      sector: 'Logistics'
    },
    {
      id: 'artisan_crafts',
      nameEn: 'Artisans & Traditional Crafts',
      nameHi: 'कारीगर एवं पारंपरिक शिल्प',
      descEn: 'PM Vishwakarma ₹15,000 modern toolkit incentive, 5% collateral-free loans',
      descHi: 'पीएम विश्वकर्मा ₹15,000 आधुनिक टूलकिट प्रोत्साहन व 5% ब्याज पर ऋण',
      count: '130+ Schemes',
      icon: Sparkles,
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      sector: 'Handicraft'
    }
  ];

  // Central Ministries
  const centralMinistries = [
    {
      name: 'Ministry of Micro, Small and Medium Enterprises',
      nameHi: 'सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय (MSME)',
      schemesCount: '140+ Schemes',
      flagship: 'PMEGP, CGTMSE, MSE-CDP, SFURTI',
      icon: Building2
    },
    {
      name: 'Ministry of Agriculture and Farmers Welfare',
      nameHi: 'कृषि एवं किसान कल्याण मंत्रालय',
      schemesCount: '95+ Schemes',
      flagship: 'PM-Kisan, PM-KUSUM Solar, AIF, MIDH',
      icon: Sprout
    },
    {
      name: 'Ministry of Finance',
      nameHi: 'वित्त मंत्रालय',
      schemesCount: '80+ Schemes',
      flagship: 'Pradhan Mantri Mudra Yojana, Stand-Up India',
      icon: Zap
    },
    {
      name: 'Ministry of Education',
      nameHi: 'शिक्षा मंत्रालय',
      schemesCount: '110+ Schemes',
      flagship: 'National Scholarship Portal, PM-USHA',
      icon: GraduationCap
    },
    {
      name: 'Ministry of Skill Development & Entrepreneurship',
      nameHi: 'कौशल विकास एवं उद्यमिता मंत्रालय',
      schemesCount: '70+ Schemes',
      flagship: 'PMKVY 4.0, PM Vishwakarma, NAPS',
      icon: Award
    },
    {
      name: 'Ministry of Women and Child Development',
      nameHi: 'महिला एवं बाल विकास मंत्रालय',
      schemesCount: '65+ Schemes',
      flagship: 'Mission Shakti, PM Matru Vandana, STEP',
      icon: Users
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* ---------------- SECTION 01: Full-Width 6-Slide Hero Carousel ---------------- */}
      <HeroCarousel />

      {/* ---------------- SECTION 02: "Find Schemes Made For You" (Search & 3-Step Finder) ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-30">
        <Reveal variant="fade-up">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-8">
            
            {/* Top Search Bar (myScheme Style) */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-[#1E3A5F] tracking-wider uppercase flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-[#FF9933]" />
                  <span>{language === 'hi' ? 'त्वरित योजना खोज' : 'INSTANT SCHEME SEARCH'}</span>
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  2,066+ Verified Central & State Programs
                </span>
              </div>

              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={
                    language === 'hi'
                      ? 'योजना का नाम, कीवर्ड, व्यवसाय या लाभ से खोजें (जैसे: PMEGP, मुद्रा, छात्रवृत्ति, सोलर पंप)...'
                      : 'Search government schemes by name, keyword, trade, or benefit (e.g., PMEGP, Mudra, Scholarship, Solar Pump)...'
                  }
                  className="w-full pl-12 pr-32 py-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#1E3A5F] text-slate-900 placeholder:text-slate-400 text-sm sm:text-base transition duration-200 focus:outline-hidden focus:ring-2 focus:ring-[#1E3A5F]/20 shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-6 py-2.5 bg-[#1E3A5F] hover:bg-[#162D4A] text-white text-xs sm:text-sm font-bold rounded-xl transition duration-200 flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>{language === 'hi' ? 'खोजें' : 'Search'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Popular Search Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
                <span className="font-bold text-slate-700">{language === 'hi' ? 'लोकप्रिय खोज:' : 'Trending:'}</span>
                {['PMEGP Loan', 'PM Mudra', 'PM Vishwakarma', 'Merit Scholarship', 'Stand-Up India', 'Solar Irrigation', 'Women Subsidy'].map((tag, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSearchInput(tag);
                      setActiveView('schemes');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200/80 pt-6">
              
              {/* 3-Step Guided Personalization Intake */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                <div className="lg:col-span-4 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Personalized Scheme Matcher</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-editorial text-[#0F172A]">
                    {language === 'hi' ? 'अपने लिए अनुकूलित योजनाएं खोजें' : 'Find Schemes Made For You'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Select your profile, state, and primary financial goal to instantly launch pre-seeded eligibility evaluation.
                  </p>
                </div>

                {/* 3 Step Selectors */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Step 1: Persona */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <label className="text-[11px] font-mono font-bold text-[#1E3A5F] block uppercase">
                      1. Who are you?
                    </label>
                    <select
                      value={finderPersona}
                      onChange={(e) => setFinderPersona(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#1E3A5F]"
                    >
                      <option value="existing_entrepreneur">Small Business / MSME</option>
                      <option value="starting_business">Aspiring Entrepreneur</option>
                      <option value="artisan">Artisan / Traditional Craft</option>
                      <option value="farmer_dairy">Farmer / Dairy Owner</option>
                      <option value="student">Student / Scholar</option>
                      <option value="street_vendor">Street Vendor</option>
                    </select>
                  </div>

                  {/* Step 2: State */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <label className="text-[11px] font-mono font-bold text-[#1E3A5F] block uppercase">
                      2. Your State / UT
                    </label>
                    <select
                      value={finderState}
                      onChange={(e) => setFinderState(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#1E3A5F]"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st.id} value={st.name}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Step 3: Need */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <label className="text-[11px] font-mono font-bold text-[#1E3A5F] block uppercase">
                      3. Primary Need
                    </label>
                    <select
                      value={finderNeed}
                      onChange={(e) => setFinderNeed(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#1E3A5F]"
                    >
                      <option value="Loan">Bank Loan / Credit</option>
                      <option value="Subsidy">Capital Subsidy Grant</option>
                      <option value="Machinery & Equipment">Machinery & Toolkits</option>
                      <option value="Scholarship">Scholarship / Fee Waiver</option>
                      <option value="Working capital">Working Capital</option>
                    </select>
                  </div>

                </div>

              </div>

              {/* Launcher Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleLaunchPersonalizedSearch}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#FF9933] hover:bg-[#E68A00] text-slate-950 font-bold text-sm rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>{language === 'hi' ? 'व्यक्तिगत खोज शुरू करें →' : 'Start Personalised Search →'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </Reveal>
      </section>

      {/* ---------------- SECTION 03: "Explore Government Schemes" by Category (12 Cards) ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal variant="fade-up" className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] font-mono">
              {language === 'hi' ? 'श्रेणीवार योजनाएं' : 'SCHEME CATEGORIES'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#0F172A] font-editorial">
              {language === 'hi' ? 'सरकारी योजनाओं का अन्वेषण करें' : 'Explore Government Schemes'}
            </h2>
            <p className="text-sm text-[#475569]">
              Discover programs categorized across agricultural, commercial, educational and social welfare sectors.
            </p>
          </div>

          <button
            onClick={() => setActiveView('schemes')}
            className="text-xs font-bold text-[#1E3A5F] hover:underline flex items-center gap-1 cursor-pointer transition shrink-0"
          >
            <span>Browse All 2,066+ Schemes →</span>
          </button>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat, idx) => {
            const CatIcon = cat.icon;
            return (
              <RevealCard
                key={cat.id}
                delay={idx * 0.04}
                onClick={() => {
                  setActiveView('schemes');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#1E3A5F] p-5 shadow-xs transition group flex flex-col justify-between h-full cursor-pointer hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border ${cat.color}`}>
                      <CatIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {cat.count}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#1E3A5F] transition font-editorial leading-snug">
                    {language === 'hi' ? cat.nameHi : cat.nameEn}
                  </h3>

                  <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
                    {language === 'hi' ? cat.descHi : cat.descEn}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1E3A5F]">
                  <span>Explore Schemes</span>
                  <ChevronRight className="w-4 h-4 card-action-icon transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </RevealCard>
            );
          })}
        </div>
      </section>

      {/* ---------------- SECTION 04: "Explore by State" ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal variant="fade-left" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] font-mono">
              STATE-SPECIFIC SUPPORT
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-editorial">
              Explore Support by Indian State & UT
            </h2>
            <p className="text-xs sm:text-sm text-[#475569]">
              Access state-specific capital subsidies, industrial policies, and localized grants.
            </p>
          </div>

          <button
            onClick={() => setActiveView('states')}
            className="text-xs font-bold text-[#1E3A5F] hover:underline flex items-center gap-1 self-start sm:self-center cursor-pointer transition"
          >
            <span>View All 36 States & UTs →</span>
          </button>
        </Reveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INDIAN_STATES.slice(0, 8).map((st) => (
            <StaggerItem key={st.id}>
              <RevealCard
                onClick={() => {
                  setUserProfile({ ...userProfile, location_state: st.name });
                  setActiveView('states');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:border-[#1E3A5F] transition shadow-xs space-y-3 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#0F172A] group-hover:text-[#1E3A5F] transition">{st.name}</span>
                  <span className="text-xs font-mono font-bold text-[#1E3A5F] bg-blue-50 px-2 py-0.5 rounded">
                    {st.total_schemes}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">{st.name_hi}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#64748B]">
                  <span>{st.state_schemes} State Subsidies</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 card-action-icon transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </RevealCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ---------------- SECTION 05: Central Government Ministries ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal variant="fade-up" className="space-y-1 mb-8 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A5F] font-mono">
            UNION GOVERNMENT DEPARTMENTS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-editorial">
            Central Ministry Scheme Repositories
          </h2>
          <p className="text-xs sm:text-sm text-[#475569]">
            Direct statutory guidelines, budget outlays, and online portals from key Central Ministries.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {centralMinistries.map((min, idx) => {
            const MinIcon = min.icon;
            return (
              <RevealCard
                key={idx}
                delay={idx * 0.05}
                onClick={() => {
                  setActiveView('schemes');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#1E3A5F] p-6 shadow-xs transition group space-y-3 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-[#1E3A5F] group-hover:bg-[#1E3A5F] group-hover:text-white transition">
                    <MinIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {min.schemesCount}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#1E3A5F] transition font-editorial leading-snug">
                  {min.name}
                </h3>

                <p className="text-xs text-slate-500 font-mono">
                  {min.nameHi}
                </p>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <span className="font-bold text-slate-700">Flagship: </span>
                  <span>{min.flagship}</span>
                </div>
              </RevealCard>
            );
          })}
        </div>
      </section>

      {/* ---------------- SECTION 06: "How UdyamSetu Works" (5-Step Intelligence Workflow) ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal variant="fade-up">
          <div className="bg-[#0F172A] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-slate-800 space-y-10">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-bold border border-blue-500/20">
                <Cpu className="w-3.5 h-3.5 text-[#FF9933]" />
                <span>INTELLIGENCE WORKFLOW</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-editorial text-white tracking-tight">
                How UdyamSetu Works
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Strict statutory logic combined with explainable AI ensures zero probabilistic hallucination.
              </p>
            </div>

            {/* 5 Step Process Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
              
              {/* Step 1 */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#FF9933] bg-[#FF9933]/10 px-2 py-0.5 rounded-full border border-[#FF9933]/20">
                      01
                    </span>
                    <span className="text-xl">📝</span>
                  </div>
                  <h3 className="text-sm font-bold font-editorial text-white">Tell us about yourself</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    2-minute intuitive profile intake capturing location, trade, and financial goals.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                  Input Layer
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      02
                    </span>
                    <span className="text-xl">⚡</span>
                  </div>
                  <h3 className="text-sm font-bold font-editorial text-white">UdyamSetu checks eligibility</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Deterministic rule matrix scores age, stage, and domicile into 3 strict tiers.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-400">
                  Zero Hallucination
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-sky-500/30 space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded-full border border-[#38BDF8]/20">
                      03
                    </span>
                    <span className="text-xl">🎯</span>
                  </div>
                  <h3 className="text-sm font-bold font-editorial text-white">AI ranks your opportunities</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Trade-affinity ranking elevates top programs by funding sizing and sector match.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-[#38BDF8]">
                  Trade Ranking
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                      04
                    </span>
                    <span className="text-xl">🔍</span>
                  </div>
                  <h3 className="text-sm font-bold font-editorial text-white">Understand why you qualify</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Plain-language explainability and official gazette citations.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-purple-400">
                  Explainable
                </div>
              </div>

              {/* Step 5 */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#FF9933] bg-[#FF9933]/10 px-2 py-0.5 rounded-full border border-[#FF9933]/20">
                      05
                    </span>
                    <span className="text-xl">🚀</span>
                  </div>
                  <h3 className="text-sm font-bold font-editorial text-white">Prepare and apply</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Next 3 Steps actionable preparation plan with direct portal links.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-[#FF9933]">
                  Actionable
                </div>
              </div>

            </div>

            {/* Launch CTA */}
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setActiveView('match');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-[#FF9933] hover:bg-[#E68A00] text-slate-950 font-bold text-sm sm:text-base rounded-xl transition duration-200 inline-flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Find Schemes For Me →</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </Reveal>
      </section>

      {/* ---------------- SECTION 07: "Why UdyamSetu" (4 Core Pillars) ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal variant="scale-up">
          <div className="bg-slate-50 rounded-3xl border border-[#E2E8F0] p-8 sm:p-12 space-y-8 shadow-xs">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A] font-mono">
                WHY UDYAMSETU
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-editorial">
                Built on Trust, Grounding, and Actionable Delivery
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">
                "AI explains government schemes. It does not invent government schemes."
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Pillar 1 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs hover:border-[#1E3A5F] transition">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A5F] flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5 text-[#1E3A5F]" />
                </div>
                <span className="text-xs font-mono font-bold text-[#1E3A5F] tracking-wider uppercase block">
                  PERSONALIZED
                </span>
                <h4 className="text-sm font-bold text-slate-900">Personalized Discovery</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Recommendations based on your location, trade activity, business stage, and demographic attributes.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs hover:border-[#1E3A5F] transition">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 tracking-wider uppercase block">
                  ELIGIBILITY-FIRST
                </span>
                <h4 className="text-sm font-bold text-slate-900">Eligibility-First Filtering</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Strict deterministic statutory conditions filter out unqualified programs with zero guesswork.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs hover:border-[#1E3A5F] transition">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs font-mono font-bold text-purple-800 tracking-wider uppercase block">
                  EXPLAINABLE
                </span>
                <h4 className="text-sm font-bold text-slate-900">Explainable Decisions</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Understand why a scheme matches you with official gazette citations and transparent logic traces.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs hover:border-[#1E3A5F] transition">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5 text-[#F97316]" />
                </div>
                <span className="text-xs font-mono font-bold text-amber-900 tracking-wider uppercase block">
                  ACTIONABLE
                </span>
                <h4 className="text-sm font-bold text-slate-900">Actionable Roadmap</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Know exact required documents, required DPR templates, and verified portal links to apply.
                </p>
              </div>

            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setActiveView('how-it-works');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-[#1E3A5F] hover:bg-[#162D4A] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
              >
                <span>Read Full Trust & Governance Charter →</span>
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------- SECTION 08: "Ask UdyamSetu AI" (Large Conversational AI Section) ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal variant="fade-up">
          <div className="bg-gradient-to-br from-[#0B1728] via-[#10223D] to-[#0B1728] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-slate-700 space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold border border-blue-400/30">
                  <Bot className="w-4 h-4 text-[#FF9933]" />
                  <span>GROUNDED AI ASSISTANT</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-editorial text-white">
                  Have a specific question about eligibility, subsidies or loans?
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Ask UdyamSetu AI in English or Hindi. Our assistant answers using verified government knowledge bases and statutory citations.
                </p>

                {/* Quick Questions */}
                <div className="pt-2 space-y-2">
                  <span className="text-xs font-mono font-bold text-[#FF9933] block">TRY ASKING:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      '₹10 Lakh loan for a boutique in UP',
                      'Which scheme gives 35% capital subsidy?',
                      'Benefits under PM Vishwakarma for artisans',
                      'Can I apply for Stand-Up India without collateral?'
                    ].map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveView('ask');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-lg transition text-left cursor-pointer"
                      >
                        "{q}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/70 border border-slate-700/80 space-y-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#FF9933] text-slate-950 flex items-center justify-center shadow-lg">
                  <Bot className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white font-editorial">UdyamSetu Intelligence Engine</h4>
                <p className="text-xs text-slate-400">
                  Available 24/7 in English and हिंदी with zero downtime deterministic fallback.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('ask');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-3.5 bg-[#1E3A5F] hover:bg-[#162D4A] border border-blue-400/40 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Ask UdyamSetu AI →</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </Reveal>
      </section>

      {/* ---------------- SECTION 09: Popular / Flagship Schemes Showcase ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal variant="fade-up" className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] font-mono">
              FLAGSHIP PROGRAMS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-editorial">
              Popular Central Government Schemes
            </h2>
            <p className="text-xs sm:text-sm text-[#475569]">
              High-impact financial assistance, subsidies, and credit guarantee schemes for entrepreneurs.
            </p>
          </div>

          <button
            onClick={() => setActiveView('schemes')}
            className="text-xs font-bold text-[#1E3A5F] hover:underline flex items-center gap-1 cursor-pointer transition shrink-0"
          >
            <span>View All Schemes →</span>
          </button>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FLAGSHIP_SCHEMES.slice(0, 3).map((scheme) => (
            <RevealCard
              key={scheme.id}
              onClick={() => openSchemeDetail(scheme.slug)}
              className="bg-white rounded-2xl border border-slate-200 hover:border-[#1E3A5F] p-6 shadow-xs transition group flex flex-col justify-between cursor-pointer space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#1E3A5F] bg-blue-50 px-2.5 py-1 rounded">
                    {scheme.code}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    ✓ Verified
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#1E3A5F] transition font-editorial leading-snug">
                  {language === 'hi' ? scheme.name_hi : scheme.name}
                </h3>

                <p className="text-xs text-slate-500 font-mono line-clamp-1">
                  {scheme.ministry}
                </p>

                <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
                  {scheme.benefit_summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1E3A5F]">
                <span>View Full Details</span>
                <ArrowRight className="w-4 h-4 card-action-icon transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </RevealCard>
          ))}
        </div>
      </section>

      {/* ---------------- SECTION 10: Final Call to Action ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal variant="scale-up">
          <div className="bg-gradient-to-r from-[#1E3A5F] via-[#162D4A] to-[#0F172A] text-white rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-xl space-y-6">
            
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold text-[#FF9933] uppercase tracking-wider">
                GET STARTED IN MINUTES
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-editorial text-white">
                Your next opportunity could be closer than you think.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Join thousands of Indian entrepreneurs, artisans, students and farmers finding verified support through UdyamSetu.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveView('match');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 bg-[#FF9933] hover:bg-[#E68A00] text-slate-950 font-bold text-sm sm:text-base rounded-xl transition duration-200 shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Find Schemes For Me →</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveView('schemes');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm sm:text-base rounded-xl transition duration-200 shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Browse All 2,066+ Schemes</span>
              </button>
            </div>

          </div>
        </Reveal>
      </section>

      {/* ---------------- FLOATING AI CHATBOT BUTTON (Bottom Right) ---------------- */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => {
            setActiveView('ask');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Ask UdyamSetu AI"
          className="px-4 py-3 bg-[#1E3A5F] hover:bg-[#162D4A] active:scale-95 text-white rounded-full shadow-2xl border border-blue-400/40 flex items-center gap-2.5 transition duration-200 cursor-pointer group hover:shadow-blue-900/40"
        >
          <div className="w-7 h-7 rounded-full bg-[#FF9933] text-slate-950 flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold font-mono tracking-wide pr-1 hidden sm:inline">
            Ask UdyamSetu AI
          </span>
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
        </button>
      </div>

    </div>
  );
};
