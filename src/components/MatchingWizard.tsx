import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../services/matchingEngine';
import { INDIAN_STATES } from '../data/schemes';
import { verifyUdyamRegistration, UdyamVerificationResult } from '../services/udyamProvider';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Info,
  ExternalLink,
  Loader2,
  Building2,
  Trees,
  Check,
  Building,
  Sparkles
} from 'lucide-react';
import { TricolourLoader } from './TricolourLoader';
import gsap from 'gsap';
import { useMotion } from '../motion/MotionProvider';
import { motionTokens } from '../motion/motionTokens';
import { easing } from '../motion/easing';

export const MatchingWizard: React.FC = () => {
  const { userProfile, setUserProfile, executeMatching, setActiveView, language, auth } = useApp();
  const { isReducedMotion } = useMotion();
  const [currentStep, setCurrentStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState<'next' | 'back'>('next');
  const [isProcessing, setIsProcessing] = useState(false);
  const stepContentRef = useRef<HTMLDivElement>(null);

  // Local draft profile - synchronized with authenticated user profile
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...userProfile
    }));
  }, [userProfile]);

  // Animate step content on step change
  useEffect(() => {
    const el = stepContentRef.current;
    if (!el || isReducedMotion) return;

    const distance = slideDirection === 'next' ? 24 : -24;
    gsap.fromTo(
      el,
      { opacity: 0, x: distance },
      { opacity: 1, x: 0, duration: motionTokens.duration.standard, ease: easing.premium, clearProps: 'transform' }
    );
  }, [currentStep, slideDirection, isReducedMotion]);

  // Udyam Verification State
  const [udyamInput, setUdyamInput] = useState(formData.udyam_registration_number || '');
  const [isVerifyingUdyam, setIsVerifyingUdyam] = useState(false);
  const [udyamResult, setUdyamResult] = useState<UdyamVerificationResult | null>(null);
  const [udyamError, setUdyamError] = useState<string | null>(null);

  const totalSteps = 6;

  // Step 1 Validation: State and Residence are required
  const validateStep = (step: number): boolean => {
    setValidationError(null);

    if (step === 1) {
      if (!formData.location_state || formData.location_state.trim() === '') {
        setValidationError(language === 'hi' ? 'कृपया अपना राज्य / केंद्र शासित प्रदेश चुनें।' : 'Please select your State or Union Territory.');
        return false;
      }
      if (!formData.residence_type) {
        setValidationError(language === 'hi' ? 'कृपया अपना निवास क्षेत्र (शहरी या ग्रामीण) चुनें।' : 'Please select your residence classification (Urban or Rural).');
        return false;
      }
    }

    if (step === 2) {
      if (!formData.applicant_persona) {
        setValidationError(language === 'hi' ? 'कृपया अपने व्यवसाय का विवरण चुनें।' : 'Please select the persona that best describes you.');
        return false;
      }
    }

    if (step === 3) {
      if (!formData.business_type) {
        setValidationError(language === 'hi' ? 'कृपया अपने व्यवसाय का क्षेत्र चुनें।' : 'Please select your business sector.');
        return false;
      }
    }

    if (step === 4) {
      if (!formData.funding_need || formData.funding_need.length === 0) {
        setValidationError(language === 'hi' ? 'कृपया कम से कम एक सहायता आवश्यकता चुनें।' : 'Please select at least one support requirement.');
        return false;
      }
    }

    if (step === 5) {
      if (!formData.business_stage) {
        setValidationError(language === 'hi' ? 'कृपया उद्यम का चरण चुनें।' : 'Please select your enterprise stage.');
        return false;
      }
      // Mandatory Revenue check for Existing Enterprise
      if (formData.business_stage === 'existing' && !formData.revenue_range) {
        setValidationError(
          language === 'hi'
            ? 'मौजूदा उद्यमों के लिए वार्षिक राजस्व सीमा अनिवार्य है।'
            : 'Revenue range is mandatory for an operating / existing business.'
        );
        return false;
      }
    }

    if (step === 6) {
      if (formData.age < 18 || formData.age > 115) {
        setValidationError(
          language === 'hi'
            ? 'वैध आयु 18 से 115 वर्ष के बीच होनी चाहिए।'
            : 'Applicant age must be between 18 and 115 years for statutory qualification.'
        );
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setSlideDirection('next');
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Complete wizard -> Trigger Tricolour loader
      setUserProfile(formData);
      setIsProcessing(true);
    }
  };

  const handleBack = () => {
    setValidationError(null);
    setSlideDirection('back');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoaderComplete = () => {
    executeMatching(formData);
    setIsProcessing(false);
    setActiveView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerifyUdyam = async () => {
    setUdyamError(null);
    setIsVerifyingUdyam(true);
    try {
      const res = await verifyUdyamRegistration(udyamInput);
      setUdyamResult(res);
      if (res.isValid) {
        setFormData((prev) => ({
          ...prev,
          has_udyam_registration: true,
          udyam_registration_number: res.registrationNumber,
          udyam_verification_status: 'verified',
          udyam_verified_data: {
            enterpriseName: res.enterpriseName,
            organizationType: res.organizationType,
            majorActivity: res.majorActivity,
            registrationDate: res.registrationDate
          }
        }));
      } else {
        setUdyamError(res.message || 'Invalid Udyam Registration format. Format: UDYAM-XX-00-0000000');
        setFormData((prev) => ({
          ...prev,
          has_udyam_registration: false,
          udyam_verification_status: 'format_error'
        }));
      }
    } catch {
      setUdyamError('Verification service temporarily unreachable. You can continue manually.');
    } finally {
      setIsVerifyingUdyam(false);
    }
  };

  if (isProcessing) {
    return <TricolourLoader onComplete={handleLoaderComplete} />;
  }

  // Persona Options (Normalized 8 personas)
  const personaOptions = [
    { id: 'starting_business', labelEn: 'Starting a New Business', labelHi: 'नया व्यवसाय शुरू कर रहे हैं', desc: 'Planning a greenfield enterprise or first-time startup', icon: '🚀' },
    { id: 'existing_entrepreneur', labelEn: 'Existing Business Owner', labelHi: 'मौजूदा व्यवसायी / एमएसएमई', desc: 'Operating an active shop, factory, or commercial enterprise', icon: '🏢' },
    { id: 'artisan', labelEn: 'Artisan / Traditional Craftsperson', labelHi: 'कारीगर / पारंपरिक शिल्पकार', desc: 'Tailor, carpenter, weaver, potter, blacksmith, etc.', icon: '🧵' },
    { id: 'street_vendor', labelEn: 'Street Vendor / Hawker', labelHi: 'रेहड़ी-पटरी विक्रेता / स्ट्रीट वेंडर', desc: 'Urban cart vendor, weekly market stall, or mobile seller', icon: '🛒' },
    { id: 'self_employed', labelEn: 'Self-Employed Professional', labelHi: 'स्वरोजगार / व्यक्तिगत सेवा', desc: 'Electrician, mechanic, salon, technician, driver', icon: '🔧' },
    { id: 'shg_member', labelEn: 'Self Help Group (SHG) Member', labelHi: 'स्वयं सहायता समूह (SHG) सदस्य', desc: 'Women collective enterprise or livelihood cluster', icon: '🤝' },
    { id: 'farmer_entrepreneur', labelEn: 'Farmer / Agri Entrepreneur', labelHi: 'किसान / कृषि-उद्यमी', desc: 'Dairy, poultry, food processing, agri-clinic, fisheries', icon: '🌾' },
    { id: 'startup_founder', labelEn: 'Technology / Innovation Startup', labelHi: 'तकनीकी / नवाचार स्टार्टअप', desc: 'Innovative product, digital platform, or patent', icon: '💡' }
  ];

  // Business Type Options (Normalized 9 taxonomy sectors)
  const businessTypes = [
    { id: 'Textile', labelEn: 'Textile, Garments & Tailoring', labelHi: 'वस्त्र, परिधान व सिलाई', desc: 'Embroidery, tailoring, garments, handloom' },
    { id: 'Handicraft', labelEn: 'Handicraft & Traditional Art', labelHi: 'हस्तशिल्प व पारंपरिक कला', desc: 'Pottery, leather crafts, wood/metal art' },
    { id: 'Food Processing', labelEn: 'Food Processing & Bakery', labelHi: 'खाद्य प्रसंस्करण व बेकरी', desc: 'Spices, dairy products, bakery, snacks' },
    { id: 'Agriculture', labelEn: 'Agriculture Allied & Dairy', labelHi: 'कृषि संबद्ध व डेयरी', desc: 'Livestock, dairy farming, organic inputs' },
    { id: 'Manufacturing', labelEn: 'Manufacturing & Production', labelHi: 'विनिर्माण / उत्पादन', desc: 'Fabrics, packaging, goods, fabricated parts' },
    { id: 'Services', labelEn: 'Services & Operations', labelHi: 'सेवाएं और संचालन', desc: 'Repairs, salon, logistics, hospitality' },
    { id: 'Retail', labelEn: 'Retail & Trading', labelHi: 'खुदरा एवं दुकान', desc: 'Grocery, apparel store, electronic trading' },
    { id: 'Technology', labelEn: 'Technology & Digital', labelHi: 'तकनीकी और डिजिटल', desc: 'Software, IT services, electronic devices' },
    { id: 'Other', labelEn: 'Other Sector', labelHi: 'अन्य क्षेत्र', desc: 'Any other legitimate business activity' }
  ];

  // Need Options (7 core support categories)
  const needOptions = [
    { id: 'Starting a business', labelEn: 'Starting Capital', labelHi: 'शुरुआती पूंजी / बीज अनुदान' },
    { id: 'Working capital', labelEn: 'Daily Working Capital', labelHi: 'कार्यशील पूंजी (स्टॉक/माल हेतु)' },
    { id: 'Machinery & Equipment', labelEn: 'Machinery / Equipment Purchase', labelHi: 'मशीनरी व उपकरण खरीद' },
    { id: 'Loan', labelEn: 'Collateral-Free Bank Loan', labelHi: 'बिना गारंटी बैंक ऋण' },
    { id: 'Subsidy', labelEn: 'Government Capital Subsidy', labelHi: 'सरकारी पूंजीगत सब्सिडी' },
    { id: 'Training', labelEn: 'Skill & Entrepreneurship Training', labelHi: 'कौशल व उद्यमिता प्रशिक्षण' },
    { id: 'Market access', labelEn: 'Market Access & Fair Exhibitions', labelHi: 'बाजार पहुंच व व्यापार मेले' }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Wizard Header with UX4G / GOV.UK style progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-mono text-[#475569] mb-2">
          <span className="font-bold text-[#1E3A5F]">
            {language === 'hi' ? `चरण ${currentStep} / ${totalSteps}` : `STEP ${currentStep} OF ${totalSteps}`}
          </span>
          <span className="font-semibold">
            {Math.round((currentStep / totalSteps) * 100)}% {language === 'hi' ? 'पूर्ण' : 'COMPLETED'}
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="grid grid-cols-6 gap-1.5 h-2 w-full bg-slate-200 rounded-full overflow-hidden p-0.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-full rounded-full transition-all duration-300 ${
                i + 1 <= currentStep ? 'bg-[#1E3A5F]' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 sm:p-10 relative overflow-hidden">
        
        {/* Top saffron tricolour accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#F97316]" />

        {/* Authenticated Citizen Profile Linked Banner */}
        {auth.isAuthenticated && (
          <div className="mb-6 p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#1E3A5F] text-white shrink-0">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E3A5F]">
                  Profile Linked: {auth.name}
                </p>
                <p className="text-[11px] text-slate-600">
                  {userProfile.social_category && `Category: ${userProfile.social_category}`} • {userProfile.age && `Age: ${userProfile.age} yrs`} • Demographics automatically applied for scheme eligibility.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap">
              Synchronized
            </span>
          </div>
        )}

        {/* Validation Error Banner */}
        {validationError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-red-900">{language === 'hi' ? 'कृपया त्रुटि सुधारें' : 'Action Required'}</p>
              <p className="text-xs text-red-700 mt-0.5">{validationError}</p>
            </div>
          </div>
        )}

        {/* Step Content Container with Directional Sliding */}
        <div ref={stepContentRef} className="will-change-transform">
          {/* ---------------- STEP 1: Location & Residence ---------------- */}
          {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] font-mono">
                {language === 'hi' ? 'चरण 1 — स्थान' : 'STEP 1 — LOCATION'}
              </span>
              <h2 className="text-2xl font-bold text-[#0F172A] font-editorial mt-1">
                {language === 'hi'
                  ? 'आपका व्यवसाय किस राज्य और क्षेत्र में स्थित है?'
                  : 'Where is your business located?'}
              </h2>
              <p className="text-sm text-[#475569] mt-1.5">
                {language === 'hi'
                  ? 'सरकारी योजनाएं केंद्र और राज्य दोनों स्तरों पर संचालित होती हैं। शहरी और ग्रामीण क्षेत्रों के लिए अलग-अलग सब्सिडी दरें उपलब्ध हैं।'
                  : 'Central and State schemes offer distinct incentives. Rural locations often unlock higher capital subsidies (up to 35%).'}
              </p>
            </div>

            <div className="space-y-5 pt-2">
              {/* State / UT Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                  {language === 'hi' ? 'राज्य / केंद्र शासित प्रदेश *' : 'State / Union Territory *'}
                </label>
                <select
                  value={formData.location_state}
                  onChange={(e) => {
                    setFormData({ ...formData, location_state: e.target.value });
                    setValidationError(null);
                  }}
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] font-medium"
                >
                  <option value="">-- {language === 'hi' ? 'राज्य चुनें' : 'Select State / UT'} --</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st.id} value={st.name}>
                      {st.name} ({st.name_hi}) — {st.total_schemes} {language === 'hi' ? 'योजनाएं' : 'Schemes'}
                    </option>
                  ))}
                  <option value="Delhi">Delhi (दिल्ली)</option>
                  <option value="Haryana">Haryana (हरियाणा)</option>
                  <option value="Punjab">Punjab (पंजाब)</option>
                  <option value="West Bengal">West Bengal (पश्चिम बंगाल)</option>
                  <option value="Kerala">Kerala (केरल)</option>
                  <option value="Other State">Other State / UT</option>
                </select>
              </div>

              {/* Exact Urban vs Rural Classification (Judge Specification) */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
                  {language === 'hi' ? 'निवास / क्षेत्र का प्रकार *' : 'Residence / Location Classification *'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => {
                      setFormData({ ...formData, residence_type: 'urban' });
                      setValidationError(null);
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                      formData.residence_type === 'urban'
                        ? 'border-[#1E3A5F] bg-[#1E3A5F]/5 shadow-xs'
                        : 'border-[#E2E8F0] hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg ${formData.residence_type === 'urban' ? 'bg-[#1E3A5F] text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#0F172A]">
                        {language === 'hi' ? 'शहरी (Urban)' : 'Urban'}
                      </p>
                      <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                        {language === 'hi' ? 'नगर निगम / नगर पालिका / शहरी निकाय क्षेत्र' : 'Municipal Corporation, Municipality, or Town Local Body'}
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setFormData({ ...formData, residence_type: 'rural' });
                      setValidationError(null);
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                      formData.residence_type === 'rural'
                        ? 'border-[#1E3A5F] bg-[#1E3A5F]/5 shadow-xs'
                        : 'border-[#E2E8F0] hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg ${formData.residence_type === 'rural' ? 'bg-[#1E3A5F] text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Trees className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#0F172A]">
                        {language === 'hi' ? 'ग्रामीण (Rural)' : 'Rural'}
                      </p>
                      <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                        {language === 'hi' ? 'ग्राम पंचायत / ग्रामीण क्षेत्र (उच्च सब्सिडी दर)' : 'Gram Panchayat or Village area (Unlocks up to 35% PMEGP subsidy)'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3.5 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#1E3A5F] shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 leading-relaxed">
                  {language === 'hi'
                    ? `चुना गया राज्य: ${formData.location_state || 'अनिर्धारित'} | क्षेत्र: ${formData.residence_type === 'rural' ? 'ग्रामीण' : 'शहरी'}। उद्यमसेतु केंद्र और राज्य दोनों योजनाओं का मिलान करेगा।`
                    : `Selected: ${formData.location_state || 'Not selected'} (${formData.residence_type.toUpperCase()}). UdyamSetu evaluates both Central Ministry programs and State DIC schemes.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- STEP 2: Persona ---------------- */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] font-mono">
                {language === 'hi' ? 'चरण 2 — उद्यमी की श्रेणी' : 'STEP 2 — APPLICANT PROFILE'}
              </span>
              <h2 className="text-2xl font-bold text-[#0F172A] font-editorial mt-1">
                {language === 'hi' ? 'आपको सबसे सही क्या वर्णित करता है?' : 'What best describes you?'}
              </h2>
              <p className="text-sm text-[#475569] mt-1.5">
                {language === 'hi'
                  ? 'विशिष्ट समूहों (जैसे कारीगर, स्ट्रीट वेंडर, महिलाएं) के लिए विशेष सरकारी रियायतें और बिना गारंटी ऋण उपलब्ध हैं।'
                  : 'Your occupation acts as the primary personalization signal, unlocking tailored pathways like PM Vishwakarma or PM SVANidhi.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {personaOptions.map((opt) => {
                const isSelected = formData.applicant_persona === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        applicant_persona: opt.id,
                        is_street_vendor: opt.id === 'street_vendor',
                        is_traditional_artisan: opt.id === 'artisan'
                      });
                      setValidationError(null);
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#1E3A5F] bg-[#1E3A5F]/5 shadow-xs ring-1 ring-[#1E3A5F]'
                        : 'border-[#E2E8F0] hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{opt.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#0F172A]">
                          {language === 'hi' ? opt.labelHi : opt.labelEn}
                        </p>
                        <p className="text-[11px] text-[#475569] mt-0.5 leading-snug">{opt.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- STEP 3: Business Sector ---------------- */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] font-mono">
                {language === 'hi' ? 'चरण 3 — व्यवसाय का प्रकार' : 'STEP 3 — BUSINESS SECTOR'}
              </span>
              <h2 className="text-2xl font-bold text-[#0F172A] font-editorial mt-1">
                {language === 'hi' ? 'आपका व्यवसाय किस क्षेत्र से संबंधित है?' : 'What is your business sector?'}
              </h2>
              <p className="text-sm text-[#475569] mt-1.5">
                {language === 'hi'
                  ? 'योजनाएं विनिर्माण, सेवाओं, खाद्य प्रसंस्करण या व्यापार के आधार पर विभिन्न सब्सिडी सीमाएं प्रदान करती हैं।'
                  : 'Schemes offer varying loan limits (e.g. ₹50 Lakh for Mfg vs ₹20 Lakh for Services under PMEGP).'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {businessTypes.map((bt) => {
                const isSelected = formData.business_type === bt.id;
                return (
                  <div
                    key={bt.id}
                    onClick={() => {
                      setFormData({ ...formData, business_type: bt.id });
                      setValidationError(null);
                    }}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition ${
                      isSelected
                        ? 'border-[#1E3A5F] bg-[#1E3A5F]/5 font-semibold text-[#0F172A] ring-1 ring-[#1E3A5F]'
                        : 'border-[#E2E8F0] hover:border-slate-300 bg-white text-[#475569]'
                    }`}
                  >
                    <p className="text-xs font-bold text-[#0F172A]">
                      {language === 'hi' ? bt.labelHi : bt.labelEn}
                    </p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">{bt.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- STEP 4: Support Needs (Multi-Select) ---------------- */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] font-mono">
                {language === 'hi' ? 'चरण 4 — आवश्यकता' : 'STEP 4 — SUPPORT NEEDS'}
              </span>
              <h2 className="text-2xl font-bold text-[#0F172A] font-editorial mt-1">
                {language === 'hi' ? 'आपको किस प्रकार की सरकारी सहायता चाहिए?' : 'What do you need help with?'}
              </h2>
              <p className="text-sm text-[#475569] mt-1.5">
                {language === 'hi' ? 'आप एक से अधिक विकल्प चुन सकते हैं।' : 'Select all categories that apply to your current goal.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {needOptions.map((opt) => {
                const isChecked = formData.funding_need.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      const updated = isChecked
                        ? formData.funding_need.filter((n) => n !== opt.id)
                        : [...formData.funding_need, opt.id];
                      setFormData({ ...formData, funding_need: updated });
                      setValidationError(null);
                    }}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition ${
                      isChecked
                        ? 'border-[#1E3A5F] bg-[#1E3A5F]/5 text-[#0F172A]'
                        : 'border-[#E2E8F0] hover:border-slate-300 bg-white text-[#475569]'
                    }`}
                  >
                    <span className="text-xs font-semibold">
                      {language === 'hi' ? opt.labelHi : opt.labelEn}
                    </span>
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition ${
                        isChecked ? 'bg-[#1E3A5F] border-[#1E3A5F] text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- STEP 5: Enterprise Stage & Revenue ---------------- */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] font-mono">
                {language === 'hi' ? 'चरण 5 — उद्यम का चरण' : 'STEP 5 — ENTERPRISE STAGE'}
              </span>
              <h2 className="text-2xl font-bold text-[#0F172A] font-editorial mt-1">
                {language === 'hi'
                  ? 'आपके उद्यम की वर्तमान स्थिति क्या है?'
                  : 'What is the status of your enterprise?'}
              </h2>
            </div>

            <div className="space-y-5 pt-2">
              {/* Stage Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => {
                    setFormData({ ...formData, business_stage: 'new', revenue_range: undefined });
                    setValidationError(null);
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    formData.business_stage === 'new'
                      ? 'border-[#1E3A5F] bg-[#1E3A5F]/5 font-bold text-[#0F172A] ring-1 ring-[#1E3A5F]'
                      : 'border-[#E2E8F0] bg-white text-[#475569]'
                  }`}
                >
                  <p className="text-sm font-bold">{language === 'hi' ? 'नया उद्यम (New Enterprise)' : 'New Enterprise'}</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">{language === 'hi' ? 'मैं व्यवसाय शुरू करने की योजना बना रहा हूँ' : 'I am planning / starting the business'}</p>
                </div>

                <div
                  onClick={() => {
                    setFormData({ ...formData, business_stage: 'existing' });
                    setValidationError(null);
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    formData.business_stage === 'existing'
                      ? 'border-[#1E3A5F] bg-[#1E3A5F]/5 font-bold text-[#0F172A] ring-1 ring-[#1E3A5F]'
                      : 'border-[#E2E8F0] bg-white text-[#475569]'
                  }`}
                >
                  <p className="text-sm font-bold">{language === 'hi' ? 'मौजूदा उद्यम (Existing Enterprise)' : 'Existing Enterprise'}</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">{language === 'hi' ? 'मेरा व्यवसाय पहले से ही चालू है' : 'My business is already operating'}</p>
                </div>
              </div>

              {/* Conditional Revenue Logic */}
              {formData.business_stage === 'new' ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900">
                      {language === 'hi' ? 'राजस्व विवरण की आवश्यकता नहीं' : 'No Revenue Information Required'}
                    </p>
                    <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                      {language === 'hi'
                        ? 'नए उद्यम (ग्रीनफील्ड) के लिए राजस्व जानकारी आवश्यक नहीं है। आपको PMEGP और स्टैंड-अप इंडिया जैसी शुरुआती सब्सिडी योजनाओं के लिए प्राथमिकता दी जाएगी।'
                        : "Revenue information isn't required for a new enterprise. You qualify for greenfield seed capital and subsidy programs."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                    {language === 'hi' ? 'आपके व्यवसाय द्वारा उत्पन्न राजस्व सीमा *' : 'Revenue Range Generated by Your Business *'}
                  </label>
                  <p className="text-xs text-[#64748B] -mt-1">
                    {language === 'hi' ? 'कृपया नीचे दिए गए 4 विकल्पों में से एक चुनें:' : 'Please select exactly one of the four revenue ranges below:'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { id: 'up_to_1_lakh', label: 'Up to ₹1 Lakh', desc: 'Nano / Micro (PM SVANidhi, Mudra Shishu)' },
                      { id: '1_to_10_lakh', label: '₹1 Lakh to ₹10 Lakh', desc: 'Micro Enterprise (Mudra Kishore, PMEGP Upgrade)' },
                      { id: '10_to_50_lakh', label: '₹10 Lakh to ₹50 Lakh', desc: 'Small MSME (CGTMSE, Mudra Tarun)' },
                      { id: 'above_50_lakh', label: 'Above ₹50 Lakh', desc: 'Growth MSME (CGTMSE Credit Guarantee)' }
                    ].map((range) => (
                      <div
                        key={range.id}
                        onClick={() => {
                          setFormData({ ...formData, revenue_range: range.id as any });
                          setValidationError(null);
                        }}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition ${
                          formData.revenue_range === range.id
                            ? 'border-[#1E3A5F] bg-[#1E3A5F]/5 font-bold text-[#0F172A] ring-1 ring-[#1E3A5F]'
                            : 'border-[#E2E8F0] bg-white text-[#475569] hover:border-slate-300'
                        }`}
                      >
                        <p className="text-xs font-bold">{range.label}</p>
                        <p className="text-[10px] text-[#64748B] mt-0.5">{range.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- STEP 6: Eligibility & Udyam Details ---------------- */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] font-mono">
                {language === 'hi' ? 'चरण 6 — पात्रता व पंजीकरण' : 'STEP 6 — ELIGIBILITY & REGISTRATION'}
              </span>
              <h2 className="text-2xl font-bold text-[#0F172A] font-editorial mt-1">
                {language === 'hi' ? 'पात्रता-संबंधी विवरण व उद्यम सत्यापन' : 'Eligibility Attributes & Udyam Verification'}
              </h2>
              <p className="text-sm text-[#475569] mt-1.5">
                {language === 'hi'
                  ? 'आयु, लिंग और सामाजिक श्रेणी आधार पर विशेष रियायतें उपलब्ध होती हैं। वैध आयु सीमा 18 से 115 वर्ष है।'
                  : 'Demographic quotas provide higher capital subsidies (e.g. 35% under PMEGP). Age input range is 18 to 115 years.'}
              </p>
            </div>

            {auth.isAuthenticated && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {language === 'hi'
                    ? `आपके खाते से विवरण स्वचालित रूप से भरे गए हैं (${auth.name}: ${formData.age} वर्ष, ${formData.gender}, ${formData.social_category})`
                    : `Demographic attributes pre-filled from your registered citizen account (${auth.name}: ${formData.age} yrs, ${formData.gender}, ${formData.social_category}).`}
                </span>
              </div>
            )}

            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Age Dropdown (18 - 115) */}
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                    {language === 'hi' ? 'उम्र (18–115 वर्ष) *' : 'Age (18–115 years) *'}
                  </label>
                  <select
                    id="wizard-age-select"
                    value={formData.age}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 18;
                      setFormData({ ...formData, age: val });
                      setValidationError(null);
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                  >
                    {Array.from({ length: 115 - 18 + 1 }, (_, i) => 18 + i).map((num) => (
                      <option key={num} value={num}>
                        {num} {language === 'hi' ? 'वर्ष' : 'years'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                    {language === 'hi' ? 'लिंग *' : 'Gender *'}
                  </label>
                  <select
                    id="wizard-gender-select"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                  >
                    <option value="female">Female (महिला)</option>
                    <option value="male">Male (पुरुष)</option>
                    <option value="transgender">Other / Transgender (तृतीय लिंग)</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                {/* Social Category */}
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                    {language === 'hi' ? 'सामाजिक श्रेणी *' : 'Social Category *'}
                  </label>
                  <select
                    id="wizard-category-select"
                    value={formData.social_category}
                    onChange={(e) => setFormData({ ...formData, social_category: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                  >
                    <option value="General">General (सामान्य)</option>
                    <option value="OBC">OBC (अन्य पिछड़ा वर्ग)</option>
                    <option value="SC/ST">SC/ST (अनुसूचित जाति / जनजाति)</option>
                    <option value="EWS">EWS (आर्थिक रूप से कमजोर वर्ग)</option>
                    <option value="SC">SC (अनुसूचित जाति)</option>
                    <option value="ST">ST (अनुसूचित जनजाति)</option>
                    <option value="Minority">Minority (अल्पसंख्यक)</option>
                  </select>
                </div>
              </div>

              {/* Udyam Registration Branching Architecture */}
              <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">
                      {language === 'hi' ? 'क्या आपके पास एमएसएमई उद्यम पंजीकरण है?' : 'Do you have MSME Udyam Registration?'}
                    </p>
                    <p className="text-[11px] text-[#64748B]">
                      {language === 'hi' ? 'क्रेडिट गारंटी और बैंक सब्सिडी के लिए आवश्यक' : 'Required for CGTMSE credit guarantee and bank subsidy disbursals'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, has_udyam_registration: true })}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                        formData.has_udyam_registration
                          ? 'bg-[#1E3A5F] border-[#1E3A5F] text-white'
                          : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Yes (हाँ)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          has_udyam_registration: false,
                          udyam_registration_number: undefined,
                          udyam_verification_status: 'not_registered'
                        });
                        setUdyamResult(null);
                        setUdyamError(null);
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                        !formData.has_udyam_registration
                          ? 'bg-[#1E3A5F] border-[#1E3A5F] text-white'
                          : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      No (नहीं)
                    </button>
                  </div>
                </div>

                {/* YES Branch: Input and Provider Verification */}
                {formData.has_udyam_registration ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-[#CBD5E1] space-y-3">
                    <label className="block text-xs font-bold text-[#0F172A]">
                      {language === 'hi' ? 'उद्यम पंजीकरण संख्या दर्ज करें' : 'Enter Udyam Registration Number'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={udyamInput}
                        onChange={(e) => setUdyamInput(e.target.value.toUpperCase())}
                        placeholder="UDYAM-UP-00-1234567"
                        className="flex-1 px-3 py-2 text-xs font-mono bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyUdyam}
                        disabled={isVerifyingUdyam || !udyamInput.trim()}
                        className="px-4 py-2 bg-[#1E3A5F] text-white text-xs font-bold rounded-lg hover:bg-[#162D4A] disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                      >
                        {isVerifyingUdyam ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>{language === 'hi' ? 'सत्यापित करें' : 'Verify'}</span>
                      </button>
                    </div>

                    {udyamError && (
                      <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{udyamError}</span>
                      </p>
                    )}

                    {udyamResult && udyamResult.isValid && (
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                        <p className="font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Verified: {udyamResult.enterpriseName}</span>
                        </p>
                        <p className="text-[11px] text-emerald-700">
                          {udyamResult.organizationType} • {udyamResult.majorActivity} • Verified: {new Date(udyamResult.verifiedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* NO Branch: Clear guidance and official portal CTA */
                  <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2">
                    <div className="flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        {language === 'hi'
                          ? 'उद्यम पंजीकरण कुछ एमएसएमई-संबंधित योजनाओं के लिए आवश्यक हो सकता है। यह आधार और पैन के साथ आधिकारिक पोर्टल पर 5 मिनट में पूरी तरह से निःशुल्क बनाया जा सकता है।'
                          : 'Udyam registration may be required for some MSME-related schemes. You can register for free online.'}
                      </p>
                    </div>
                    <a
                      href="https://udyamregistration.gov.in/default.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3A5F] hover:underline"
                    >
                      <span>{language === 'hi' ? 'आधिकारिक पोर्टल पर निःशुल्क पंजीकरण करें' : 'Register Free on Official Portal (udyamregistration.gov.in)'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Wizard Navigation Controls */}
        <div className="mt-10 pt-6 border-t border-[#E2E8F0] flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#475569] hover:text-[#0F172A] transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'पिछला चरण' : 'Previous'}</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="bg-[#1E3A5F] hover:bg-[#162D4A] text-white font-semibold text-xs sm:text-sm py-2.5 sm:py-3 px-6 rounded-lg flex items-center gap-2 transition duration-200 shadow-sm cursor-pointer"
          >
            <span>
              {currentStep === totalSteps
                ? language === 'hi'
                  ? 'पात्र योजनाएं खोजें →'
                  : 'Find My Schemes →'
                : language === 'hi'
                ? 'अगला चरण →'
                : 'Continue →'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
