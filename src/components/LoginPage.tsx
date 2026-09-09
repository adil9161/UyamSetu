/**
 * UdyamSetu National-Grade Citizen Login Experience
 * Features respectful continuous 16s clockwise rotating Ashoka Chakra visual identity.
 * Split composition: Left Brand & Rotating Chakra Panel • Right Citizen Authentication Card.
 */
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useMotion } from '../motion/MotionProvider';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  X,
  CheckCircle2,
  Globe,
  Sparkles,
  Building2,
  Cpu
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setActiveView, language, setLanguage } = useApp();
  const { isReducedMotion } = useMotion();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Restore remembered email if present
  useEffect(() => {
    const savedEmail = localStorage.getItem('udyamsetu_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMessage(
        language === 'hi' ? 'कृपया अपना ईमेल या मोबाइल नंबर दर्ज करें।' : 'Please enter your email or mobile number.'
      );
      return;
    }

    if (!password) {
      setErrorMessage(
        language === 'hi' ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Please enter your password.'
      );
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (rememberMe) {
        localStorage.setItem('udyamsetu_remembered_email', email.trim());
      } else {
        localStorage.removeItem('udyamsetu_remembered_email');
      }

      const result = await login(email.trim(), password);

      if (result.success) {
        setActiveView('match');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMessage(
          result.error ||
            (language === 'hi'
              ? 'लॉगिन विफल रहा। कृपया अपनी क्रेडेंशियल जांचें।'
              : 'Login failed. Please verify your credentials and try again.')
        );
      }
    } catch (err: any) {
      setErrorMessage(err?.message || (language === 'hi' ? 'त्रुटि हुई।' : 'An error occurred during login.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#FAFAF7] flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* ==========================================================
            LEFT PANEL: BRAND & RESPECTFUL ROTATING ASHOKA CHAKRA
            ========================================================== */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0B1528] via-[#10223E] to-[#0A1220] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle National Tricolour Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

          {/* Dotted Background Matrix */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-mono font-bold tracking-wider text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>GOVERNMENT SCHEME DISCOVERY PLATFORM</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial tracking-tight text-white">
              UDYAMSETU
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {language === 'hi'
                ? 'नागरिकों को अवसरों से जोड़ना।'
                : 'Connecting citizens with opportunities.'}
            </p>
          </div>

          {/* CENTER: RESPECTFUL 24-SPOKE ROTATING ASHOKA CHAKRA */}
          <div className="relative z-10 my-6 sm:my-8 flex flex-col items-center justify-center">
            
            {/* Outer Subtle Background Glow */}
            <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

            {/* Respectful Rotating SVG Container */}
            <div className="relative w-40 h-40 sm:w-52 sm:h-52 flex items-center justify-center p-3 rounded-full border border-white/15 bg-slate-950/40 shadow-inner">
              <svg
                role="img"
                aria-label="National Ashoka Chakra - 24 Spokes of Dharma and Progress"
                className={`w-full h-full text-blue-200/95 ${
                  isReducedMotion ? 'ashoka-chakra-static' : 'ashoka-chakra-rotating'
                }`}
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer Circular Ring */}
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.9" />
                <circle cx="50" cy="50" r="41.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                
                {/* Central Hub */}
                <circle cx="50" cy="50" r="7.5" fill="currentColor" opacity="0.95" />
                <circle cx="50" cy="50" r="3.2" fill="#0B1528" />

                {/* 24 Statutory Spokes */}
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (i * 360) / 24;
                  return (
                    <g key={i} transform={`rotate(${angle} 50 50)`}>
                      <line
                        x1="50"
                        y1="50"
                        x2="50"
                        y2="8.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        opacity="0.9"
                      />
                      <circle cx="50" cy="9.8" r="1.1" fill="currentColor" opacity="0.8" />
                    </g>
                  );
                })}
              </svg>
            </div>

            <p className="text-[11px] font-mono tracking-widest text-slate-400 mt-3.5 uppercase">
              24 Spokes • Continuous Progress
            </p>
          </div>

          {/* Bottom Mission Statement & Trust Indicators */}
          <div className="relative z-10 pt-4 border-t border-white/10 space-y-2.5">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              {language === 'hi'
                ? 'सरकारी योजनाओं की खोज करें। अपनी पात्रता समझें। अगला कदम उठाएं।'
                : 'Discover government schemes. Understand your eligibility. Take your next step.'}
            </p>
            <div className="flex flex-col gap-1.5 text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                <span>2,066+ Verified Central & State Schemes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF9933] shrink-0" />
                <span>Zero Hallucination Deterministic Engine</span>
              </div>
            </div>
          </div>

        </div>

        {/* ==========================================================
            RIGHT PANEL: CITIZEN AUTHENTICATION PANEL
            ========================================================== */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white">
          
          {/* Top Header & Language Toggle */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-6">
              
              {/* Language Switcher */}
              <div className="flex items-center text-xs font-semibold bg-slate-100 border border-slate-200 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-md transition text-xs ${
                    language === 'en' ? 'bg-[#1E3A5F] text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`px-2.5 py-1 rounded-md transition text-xs ${
                    language === 'hi' ? 'bg-[#1E3A5F] text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  हिंदी
                </button>
              </div>

              {/* Guest Skip */}
              <button
                type="button"
                onClick={() => {
                  setActiveView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-slate-500 hover:text-[#1E3A5F] transition"
              >
                {language === 'hi' ? 'अतिथि के रूप में देखें →' : 'Browse as guest →'}
              </button>
            </div>

            <div className="space-y-1.5 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-slate-900 tracking-tight">
                {language === 'hi' ? 'उद्यमसेतु में पुनः स्वागत है' : 'Welcome Back'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {language === 'hi'
                  ? 'उद्यमसेतु जारी रखने के लिए साइन इन करें'
                  : 'Sign in to continue to UdyamSetu'}
              </p>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div
                role="alert"
                className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Email / Mobile */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'hi' ? 'ईमेल या मोबाइल नंबर' : 'Email Address or Mobile Number'}
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="name@example.com or +91 98765 43210"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#1E3A5F] text-slate-900 placeholder:text-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1E3A5F]/15 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 block">
                    {language === 'hi' ? 'पासवर्ड' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs font-semibold text-[#1E3A5F] hover:underline cursor-pointer"
                  >
                    {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot password?'}
                  </button>
                </div>

                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#1E3A5F] text-slate-900 placeholder:text-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1E3A5F]/15 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMeCheckbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#1E3A5F] rounded border-slate-300 focus:ring-[#1E3A5F]"
                />
                <label htmlFor="rememberMeCheckbox" className="text-xs text-slate-600 cursor-pointer">
                  {language === 'hi' ? 'मुझे याद रखें' : 'Remember me on this browser'}
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#1E3A5F] hover:bg-[#162D4A] active:scale-[0.99] disabled:opacity-60 text-white font-bold text-sm rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <span>{language === 'hi' ? 'प्रमाणीकरण हो रहा है...' : 'Signing in...'}</span>
                ) : (
                  <>
                    <span>{language === 'hi' ? 'साइन इन करें →' : 'Sign In →'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Bottom Prompt: Link to Adaptive Onboarding */}
          <div className="pt-6 mt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              {language === 'hi' ? 'क्या आपका खाता नहीं है?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setActiveView('register');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="font-bold text-[#1E3A5F] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'hi' ? 'उद्यमसेतु प्रोफाइल बनाएं →' : 'Create your UdyamSetu profile →'}</span>
              </button>
            </p>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-editorial text-slate-900">
                {language === 'hi' ? 'पासवर्ड रीसेट करें' : 'Reset Password'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setForgotModalOpen(false);
                  setForgotSubmitted(false);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                <p className="font-bold">Reset instructions sent!</p>
                <p>If an account exists for {forgotEmail}, you will receive a secure recovery link.</p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <p className="text-xs text-slate-500">
                  Enter your registered email address to receive secure OTP verification.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#1E3A5F]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1E3A5F] hover:bg-[#162D4A] text-white text-xs font-bold rounded-xl transition"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
