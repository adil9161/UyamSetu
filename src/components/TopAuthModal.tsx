import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  X,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Calendar,
  GraduationCap
} from 'lucide-react';

interface TopAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const TopAuthModal: React.FC<TopAuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const { login, register, setActiveView, language } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Sync mode when initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Quick Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRetypePassword, setRegRetypePassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegRetypePassword, setShowRegRetypePassword] = useState(false);
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>('Female');
  const [regAddress, setRegAddress] = useState('');
  const [regAge, setRegAge] = useState<number>(28);
  const [regCategory, setRegCategory] = useState<'General' | 'OBC' | 'SC/ST' | 'EWS'>('General');
  const [regQualification, setRegQualification] = useState('10th Pass');
  const [regError, setRegError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Age options: 18 to 115
  const ageOptions = Array.from({ length: 115 - 18 + 1 }, (_, i) => 18 + i);

  // Category options
  const categoryOptions = [
    { value: 'General', labelEn: 'General', labelHi: 'सामान्य (General)' },
    { value: 'OBC', labelEn: 'OBC', labelHi: 'अन्य पिछड़ा वर्ग (OBC)' },
    { value: 'SC/ST', labelEn: 'SC/ST', labelHi: 'अनुसूचित जाति/जनजाति (SC/ST)' },
    { value: 'EWS', labelEn: 'EWS', labelHi: 'आर्थिक रूप से कमजोर (EWS)' }
  ];

  // Qualification options
  const qualificationOptions = [
    'Below 10th',
    '10th Pass',
    '12th Pass',
    'ITI',
    'Diploma',
    'Undergraduate',
    'Graduate',
    'Postgraduate',
    'PhD',
    'Other'
  ];

  // Restore remembered email on mount
  useEffect(() => {
    const saved = localStorage.getItem('udyamsetu_remembered_email');
    if (saved) {
      setLoginEmail(saved);
      setRememberMe(true);
    }
  }, []);

  if (!isOpen) return null;

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim()) {
      setLoginError(language === 'hi' ? 'कृपया ईमेल दर्ज करें।' : 'Please enter your email address.');
      return;
    }
    if (!loginPassword) {
      setLoginError(language === 'hi' ? 'कृपया पासवर्ड दर्ज करें।' : 'Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (rememberMe) {
        localStorage.setItem('udyamsetu_remembered_email', loginEmail.trim());
      } else {
        localStorage.removeItem('udyamsetu_remembered_email');
      }

      const res = await login(loginEmail.trim(), loginPassword);
      if (res.success) {
        onClose();
        setActiveView('match');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setLoginError(res.error || (language === 'hi' ? 'लॉगिन विफल रहा।' : 'Login failed. Please check credentials.'));
      }
    } catch (err: any) {
      setLoginError(err?.message || (language === 'hi' ? 'त्रुटि हुई।' : 'An error occurred during login.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Register submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    // Validation
    if (!regFullName.trim()) {
      setRegError(language === 'hi' ? 'पूरा नाम अनिवार्य है।' : 'Full Name is required.');
      return;
    }
    if (!regEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      setRegError(language === 'hi' ? 'वैध ईमेल पता दर्ज करें।' : 'Please enter a valid email address.');
      return;
    }
    if (!regPassword || regPassword.length < 8) {
      setRegError(language === 'hi' ? 'पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।' : 'Password must be at least 8 characters.');
      return;
    }
    if (regPassword !== regRetypePassword) {
      setRegError(language === 'hi' ? 'पासवर्ड मेल नहीं खाते हैं।' : 'Password and Re-type Password do not match.');
      return;
    }
    if (!regAddress.trim()) {
      setRegError(language === 'hi' ? 'पता अनिवार्य है।' : 'Address is required.');
      return;
    }
    if (regAge < 18 || regAge > 115) {
      setRegError(language === 'hi' ? 'आयु 18 से 115 वर्ष के बीच होनी चाहिए।' : 'Age must be between 18 and 115.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        fullName: regFullName.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        gender: regGender,
        address: regAddress.trim(),
        age: Number(regAge),
        category: regCategory,
        educationalQualification: regQualification
      });

      if (res.success) {
        onClose();
        setActiveView('match');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setRegError(res.error || (language === 'hi' ? 'पंजीकरण विफल रहा।' : 'Registration failed. Please try again.'));
      }
    } catch (err: any) {
      setRegError(err?.message || (language === 'hi' ? 'त्रुटि हुई।' : 'An error occurred during registration.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="top-auth-modal-overlay"
      className="fixed inset-0 z-50 bg-[#0F172A]/75 backdrop-blur-xs flex items-start justify-center p-3 sm:p-4 overflow-y-auto transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-[#CBD5E1] my-4 sm:my-8 transition-all relative transform duration-200 ease-out will-change-transform">
        
        {/* Top Tricolour Header Band */}
        <div className="tricolour-bar-lg" />

        {/* Modal Close Button */}
        <button
          id="top-auth-modal-close"
          onClick={onClose}
          className="absolute right-3.5 top-3.5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#138808] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E3A5F]">
              {language === 'hi' ? 'उद्यमसेतु नागरिक पोर्टल' : 'UdyamSetu Citizen Portal'}
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-lg bg-slate-100 p-1 mt-1">
            <button
              id="top-modal-tab-login"
              type="button"
              onClick={() => {
                setMode('login');
                setLoginError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#1E3A5F] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'hi' ? 'साइन इन (Sign In)' : 'Sign In'}
            </button>
            <button
              id="top-modal-tab-register"
              type="button"
              onClick={() => {
                setMode('register');
                setRegError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#1E3A5F] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'hi' ? 'खाता बनाएं (Create Account)' : 'Create Your Account'}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* ================= MODE: LOGIN ================= */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
              
              {loginError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  {language === 'hi' ? 'ईमेल पता *' : 'Email Address *'}
                </label>
                <div className="relative">
                  <input
                    id="top-modal-login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder="name@domain.com"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] transition"
                    autoComplete="username"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#0F172A]">
                    {language === 'hi' ? 'पासवर्ड *' : 'Password *'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(loginEmail);
                      setForgotModalOpen(true);
                    }}
                    className="text-[11px] text-[#1E3A5F] hover:underline font-semibold cursor-pointer"
                  >
                    {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="top-modal-login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] transition"
                    autoComplete="current-password"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="top-modal-login-remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#1E3A5F] rounded border-slate-300 focus:ring-[#1E3A5F] cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 font-medium select-none">
                    {language === 'hi' ? 'मुझे याद रखें (Remember Me)' : 'Remember Me'}
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                id="top-modal-login-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1E3A5F] hover:bg-[#162D4A] text-white font-semibold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-200 shadow-sm cursor-pointer disabled:opacity-75"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{language === 'hi' ? 'लॉगिन करें' : 'Login'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Switch link */}
              <div className="text-center pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>
                  {language === 'hi' ? 'खाता नहीं है?' : "Don't have an account?"}{' '}
                  <button
                    id="top-modal-switch-to-register"
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setRegError(null);
                    }}
                    className="font-bold text-[#1E3A5F] hover:underline cursor-pointer"
                  >
                    {language === 'hi' ? 'खाता बनाएं' : 'Create Account'}
                  </button>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setActiveView('login');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#1E3A5F] hover:underline font-medium cursor-pointer"
                >
                  Full Page View →
                </button>
              </div>
            </form>
          )}

          {/* ================= MODE: REGISTER ================= */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3" noValidate>
              
              {regError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  {language === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <input
                    id="top-modal-reg-fullname"
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Savitri Devi"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] transition"
                    required
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* 2. Email */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  {language === 'hi' ? 'ईमेल पता *' : 'Email Address *'}
                </label>
                <div className="relative">
                  <input
                    id="top-modal-reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] transition"
                    required
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* 3 & 4. Password & Re-type */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    {language === 'hi' ? 'पासवर्ड *' : 'Password *'}
                  </label>
                  <div className="relative">
                    <input
                      id="top-modal-reg-password"
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 8 chars"
                      className="w-full pl-8 pr-7 py-2 text-xs bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                      required
                    />
                    <Lock className="w-3 h-3 text-slate-400 absolute left-2.5 top-2.5" />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showRegPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    {language === 'hi' ? 'पासवर्ड दोबारा *' : 'Re-type Password *'}
                  </label>
                  <div className="relative">
                    <input
                      id="top-modal-reg-retype"
                      type={showRegRetypePassword ? 'text' : 'password'}
                      value={regRetypePassword}
                      onChange={(e) => setRegRetypePassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-8 pr-7 py-2 text-xs bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                      required
                    />
                    <Lock className="w-3 h-3 text-slate-400 absolute left-2.5 top-2.5" />
                    <button
                      type="button"
                      onClick={() => setShowRegRetypePassword(!showRegRetypePassword)}
                      className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showRegRetypePassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* 5, 7, 8: Gender, Age, Category Grid */}
              <div className="grid grid-cols-3 gap-2">
                {/* 5. Gender */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                    {language === 'hi' ? 'लिंग *' : 'Gender *'}
                  </label>
                  <select
                    id="top-modal-reg-gender"
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value as any)}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                {/* 7. Age (18-115) */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                    {language === 'hi' ? 'आयु (18-115) *' : 'Age (18–115) *'}
                  </label>
                  <select
                    id="top-modal-reg-age"
                    value={regAge}
                    onChange={(e) => setRegAge(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                  >
                    {ageOptions.map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 8. Category */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                    {language === 'hi' ? 'श्रेणी *' : 'Category *'}
                  </label>
                  <select
                    id="top-modal-reg-category"
                    value={regCategory}
                    onChange={(e) => setRegCategory(e.target.value as any)}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 9. Educational Qualification */}
              <div>
                <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                  {language === 'hi' ? 'शैक्षणिक योग्यता *' : 'Educational Qualification *'}
                </label>
                <select
                  id="top-modal-reg-qualification"
                  value={regQualification}
                  onChange={(e) => setRegQualification(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                >
                  {qualificationOptions.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. Address (multiline) */}
              <div>
                <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                  {language === 'hi' ? 'पता (Address) *' : 'Address *'}
                </label>
                <textarea
                  id="top-modal-reg-address"
                  rows={2}
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="Street, City, State, PIN"
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] resize-none"
                  required
                />
              </div>

              {/* Submit button */}
              <button
                id="top-modal-reg-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1E3A5F] hover:bg-[#162D4A] text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-200 shadow-sm cursor-pointer disabled:opacity-75"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{language === 'hi' ? 'खाता बनाएं एवं योजनाएं खोजें' : 'Create Account & Find Schemes'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* Switch link */}
              <div className="text-center pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  {language === 'hi' ? 'पहले से खाता है?' : 'Have an account?'}{' '}
                  <button
                    id="top-modal-switch-to-login"
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setLoginError(null);
                    }}
                    className="font-bold text-[#1E3A5F] hover:underline cursor-pointer"
                  >
                    {language === 'hi' ? 'साइन इन करें' : 'Sign In'}
                  </button>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setActiveView('register');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#1E3A5F] hover:underline font-medium cursor-pointer"
                >
                  Full Page View →
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

      {/* Forgot Password Sub-Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#1E3A5F]" />
                <h3 className="text-sm font-bold text-slate-900 font-editorial">
                  {language === 'hi' ? 'पासवर्ड सहायता' : 'Forgot Password'}
                </h3>
              </div>
              <button onClick={() => setForgotModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {!forgotSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (forgotEmail.trim()) setForgotSubmitted(true);
                }}
                className="space-y-3"
              >
                <p className="text-xs text-slate-600">
                  {language === 'hi' ? 'अपना पंजीकृत ईमेल दर्ज करें:' : 'Enter your registered email address:'}
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-[#1E3A5F] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#162D4A] transition cursor-pointer"
                >
                  {language === 'hi' ? 'रीसेट लिंक भेजें' : 'Send Reset Link'}
                </button>
              </form>
            ) : (
              <div className="text-center py-2 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-800">
                  {language === 'hi' ? 'निर्देश भेजे गए' : 'Instructions Dispatched'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {language === 'hi' ? `यदि ${forgotEmail} मौजूद है तो लिंक भेजा गया है।` : `If ${forgotEmail} is registered, a reset email has been sent.`}
                </p>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="text-xs font-bold text-[#1E3A5F] hover:underline cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
