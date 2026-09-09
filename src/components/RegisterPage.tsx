/**
 * UdyamSetu "Create Your UdyamSetu Profile" — Adaptive Multi-Step Onboarding
 * Progressive 7-Step Wizard tailored for deterministic government scheme discovery.
 * Minimum questions • Maximum recommendation precision • 100% statutory grounding.
 */
import React, { useState } from 'react';
import { useApp, RegistrationFormData } from '../context/AppContext';
import { UserProfile } from '../services/matchingEngine';
import { INDIAN_STATES } from '../data/schemes';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Calendar,
  GraduationCap,
  Users,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building2,
  Sprout,
  Briefcase,
  HelpCircle,
  Award,
  Zap,
  Globe,
  DollarSign,
  TrendingUp,
  Check
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, setUserProfile, executeMatching, setActiveView, language, setLanguage } = useApp();

  // Current Onboarding Step: 1 to 7
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 7;

  // STEP 1: Basic Profile
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<'female' | 'male' | 'transgender' | 'prefer_not_to_say'>('female');
  const [preferredLang, setPreferredLang] = useState<'en' | 'hi'>('en');

  // STEP 2: Location
  const [locationState, setLocationState] = useState<string>('Uttar Pradesh');
  const [district, setDistrict] = useState<string>('Varanasi');
  const [residenceType, setResidenceType] = useState<'rural' | 'urban'>('rural');

  // STEP 3: Social & Household
  const [socialCategory, setSocialCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>('OBC');
  const [maritalStatus, setMaritalStatus] = useState<string>('married');
  const [hasDisability, setHasDisability] = useState<boolean>(false);
  const [minorityCommunity, setMinorityCommunity] = useState<string>('None');
  const [householdSize, setHouseholdSize] = useState<string>('3-4');

  // STEP 4: Education & Employment
  const [educationLevel, setEducationLevel] = useState<string>('10th Pass');
  const [applicantPersona, setApplicantPersona] = useState<string>('existing_entrepreneur');
  const [occupation, setOccupation] = useState<string>('Textile & Garment Artisan');

  // STEP 5: Financial Profile
  const [incomeRange, setIncomeRange] = useState<string>('1_to_3_lakh');

  // STEP 6: Life Situation & Goals (Multi-Select)
  const [fundingNeeds, setFundingNeeds] = useState<string[]>([
    'Starting a business',
    'Machinery & Equipment',
    'Loan',
    'Subsidy'
  ]);

  // STEP 7: Adaptive Specific Profile + Account Security
  const [businessStage, setBusinessStage] = useState<'new' | 'existing'>('new');
  const [businessType, setBusinessType] = useState<string>('Textile');
  const [hasUdyam, setHasUdyam] = useState<boolean>(false);
  const [turnoverRange, setTurnoverRange] = useState<string>('micro_under_10l');
  const [employeeCount, setEmployeeCount] = useState<string>('1-5');

  // Student specific
  const [studentCourse, setStudentCourse] = useState<string>('Undergraduate (Degree / Diploma)');
  const [institutionType, setInstitutionType] = useState<string>('Government / Aided College');

  // Farmer specific
  const [landholding, setLandholding] = useState<string>('Small (1-2 Hectares)');
  const [agriActivity, setAgriActivity] = useState<string>('Dairy Farming & Horticulture');

  // Account Security
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

  // Toggle funding need chips
  const toggleNeed = (need: string) => {
    setFundingNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  // Password strength calculation
  const getPasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: language === 'hi' ? 'कमजोर (Weak)' : 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score: 2, label: language === 'hi' ? 'मध्यम (Moderate)' : 'Moderate', color: 'bg-amber-500' };
    return { score: 3, label: language === 'hi' ? 'मजबूत (Strong)' : 'Strong', color: 'bg-emerald-500' };
  };

  const pwdStrength = getPasswordStrength(password);

  // Dynamic Profile Completeness Calculation (100% based on real completed fields)
  const calculateCompleteness = (): number => {
    let completed = 0;
    const totalChecks = 10;

    if (fullName.trim()) completed++;
    if (age) completed++;
    if (gender) completed++;
    if (locationState) completed++;
    if (district.trim()) completed++;
    if (socialCategory) completed++;
    if (educationLevel) completed++;
    if (incomeRange) completed++;
    if (fundingNeeds.length > 0) completed++;
    if (email.trim() && password.length >= 8) completed++;

    return Math.round((completed / totalChecks) * 100);
  };

  const profileCompleteness = calculateCompleteness();

  // Validate step before advancing
  const handleNextStep = () => {
    setStepError(null);

    if (currentStep === 1) {
      if (!fullName.trim()) {
        setStepError(language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
        return;
      }
    }

    if (currentStep === 2) {
      if (!district.trim()) {
        setStepError(language === 'hi' ? 'कृपया अपना जिला दर्ज करें।' : 'Please enter your district name.');
        return;
      }
    }

    if (currentStep === 6) {
      if (fundingNeeds.length === 0) {
        setStepError(
          language === 'hi'
            ? 'कृपया कम से कम एक आवश्यकता चुनें।'
            : 'Please select at least one support area or financial goal.'
        );
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setStepError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Final Registration & Instant Recommendation Matching
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStepError(null);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStepError(
        language === 'hi'
          ? 'कृपया एक वैध ईमेल पता दर्ज करें।'
          : 'Please enter a valid email address format.'
      );
      return;
    }

    if (password.length < 8) {
      setStepError(
        language === 'hi'
          ? 'पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।'
          : 'Password must be at least 8 characters long.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Prepare Registration Form Data
      const regData: RegistrationFormData = {
        fullName: fullName.trim(),
        email: email.trim(),
        password: password,
        gender: gender === 'female' ? 'Female' : gender === 'male' ? 'Male' : 'Other',
        address: `${district}, ${locationState}`,
        age: age,
        category: socialCategory === 'SC' || socialCategory === 'ST' ? 'SC/ST' : socialCategory,
        educationalQualification: educationLevel
      };

      // 2. Prepare Structured Profile for Deterministic Recommendation Engine
      const fullProfile: UserProfile = {
        full_name: fullName.trim(),
        email: email.trim(),
        age: age,
        gender: gender,
        location_state: locationState,
        district: district.trim(),
        residence_type: residenceType,
        social_category: socialCategory,
        education_level: educationLevel,
        educational_qualification: educationLevel,
        applicant_persona: applicantPersona,
        business_type: businessType,
        funding_need: fundingNeeds,
        business_stage: businessStage,
        business_size_range: turnoverRange,
        has_udyam_registration: hasUdyam,
        is_traditional_artisan: applicantPersona === 'artisan',
        is_street_vendor: applicantPersona === 'street_vendor',
        has_bank_default: false
      };

      // 3. Register user in context
      await register(regData);

      // 4. Update Profile in Context & Execute Deterministic Scheme Matching
      setUserProfile(fullProfile);
      await executeMatching(fullProfile);

      // 5. Navigate to Match Results view
      setActiveView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setStepError(err?.message || (language === 'hi' ? 'पंजीकरण में त्रुटि हुई।' : 'Registration failed.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEntrepreneurPersona =
    applicantPersona === 'existing_entrepreneur' ||
    applicantPersona === 'starting_business' ||
    applicantPersona === 'artisan' ||
    applicantPersona === 'street_vendor';

  const isStudentPersona = applicantPersona === 'student';
  const isFarmerPersona = applicantPersona === 'farmer_dairy';

  return (
    <div className="min-h-[calc(100vh-4.5rem)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#FAFAF7] flex justify-center">
      <div className="max-w-4xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3A5F]/10 border border-[#1E3A5F]/20 text-[#1E3A5F] text-xs font-mono font-bold tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>GOVERNMENT OPPORTUNITY DISCOVERY</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-slate-900 tracking-tight">
                {language === 'hi' ? 'अपना उद्यमसेतु प्रोफाइल बनाएं' : 'Create Your UdyamSetu Profile'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {language === 'hi'
                  ? '7-चरणीय अनुकूलित प्रोफाइल ताकि आप केवल वही योजनाएं देखें जिनके आप पात्र हैं।'
                  : 'An intelligent onboarding flow to match you with central & state schemes you genuinely qualify for.'}
              </p>
            </div>

            {/* Profile Completeness Gauge */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3 shrink-0">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-700 block font-mono">Profile Health</span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {profileCompleteness >= 80 ? '✓ High Match Precision' : 'Personalizing...'}
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center font-mono font-bold text-sm shadow-xs">
                {profileCompleteness}%
              </div>
            </div>
          </div>

          {/* Progress Bar & Step Tabs */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500">
              <span className="text-[#1E3A5F]">
                STEP 0{currentStep} OF 0{totalSteps}:{' '}
                {currentStep === 1 && 'Basic Profile'}
                {currentStep === 2 && 'Location & State'}
                {currentStep === 3 && 'Social & Household'}
                {currentStep === 4 && 'Education & Profession'}
                {currentStep === 5 && 'Financial Profile'}
                {currentStep === 6 && 'Support Goals'}
                {currentStep === 7 && 'Specific Sector & Complete'}
              </span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Completed</span>
            </div>

            {/* Visual Multi-Segment Progress Line */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex gap-1 p-0.5 border border-slate-200">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    idx + 1 <= currentStep ? 'bg-[#FF9933]' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Error Notification */}
        {stepError && (
          <div
            role="alert"
            className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-800 flex items-start gap-3 shadow-xs animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{stepError}</span>
          </div>
        )}

        {/* ==========================================================
            WIZARD CARD CONTAINER
            ========================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8">
          
          {/* ==========================================================
              STEP 1: BASIC PROFILE
              ========================================================== */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#FF9933] uppercase">STEP 01</span>
                <h2 className="text-xl sm:text-2xl font-bold font-editorial text-slate-900">
                  Basic Profile & Identity
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Tell us your name, age, and preferred language for personalized communication.
                </p>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'hi' ? 'पूरा नाम (सरकारी दस्तावेजों के अनुसार)' : 'Full Name (As per official records)'}
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Savitri Devi / Rajesh Kumar"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#1E3A5F] text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1E3A5F]/15 transition"
                  />
                </div>
              </div>

              {/* Age Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'hi' ? 'आपकी आयु (वर्ष)' : 'Your Age (Years)'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={18}
                    max={100}
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                    className="w-32 px-3.5 py-3 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 text-slate-900 text-sm font-mono font-bold focus:outline-hidden focus:border-[#1E3A5F]"
                  />
                  <span className="text-xs text-slate-500">
                    Accessible to Indian citizens aged 18+ for credit and subsidy programs.
                  </span>
                </div>
              </div>

              {/* Gender Segmented Chips */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'hi' ? 'लिंग (Gender)' : 'Gender'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'female', label: 'Female (महिला)' },
                    { id: 'male', label: 'Male (पुरुष)' },
                    { id: 'transgender', label: 'Transgender' },
                    { id: 'prefer_not_to_say', label: 'Prefer not to say' }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGender(g.id as any)}
                      className={`py-3 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        gender === g.id
                          ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {gender === g.id && <Check className="w-3.5 h-3.5 text-[#FF9933]" />}
                      <span>{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Why We Ask Helper Card */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3 text-xs text-blue-900">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Why we ask for this information:</span>
                  <p className="text-blue-800/90 leading-relaxed">
                    Age and gender criteria unlock dedicated quotas (such as Stand-Up India for women entrepreneurs or PMKVY youth training stipends).
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================================
              STEP 2: LOCATION PROFILE
              ========================================================== */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#FF9933] uppercase">STEP 02</span>
                <h2 className="text-xl sm:text-2xl font-bold font-editorial text-slate-900">
                  Location & Domicile
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Many flagship capital subsidies are exclusive to specific Indian States and rural areas.
                </p>
              </div>

              {/* State / UT Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'hi' ? 'राज्य / केंद्र शासित प्रदेश' : 'State / Union Territory'}
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    value={locationState}
                    onChange={(e) => setLocationState(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#1E3A5F] text-slate-900 text-sm font-semibold focus:outline-hidden"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st.id} value={st.name}>
                        {st.name} ({st.name_hi}) • {st.total_schemes} Verified Schemes
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* District Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'hi' ? 'जिला (District)' : 'District'}
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Varanasi / Pune / Coimbatore"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#1E3A5F] text-slate-900 text-sm focus:outline-hidden"
                />
              </div>

              {/* Area Type: Rural vs Urban */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'hi' ? 'क्षेत्र का प्रकार (Area Type)' : 'Area Type'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setResidenceType('rural')}
                    className={`p-4 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      residenceType === 'rural'
                        ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl">🌾</span>
                    <span>Rural (ग्रामीण - Unlocks 35% Subsidy)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResidenceType('urban')}
                    className={`p-4 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      residenceType === 'urban'
                        ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl">🏙️</span>
                    <span>Urban (शहरी - Unlocks 25% Subsidy)</span>
                  </button>
                </div>
              </div>

              {/* Why We Ask */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Statutory Subsidy Impact:</span>
                  <p className="text-emerald-800/90 leading-relaxed">
                    Under PMEGP guidelines, units established in Rural locations automatically receive a 35% special capital subsidy grant compared to 25% in Urban areas.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================================
              STEP 3: SOCIAL & HOUSEHOLD PROFILE
              ========================================================== */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#FF9933] uppercase">STEP 03</span>
                <h2 className="text-xl sm:text-2xl font-bold font-editorial text-slate-900">
                  Social & Household Demographics
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Affirmative action guidelines in government schemes grant higher subsidies to designated categories.
                </p>
              </div>

              {/* Social Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'hi' ? 'सामाजिक श्रेणी (Social Category)' : 'Social Category'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { id: 'General', label: 'General' },
                    { id: 'OBC', label: 'OBC' },
                    { id: 'SC', label: 'SC' },
                    { id: 'ST', label: 'ST' },
                    { id: 'EWS', label: 'EWS' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSocialCategory(cat.id as any)}
                      className={`py-3 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        socialCategory === cat.id
                          ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {socialCategory === cat.id && <Check className="w-3.5 h-3.5 text-[#FF9933]" />}
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Disability Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'hi' ? 'दिव्यांगजन स्थिति (Persons with Benchmark Disability)' : 'Divyangjan (PwD) Status'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setHasDisability(false)}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      !hasDisability
                        ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    No (नहीं)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasDisability(true)}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      hasDisability
                        ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Yes (40%+ Benchmark Disability)
                  </button>
                </div>
              </div>

              {/* Household Size */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'hi' ? 'परिवार के आश्रितों की संख्या' : 'Household Size / Dependents'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['1-2', '3-4', '5+'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setHouseholdSize(sz)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        householdSize === sz
                          ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {sz} Members
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==========================================================
              STEP 4: EDUCATION & EMPLOYMENT STATUS
              ========================================================== */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#FF9933] uppercase">STEP 04</span>
                <h2 className="text-xl sm:text-2xl font-bold font-editorial text-slate-900">
                  Education & Primary Occupation
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Select your background to discover trade-affinity and scholarship grants.
                </p>
              </div>

              {/* Primary Status Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'hi' ? 'आपकी वर्तमान प्राथमिक स्थिति' : 'Your Primary Current Status'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { id: 'existing_entrepreneur', label: 'Small Business / MSME', icon: '🏭' },
                    { id: 'starting_business', label: 'Aspiring Entrepreneur', icon: '🚀' },
                    { id: 'artisan', label: 'Artisan / Traditional Craft', icon: '🧵' },
                    { id: 'farmer_dairy', label: 'Farmer / Dairy Owner', icon: '🌾' },
                    { id: 'student', label: 'Student / Scholar', icon: '🎓' },
                    { id: 'street_vendor', label: 'Street Vendor', icon: '🛒' },
                    { id: 'employed', label: 'Employed Worker', icon: '💼' },
                    { id: 'unemployed', label: 'Job Seeker / Training', icon: '🛠️' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setApplicantPersona(p.id)}
                      className={`p-3.5 rounded-xl border text-xs font-bold transition flex items-center gap-2.5 cursor-pointer text-left ${
                        applicantPersona === p.id
                          ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xl">{p.icon}</span>
                      <span className="leading-snug">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Educational Qualification */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'hi' ? 'उच्चतम शैक्षणिक योग्यता' : 'Highest Educational Qualification'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    'Below 10th',
                    '10th Pass',
                    '12th Pass',
                    'ITI / Diploma',
                    'Graduate (Degree)',
                    'Postgraduate / Higher'
                  ].map((ed) => (
                    <button
                      key={ed}
                      type="button"
                      onClick={() => setEducationLevel(ed)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        educationLevel === ed
                          ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {ed}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==========================================================
              STEP 5: FINANCIAL PROFILE (NO SENSITIVE BANKING DATA)
              ========================================================== */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#FF9933] uppercase">STEP 05</span>
                <h2 className="text-xl sm:text-2xl font-bold font-editorial text-slate-900">
                  Annual Household Income Bracket
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Income thresholds determine eligibility for interest subventions and economic support grants.
                </p>
              </div>

              {/* Income Brackets */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'hi' ? 'वार्षिक पारिवारिक आय सीमा' : 'Annual Household Income Range'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'under_1_lakh', label: 'Below ₹1 Lakh (BPL / Antyodaya)', desc: 'Eligible for highest subsidy & 100% DBT waivers' },
                    { id: '1_to_3_lakh', label: '₹1 Lakh – ₹3 Lakh', desc: 'Standard MSME micro-credit & scholarship bracket' },
                    { id: '3_to_5_lakh', label: '₹3 Lakh – ₹5 Lakh', desc: 'PMEGP & Stand-Up India priority bracket' },
                    { id: '5_to_8_lakh', label: '₹5 Lakh – ₹8 Lakh (EWS Ceiling)', desc: 'Eligible for central interest subsidies' },
                    { id: '8_to_12_lakh', label: '₹8 Lakh – ₹12 Lakh', desc: 'Commercial enterprise loan subsidies' },
                    { id: 'above_12_lakh', label: 'Above ₹12 Lakh', desc: 'Industrial infrastructure & CGTMSE credit' }
                  ].map((inc) => (
                    <button
                      key={inc.id}
                      type="button"
                      onClick={() => setIncomeRange(inc.id)}
                      className={`p-4 rounded-xl border text-left transition flex items-start justify-between gap-2 cursor-pointer ${
                        incomeRange === inc.id
                          ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">{inc.label}</span>
                        <span className={`text-[11px] block mt-0.5 ${incomeRange === inc.id ? 'text-slate-200' : 'text-slate-500'}`}>
                          {inc.desc}
                        </span>
                      </div>
                      {incomeRange === inc.id && <Check className="w-4 h-4 text-[#FF9933] shrink-0 mt-0.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Privacy & Security Guarantee Banner */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3 text-xs text-amber-950">
                <ShieldCheck className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Privacy & Security Guarantee:</span>
                  <p className="text-amber-900/90 leading-relaxed">
                    UdyamSetu strictly performs scheme matching. We NEVER ask for bank accounts, UPI PINs, passwords, or credit credentials.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================================
              STEP 6: LIFE SITUATION & SUPPORT GOALS (MULTI-SELECT)
              ========================================================== */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#FF9933] uppercase">STEP 06</span>
                <h2 className="text-xl sm:text-2xl font-bold font-editorial text-slate-900">
                  What Are You Looking For Right Now?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Select all financial assistance and support areas you want UdyamSetu to search for.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: 'Loan', label: 'Bank Loan / Credit', icon: '💰', desc: 'Collateral-free Mudra / CGTMSE loans' },
                  { id: 'Subsidy', label: 'Capital Subsidy Grant', icon: '🎁', desc: '15% to 35% non-repayable govt subsidy' },
                  { id: 'Scholarship', label: 'Scholarship & Fee Support', icon: '🎓', desc: 'DBT merit & pre/post matric waivers' },
                  { id: 'Machinery & Equipment', label: 'Machinery & Toolkits', icon: '⚙️', desc: 'PM Vishwakarma & equipment grants' },
                  { id: 'Starting a business', label: 'Starting a New Business', icon: '🚀', desc: 'Greenfield project assistance' },
                  { id: 'Working capital', label: 'Working Capital Support', icon: '🛒', desc: 'Day-to-day inventory & raw material credit' },
                  { id: 'Training', label: 'Skill Training & Certification', icon: '🛠️', desc: 'PMKVY & EDP training stipends' },
                  { id: 'Women Support', label: 'Women Entrepreneur Grant', icon: '👩‍💼', desc: '75% machinery subsidy & Stand-Up India' },
                  { id: 'Agriculture', label: 'Agri & Dairy Infrastructure', icon: '🌾', desc: 'Solar pumps & food processing funds' }
                ].map((item) => {
                  const isSelected = fundingNeeds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleNeed(item.id)}
                      className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] shadow-sm ring-1 ring-[#1E3A5F]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{item.icon}</span>
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                            isSelected ? 'bg-[#FF9933] border-[#FF9933] text-slate-950' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-bold block">{item.label}</span>
                        <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                          {item.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          )}

          {/* ==========================================================
              STEP 7: ADAPTIVE CONDITIONAL SECTION & ACCOUNT SECURITY
              ========================================================== */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#FF9933] uppercase">STEP 07</span>
                <h2 className="text-xl sm:text-2xl font-bold font-editorial text-slate-900">
                  Profile Details & Account Security
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Finalize your sector parameters and set your login password to save your matched schemes.
                </p>
              </div>

              {/* Conditional Entrepreneur / MSME Form */}
              {isEntrepreneurPersona && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1E3A5F] uppercase">
                    <Building2 className="w-4 h-4 text-[#FF9933]" />
                    <span>MSME & Enterprise Details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Industry Sector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Industry Sector</label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
                      >
                        <option value="Manufacturing">Manufacturing & Engineering</option>
                        <option value="Textile">Textile, Handloom & Apparel</option>
                        <option value="Food Processing">Food Processing & Agri Units</option>
                        <option value="Handicraft">Handicraft & Artisan Crafts</option>
                        <option value="Retail">Retail Trade & Commercial</option>
                        <option value="Services">Services & IT Solutions</option>
                      </select>
                    </div>

                    {/* Stage */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Business Stage</label>
                      <select
                        value={businessStage}
                        onChange={(e) => setBusinessStage(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
                      >
                        <option value="new">Planning / Greenfield (New Unit)</option>
                        <option value="existing">Existing Unit (&lt;3 Years)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional Student Form */}
              {isStudentPersona && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1E3A5F] uppercase">
                    <GraduationCap className="w-4 h-4 text-[#FF9933]" />
                    <span>Academic & Course Details</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Current Course / Level</label>
                      <input
                        type="text"
                        value={studentCourse}
                        onChange={(e) => setStudentCourse(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Institution Type</label>
                      <input
                        type="text"
                        value={institutionType}
                        onChange={(e) => setInstitutionType(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Account Credentials */}
              <div className="border-t border-slate-200/80 pt-4 space-y-4">
                <h3 className="text-sm font-bold font-editorial text-slate-900">
                  Account Credentials for Saving Scheme Applications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#1E3A5F]"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Set Password (Min. 8 characters)</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#1E3A5F]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-slate-400"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    <div className="flex items-center gap-2 pt-1 text-[11px]">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                        <div className={`h-full flex-1 ${pwdStrength.score >= 1 ? pwdStrength.color : 'bg-slate-200'}`} />
                        <div className={`h-full flex-1 ${pwdStrength.score >= 2 ? pwdStrength.color : 'bg-slate-200'}`} />
                        <div className={`h-full flex-1 ${pwdStrength.score >= 3 ? pwdStrength.color : 'bg-slate-200'}`} />
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">{pwdStrength.label}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Summary Tag */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">Profile Ready for Deterministic Evaluation</span>
                  <span className="text-slate-500 text-[11px]">
                    Location: {locationState} • Age: {age} • Category: {socialCategory} • Persona: {applicantPersona}
                  </span>
                </div>
                <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                  {profileCompleteness}% Complete
                </span>
              </div>

            </div>
          )}

          {/* ==========================================================
              BOTTOM NAVIGATION CONTROLS (Back & Save / Continue)
              ========================================================== */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
            
            <button
              type="button"
              disabled={currentStep === 1 || isSubmitting}
              onClick={handlePrevStep}
              className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-7 py-3.5 bg-[#1E3A5F] hover:bg-[#162D4A] active:scale-[0.98] text-white text-xs sm:text-sm font-bold rounded-xl transition duration-200 flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Save & Continue →</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="px-8 py-4 bg-[#FF9933] hover:bg-[#E68A00] active:scale-[0.98] disabled:opacity-60 text-slate-950 text-sm sm:text-base font-bold rounded-xl transition duration-200 flex items-center gap-2.5 shadow-lg cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Evaluating 2,066+ Schemes...</span>
                ) : (
                  <>
                    <span>Create Profile & Discover My Schemes →</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
