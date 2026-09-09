/**
 * UdyamSetu World-Class Full-Width Hero Carousel
 * Inspired by official myScheme.gov.in edge-to-edge banner composition.
 * Zero image card frames • Full-bleed background visual layer • Right -> Left continuous motion.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useMotion } from '../motion/MotionProvider';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Building2,
  GraduationCap,
  Sprout,
  Users,
  Cpu,
  CheckCircle2,
  MapPin,
  Bot,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export interface HeroSlideData {
  id: string;
  categoryEn: string;
  categoryHi: string;
  themeBadgeEn: string;
  themeBadgeHi: string;
  badgeIcon: React.ElementType;
  badgeBg: string;
  badgeText: string;
  headlineEn: string;
  headlineHi: string;
  highlightTextEn: string;
  highlightTextHi: string;
  descEn: string;
  descHi: string;
  primaryCtaEn: string;
  primaryCtaHi: string;
  secondaryCtaEn: string;
  secondaryCtaHi: string;
  image: string;
  imageAlt: string;
  trustPointsEn: string[];
  trustPointsHi: string[];
  gradientTheme: string;
  overlayGradient: string;
  onPrimaryClick: (ctx: { setActiveView: (v: any) => void; setUserProfile: (p: any) => void; userProfile: any }) => void;
  onSecondaryClick: (ctx: { setActiveView: (v: any) => void; setUserProfile: (p: any) => void; userProfile: any }) => void;
}

export const HeroCarousel: React.FC = () => {
  const { setActiveView, setUserProfile, userProfile, language } = useApp();
  const { isReducedMotion } = useMotion();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  // Touch swipe refs
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides: HeroSlideData[] = [
    // SLIDE 01 — GOVERNMENT SCHEME DISCOVERY
    {
      id: 'discover_schemes',
      categoryEn: 'GOVERNMENT SCHEME DISCOVERY',
      categoryHi: 'सरकारी योजना खोज',
      themeBadgeEn: 'AI-POWERED GOVERNMENT SCHEME DISCOVERY',
      themeBadgeHi: 'एआई-संचालित सरकारी योजना खोज',
      badgeIcon: Sparkles,
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      badgeText: 'text-emerald-300',
      headlineEn: 'Discover the Right Government Schemes',
      headlineHi: 'अपने लिए सही सरकारी योजनाएं',
      highlightTextEn: 'for You.',
      highlightTextHi: 'खोजें।',
      descEn: 'One intelligent platform to discover government schemes matched to your needs, profile and eligibility.',
      descHi: 'एक ही बुद्धिमान मंच पर अपनी आवश्यकताओं, प्रोफाइल और पात्रता के अनुसार सरकारी योजनाएं खोजें।',
      primaryCtaEn: 'Find Schemes For Me →',
      primaryCtaHi: 'मेरे लिए योजनाएं खोजें →',
      secondaryCtaEn: 'Explore Schemes',
      secondaryCtaHi: 'सभी योजनाएं देखें',
      image: '/banners/banner_discover_schemes.jpg',
      imageAlt: 'Digital India scheme discovery with citizen beneficiary and entrepreneur',
      trustPointsEn: ['Verified Government Information', 'Central + State Schemes', 'Zero Hallucination'],
      trustPointsHi: ['सत्यापित सरकारी जानकारी', 'केंद्र एवं राज्य योजनाएं', 'शून्य अनुमान'],
      gradientTheme: 'from-[#0B1528] via-[#0B1528]/95 to-transparent',
      overlayGradient: 'from-[#0B1528] via-[#0B1528]/85 via-45% to-transparent',
      onPrimaryClick: ({ setActiveView }) => {
        setActiveView('match');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onSecondaryClick: ({ setActiveView }) => {
        setActiveView('schemes');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },

    // SLIDE 02 — EDUCATION & SCHOLARSHIPS
    {
      id: 'education_scholarship',
      categoryEn: 'EDUCATION & SCHOLARSHIPS',
      categoryHi: 'शिक्षा एवं छात्रवृत्ति',
      themeBadgeEn: 'SCHOLARSHIPS & SKILL DEVELOPMENT',
      themeBadgeHi: 'छात्रवृत्ति व कौशल विकास',
      badgeIcon: GraduationCap,
      badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
      badgeText: 'text-sky-300',
      headlineEn: 'Unlock Opportunities Through',
      headlineHi: 'शिक्षा और कौशल से सजाएं',
      highlightTextEn: 'Education.',
      highlightTextHi: 'अपना भविष्य।',
      descEn: 'Discover scholarships, fee assistance, skill development and education-support programs.',
      descHi: 'छात्रवृत्ति, शुल्क सहायता, कौशल विकास और उच्च शिक्षा सहयोग योजनाओं की खोज करें।',
      primaryCtaEn: 'Find Scholarships →',
      primaryCtaHi: 'छात्रवृत्तियां खोजें →',
      secondaryCtaEn: 'Explore Scholarships',
      secondaryCtaHi: 'सभी छात्रवृत्तियां देखें',
      image: '/banners/banner_education_scholarship.jpg',
      imageAlt: 'Indian college students with digital scholarship award certificate',
      trustPointsEn: ['Direct Benefit Transfer (DBT)', 'Merit & Technical Grants', 'Pre & Post-Matric Waivers'],
      trustPointsHi: ['प्रत्यक्ष लाभ अंतरण (DBT)', 'मेधावी व तकनीकी अनुदान', 'प्री व पोस्ट मैट्रिक छूट'],
      gradientTheme: 'from-[#07172C] via-[#07172C]/95 to-transparent',
      overlayGradient: 'from-[#07172C] via-[#07172C]/85 via-45% to-transparent',
      onPrimaryClick: ({ setActiveView }) => {
        setActiveView('match');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onSecondaryClick: ({ setActiveView }) => {
        setActiveView('schemes');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },

    // SLIDE 03 — BUSINESS & MSME
    {
      id: 'msme_business',
      categoryEn: 'BUSINESS & MSME',
      categoryHi: 'व्यापार एवं एमएसएमई',
      themeBadgeEn: 'MSME & STARTUP FINANCING',
      themeBadgeHi: 'एमएसएमई व स्टार्टअप वित्तपोषण',
      badgeIcon: Building2,
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
      badgeText: 'text-blue-300',
      headlineEn: 'Turn Your Business Idea Into',
      headlineHi: 'अपने व्यावसायिक विचार को',
      highlightTextEn: 'Opportunity.',
      highlightTextHi: 'अवसर में बदलें।',
      descEn: 'Find loans, subsidies, financial assistance and government support for entrepreneurs and MSMEs.',
      descHi: 'उद्यमियों और एमएसएमई के लिए बैंक ऋण, सरकारी सब्सिडी, वित्तीय सहायता और नीतिगत सहयोग प्राप्त करें।',
      primaryCtaEn: 'Explore Business Schemes →',
      primaryCtaHi: 'व्यावसायिक योजनाएं देखें →',
      secondaryCtaEn: 'View PMEGP & Mudra',
      secondaryCtaHi: 'पीएमईजीपी व मुद्रा देखें',
      image: '/banners/banner_msme_business.jpg',
      imageAlt: 'Indian micro-enterprise manufacturing workshop and proud business owner',
      trustPointsEn: ['Up to 35% Capital Subsidy', 'Collateral-Free Credit', 'CGTMSE & PMEGP Coverage'],
      trustPointsHi: ['35% तक पूंजीगत सब्सिडी', 'बिना गारंटी बैंक ऋण', 'सीजीटीएमएसई व पीएमईजीपी'],
      gradientTheme: 'from-[#08162A] via-[#08162A]/95 to-transparent',
      overlayGradient: 'from-[#08162A] via-[#08162A]/85 via-45% to-transparent',
      onPrimaryClick: ({ setActiveView, setUserProfile, userProfile }) => {
        setUserProfile({
          ...userProfile,
          applicant_persona: 'existing_entrepreneur',
          business_type: 'Manufacturing',
          funding_need: ['Loan', 'Subsidy']
        });
        setActiveView('match');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onSecondaryClick: ({ setActiveView }) => {
        setActiveView('schemes');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },

    // SLIDE 04 — AGRICULTURE & RURAL DEVELOPMENT
    {
      id: 'rural_farmers',
      categoryEn: 'AGRICULTURE & RURAL DEVELOPMENT',
      categoryHi: 'कृषि एवं ग्रामीण विकास',
      themeBadgeEn: 'AGRI ALLIED & RURAL PROSPERITY',
      themeBadgeHi: 'कृषि संबद्ध व ग्रामीण समृद्धि',
      badgeIcon: Sprout,
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      badgeText: 'text-emerald-300',
      headlineEn: 'Support That Reaches Every',
      headlineHi: 'भारत के हर कोने तक पहुंचे',
      highlightTextEn: 'Corner of India.',
      highlightTextHi: 'सरकारी सहायता।',
      descEn: 'Discover agricultural, rural development and livelihood schemes designed for communities across India.',
      descHi: 'पूरे भारत के ग्रामीण समुदायों के लिए कृषि, ग्रामीण विकास और आजीविका सहायता योजनाओं की खोज करें।',
      primaryCtaEn: 'Explore Agriculture Schemes →',
      primaryCtaHi: 'कृषि योजनाएं देखें →',
      secondaryCtaEn: 'NABARD & Rural Schemes',
      secondaryCtaHi: 'नाबार्ड व ग्रामीण योजनाएं',
      image: '/banners/banner_rural_farmers.jpg',
      imageAlt: 'Indian farmer in lush green fields with modern solar irrigation pump',
      trustPointsEn: ['Solar Irrigation Pumps', 'Food Processing Grants', 'Kisan Credit & Dairy Loans'],
      trustPointsHi: ['सोलर सिंचाई पंप सब्सिडी', 'फूड प्रोसेसिंग अनुदान', 'किसान क्रेडिट व डेयरी ऋण'],
      gradientTheme: 'from-[#091D1A] via-[#091D1A]/95 to-transparent',
      overlayGradient: 'from-[#091D1A] via-[#091D1A]/85 via-45% to-transparent',
      onPrimaryClick: ({ setActiveView, setUserProfile, userProfile }) => {
        setUserProfile({
          ...userProfile,
          applicant_persona: 'farmer_dairy',
          business_type: 'Agriculture',
          funding_need: ['Subsidy', 'Equipment']
        });
        setActiveView('match');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onSecondaryClick: ({ setActiveView }) => {
        setActiveView('schemes');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },

    // SLIDE 05 — WOMEN & YOUTH
    {
      id: 'women_youth',
      categoryEn: 'WOMEN & YOUTH',
      categoryHi: 'महिला एवं युवा सशक्तीकरण',
      themeBadgeEn: 'WOMEN & YOUTH INITIATIVES',
      themeBadgeHi: 'महिला एवं युवा पहल',
      badgeIcon: Users,
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
      badgeText: 'text-purple-300',
      headlineEn: 'Empowering India’s',
      headlineHi: 'भारत की अगली पीढ़ी का',
      highlightTextEn: 'Next Generation.',
      highlightTextHi: 'सशक्तीकरण।',
      descEn: 'Find opportunities for women, students and young entrepreneurs across India.',
      descHi: 'महिलाओं, छात्रों और युवा उद्यमियों के लिए पूरे भारत में अवसर और सरकारी प्रोत्साहन खोजें।',
      primaryCtaEn: 'Discover Opportunities →',
      primaryCtaHi: 'अवसर खोजें →',
      secondaryCtaEn: 'Stand-Up India Schemes',
      secondaryCtaHi: 'स्टैंड-अप इंडिया योजनाएं',
      image: '/banners/banner_women_youth.jpg',
      imageAlt: 'Empowered Indian woman entrepreneur and young technology innovator',
      trustPointsEn: ['Stand-Up India up to ₹1 Cr', '75% Machinery Grants', 'Special Category Subsidies'],
      trustPointsHi: ['₹1 करोड़ तक स्टैंड-अप इंडिया', '75% मशीनरी अनुदान', 'विशेष श्रेणी सब्सिडी'],
      gradientTheme: 'from-[#170E28] via-[#170E28]/95 to-transparent',
      overlayGradient: 'from-[#170E28] via-[#170E28]/85 via-45% to-transparent',
      onPrimaryClick: ({ setActiveView, setUserProfile, userProfile }) => {
        setUserProfile({
          ...userProfile,
          gender: 'Female',
          social_category: 'General',
          applicant_persona: 'starting_business',
          funding_need: ['Starting capital', 'Subsidy']
        });
        setActiveView('match');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onSecondaryClick: ({ setActiveView }) => {
        setActiveView('schemes');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },

    // SLIDE 06 — AI-POWERED UDYAMSETU
    {
      id: 'ai_recommendation',
      categoryEn: 'AI-POWERED UDYAMSETU',
      categoryHi: 'एआई-संचालित उद्यमसेतु',
      themeBadgeEn: 'DETERMINISTIC AI MATCHING',
      themeBadgeHi: 'सटीक एआई मिलान प्रणाली',
      badgeIcon: Cpu,
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      badgeText: 'text-amber-300',
      headlineEn: 'One Profile. The Right Schemes.',
      headlineHi: 'एक नागरिक प्रोफाइल। सही योजनाएं।',
      highlightTextEn: 'Zero Guesswork.',
      highlightTextHi: 'शून्य अनुमान।',
      descEn: 'Tell UdyamSetu about yourself and let our intelligent recommendation engine identify relevant schemes.',
      descHi: 'उद्यमसेतु को अपनी जानकारी दें और हमारी सटीक प्रणाली को आपकी पात्र योजनाओं की पहचान करने दें।',
      primaryCtaEn: 'Get Personalized Recommendations →',
      primaryCtaHi: 'व्यक्तिगत सिफारिशें पाएं →',
      secondaryCtaEn: 'Ask UdyamSetu AI',
      secondaryCtaHi: 'उद्यमसेतु एआई से पूछें',
      image: '/banners/banner_ai_recommendation.jpg',
      imageAlt: 'AI recommendation dashboard with verified citizen profile matching',
      trustPointsEn: ['100% Deterministic Logic', 'Official Gazette Grounded', 'Next 3 Steps Action Roadmap'],
      trustPointsHi: ['100% प्रामाणिक नियम', 'राजपत्र आधारित संदर्भ', 'आवेदन तैयारी कार्ययोजना'],
      gradientTheme: 'from-[#0F1524] via-[#0F1524]/95 to-transparent',
      overlayGradient: 'from-[#0F1524] via-[#0F1524]/85 via-45% to-transparent',
      onPrimaryClick: ({ setActiveView }) => {
        setActiveView('match');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onSecondaryClick: ({ setActiveView }) => {
        setActiveView('ask');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
  ];

  const totalSlides = slides.length;

  // Next slide handler (moving RIGHT -> LEFT)
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setSlideDirection('next');
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsTransitioning(false), 850);
  }, [isTransitioning, totalSlides]);

  // Prev slide handler (moving LEFT -> RIGHT)
  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setSlideDirection('prev');
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsTransitioning(false), 850);
  }, [isTransitioning, totalSlides]);

  const goToSlide = (index: number) => {
    if (index === currentSlide || isTransitioning) return;
    setSlideDirection(index > currentSlide ? 'next' : 'prev');
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 850);
  };

  // Continuous Autoplay timer (6 seconds per slide)
  useEffect(() => {
    if (isReducedMotion || isPaused) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [nextSlide, isReducedMotion, isPaused]);

  // Touch Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (diff > minSwipeDistance) {
      nextSlide();
    } else if (diff < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  };

  const active = slides[currentSlide];
  const BadgeIcon = active.badgeIcon;

  return (
    <section
      aria-label="Government Schemes Full-Width Hero Carousel"
      className="relative w-full overflow-hidden bg-[#0A192F] select-none text-white focus:outline-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Top Tricolour Subtle Indicator Strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] z-30 opacity-90" />

      {/* FULL-BLEED SLIDE CONTAINER */}
      <div className="relative w-full min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] xl:min-h-[660px] flex items-center">
        
        {/* BACKGROUND IMAGE LAYER (EDGE-TO-EDGE) */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out will-change-transform ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
              }`}
            >
              {/* Full Bleed Image */}
              <img
                src={slide.image}
                alt={slide.imageAlt}
                className={`w-full h-full object-cover object-center lg:object-[78%_center] transition-transform duration-[6000ms] ease-out will-change-transform ${
                  isActive ? 'scale-100' : 'scale-105'
                }`}
                loading={index === 0 ? 'eager' : 'lazy'}
              />

              {/* Seamless Multi-Stop Gradient Masks (Ensures 100% Typography Readability without Card Borders) */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.overlayGradient} pointer-events-none`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/40 to-transparent lg:hidden pointer-events-none" />
              <div className="absolute inset-0 bg-[#0A192F]/30 pointer-events-none" />

              {/* Subtle Tech Grid / Dotted Accent Matrix */}
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
                  backgroundSize: '28px 28px'
                }}
              />
            </div>
          );
        })}

        {/* HERO CONTENT LAYER (Left-anchored, High-Contrast Government Typography) */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 w-full z-20">
          <div className="max-w-2xl lg:max-w-2xl xl:max-w-3xl space-y-6">
            
            {/* Category Badge & Live Trust Verification */}
            <div
              key={`badge-${currentSlide}`}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-bold font-mono border backdrop-blur-md shadow-md animate-in fade-in slide-in-from-top-3 duration-500"
            >
              <div className={`p-1 rounded-full ${active.badgeBg}`}>
                <BadgeIcon className="w-3.5 h-3.5" />
              </div>
              <span className="tracking-wider uppercase text-white/95">
                {language === 'hi' ? active.themeBadgeHi : active.themeBadgeEn}
              </span>
              <span className="text-white/30">•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Verified</span>
              </span>
            </div>

            {/* Headline with Bilingual Typography */}
            <h1
              key={`headline-${currentSlide}`}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-editorial tracking-tight leading-[1.12] text-white animate-in fade-in slide-in-from-left-4 duration-600 delay-150"
            >
              {language === 'hi' ? active.headlineHi : active.headlineEn}{' '}
              <span className="text-[#FF9933] underline decoration-[#16A34A] decoration-4 underline-offset-8 inline-block">
                {language === 'hi' ? active.highlightTextHi : active.highlightTextEn}
              </span>
            </h1>

            {/* Supporting Description */}
            <p
              key={`desc-${currentSlide}`}
              className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-xl animate-in fade-in slide-in-from-left-4 duration-600 delay-250 font-normal"
            >
              {language === 'hi' ? active.descHi : active.descEn}
            </p>

            {/* CTAs (Primary & Secondary) */}
            <div
              key={`cta-${currentSlide}`}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 animate-in fade-in slide-in-from-bottom-3 duration-600 delay-350"
            >
              <button
                type="button"
                onClick={() => active.onPrimaryClick({ setActiveView, setUserProfile, userProfile })}
                className="px-8 py-4 bg-[#FF9933] hover:bg-[#F5871F] active:scale-[0.98] text-slate-950 text-sm sm:text-base font-bold rounded-xl transition duration-200 flex items-center justify-center gap-2.5 shadow-lg hover:shadow-orange-500/20 cursor-pointer"
              >
                <span>{language === 'hi' ? active.primaryCtaHi : active.primaryCtaEn}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => active.onSecondaryClick({ setActiveView, setUserProfile, userProfile })}
                className="px-6 py-4 bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white border border-white/25 hover:border-white/40 text-sm sm:text-base font-bold rounded-xl backdrop-blur-md transition duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'hi' ? active.secondaryCtaHi : active.secondaryCtaEn}</span>
              </button>
            </div>

            {/* Trust Indicator Checkmarks */}
            <div
              key={`trust-${currentSlide}`}
              className="pt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-300 font-medium"
            >
              {(language === 'hi' ? active.trustPointsHi : active.trustPointsEn).map((point, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>{point}</span>
                </span>
              ))}
            </div>

          </div>
        </div>

        {/* BOTTOM NAVIGATION & CAROUSEL CONTROLS (Within Container Grid) */}
        <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            
            {/* Slide Indicator Dots with Elongated Active Pill */}
            <div
              className="flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/15 shadow-md"
              role="tablist"
              aria-label="Slide indicators"
            >
              {slides.map((slide, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Go to slide ${idx + 1}: ${slide.themeBadgeEn}`}
                    onClick={() => goToSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-400 cursor-pointer ${
                      isActive
                        ? 'w-8 bg-[#FF9933] shadow-xs'
                        : 'w-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                );
              })}
            </div>

            {/* Slide Progress Counter & Manual Prev/Next 44px Buttons */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs font-mono font-bold text-slate-300">
                0{currentSlide + 1} / 0{totalSlides}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="w-11 h-11 rounded-full bg-slate-950/60 hover:bg-slate-900 active:scale-95 text-white border border-white/20 hover:border-white/40 backdrop-blur-md shadow-md flex items-center justify-center transition cursor-pointer min-w-[44px] min-h-[44px]"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="w-11 h-11 rounded-full bg-slate-950/60 hover:bg-slate-900 active:scale-95 text-white border border-white/20 hover:border-white/40 backdrop-blur-md shadow-md flex items-center justify-center transition cursor-pointer min-w-[44px] min-h-[44px]"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
