import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, MatchResult, runEligibilityMatching } from '../services/matchingEngine';
import { Scheme, VERIFIED_SCHEMES, INDIAN_STATES } from '../data/schemes';
import { api } from '../services/api';

export const detectStateFromAddress = (addr?: string): string | undefined => {
  if (!addr) return undefined;
  const lower = addr.toLowerCase();
  for (const st of INDIAN_STATES) {
    if (lower.includes(st.name.toLowerCase())) {
      return st.name;
    }
  }
  if (lower.includes('up') || lower.includes('u.p.')) return 'Uttar Pradesh';
  if (lower.includes('mh') || lower.includes('maharashtra')) return 'Maharashtra';
  if (lower.includes('mp') || lower.includes('m.p.')) return 'Madhya Pradesh';
  if (lower.includes('delhi')) return 'Delhi';
  if (lower.includes('bengal') || lower.includes('kolkata')) return 'West Bengal';
  if (lower.includes('gujarat')) return 'Gujarat';
  if (lower.includes('rajasthan')) return 'Rajasthan';
  if (lower.includes('tamil nadu') || lower.includes('chennai')) return 'Tamil Nadu';
  if (lower.includes('karnataka') || lower.includes('bengaluru') || lower.includes('bangalore')) return 'Karnataka';
  return undefined;
};

export interface SavedApplication {
  schemeId: string;
  schemeName: string;
  savedAt: string;
  notes: string;
  completedDocs: string[]; // document IDs
  preparationStatus: number; // 0 to 100%
  officialRefNumber?: string;
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  password: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  address: string;
  age: number; // 18 to 115
  category: 'General' | 'OBC' | 'SC/ST' | 'EWS';
  educationalQualification: string;
}

export interface UserAuth {
  isAuthenticated: boolean;
  name: string;
  phoneOrEmail: string;
  role: 'user' | 'admin' | 'data_reviewer';
  email?: string;
  gender?: string;
  address?: string;
  age?: number;
  social_category?: string;
  education_level?: string;
}

export interface IssueReport {
  schemeId: string;
  schemeName: string;
  issueType: 'outdated_info' | 'incorrect_eligibility' | 'broken_link' | 'wrong_amount' | 'translation_error';
  description: string;
  submittedAt: string;
}

interface AppContextType {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  dataSaver: boolean;
  setDataSaver: (val: boolean) => void;
  isBackendOnline: boolean;
  checkBackendHealth: () => Promise<boolean>;
  auth: UserAuth;
  setAuth: React.Dispatch<React.SetStateAction<UserAuth>>;
  login: (param1: string, param2?: string, fallbackName?: string) => Promise<{ success: boolean; error?: string }>;
  register: (formData: RegistrationFormData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  loadDemoProfile: (demoProfile: Partial<UserProfile>) => void;
  matchResults: {
    bestMatches: (MatchResult & { nextBestActions?: any[]; evidenceCitation?: any })[];
    nearMatches: (MatchResult & { nextBestActions?: any[]; evidenceCitation?: any })[];
    otherSchemes: (MatchResult & { nextBestActions?: any[]; evidenceCitation?: any })[];
    summary: {
      totalEvaluated: number;
      eligibleCount: number;
      nearMatchCount: number;
      ineligibleCount: number;
    };
  } | null;
  executeMatching: (profile?: UserProfile) => Promise<void>;
  savedApplications: SavedApplication[];
  saveScheme: (scheme: Scheme) => Promise<void>;
  removeSavedScheme: (schemeId: string) => Promise<void>;
  toggleDocCompletion: (schemeId: string, docId: string) => Promise<void>;
  updateApplicationNotes: (schemeId: string, notes: string) => void;
  comparedSchemeIds: string[];
  toggleCompareScheme: (schemeId: string) => void;
  clearCompare: () => void;
  submittedReports: IssueReport[];
  submitIssueReport: (report: Omit<IssueReport, 'submittedAt'>) => Promise<void>;
  activeView: 'home' | 'match' | 'results' | 'schemes' | 'scheme-detail' | 'states' | 'compare' | 'dashboard' | 'ask' | 'how-it-works' | 'admin' | 'motion-lab' | 'login' | 'register' | 'profile';
  setActiveView: (view: 'home' | 'match' | 'results' | 'schemes' | 'scheme-detail' | 'states' | 'compare' | 'dashboard' | 'ask' | 'how-it-works' | 'admin' | 'motion-lab' | 'login' | 'register' | 'profile') => void;
  selectedSchemeSlug: string | null;
  openSchemeDetail: (slug: string) => void;
  selectedStateId: string | null;
  setSelectedStateId: (id: string | null) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  location_state: 'Uttar Pradesh',
  residence_type: 'rural',
  district: 'Varanasi',
  applicant_persona: 'starting_business',
  business_type: 'Textile',
  funding_need: ['Starting a business', 'Machinery & Equipment', 'Loan'],
  business_size_range: 'micro_under_10l',
  revenue_range: undefined,
  age: 28,
  gender: 'female',
  social_category: 'OBC',
  business_stage: 'new',
  is_street_vendor: false,
  is_traditional_artisan: true,
  education_level: '10th',
  has_udyam_registration: false,
  udyam_registration_number: undefined,
  udyam_verification_status: 'not_registered',
  has_bank_default: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [dataSaver, setDataSaver] = useState<boolean>(false);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
  
  const [auth, setAuth] = useState<UserAuth>({
    isAuthenticated: false,
    name: 'Savitri Devi',
    phoneOrEmail: '+91 98765 43210',
    role: 'user'
  });
  
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [matchResults, setMatchResults] = useState<AppContextType['matchResults']>(null);
  const [savedApplications, setSavedApplications] = useState<SavedApplication[]>([]);
  const [comparedSchemeIds, setComparedSchemeIds] = useState<string[]>(['pmegp-central-01', 'standup-india-02']);
  const [submittedReports, setSubmittedReports] = useState<IssueReport[]>([]);
  const [activeView, setActiveView] = useState<AppContextType['activeView']>('home');
  const [selectedSchemeSlug, setSelectedSchemeSlug] = useState<string | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);

  // Check backend health on initial load
  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      const isUp = await api.checkHealth();
      setIsBackendOnline(isUp);
      if (isUp) {
        // Fetch saved applications from SQLite database
        try {
          const remoteApps = await api.applications.list();
          if (remoteApps && remoteApps.length > 0) {
            setSavedApplications(
              remoteApps.map((a) => ({
                schemeId: a.scheme_id,
                schemeName: a.scheme_name,
                savedAt: a.saved_at,
                notes: a.notes,
                completedDocs: a.completed_docs || [],
                preparationStatus: a.preparation_status || 0,
                officialRefNumber: a.official_ref_number
              }))
            );
          }
        } catch {
          // Ignore app sync error
        }
      }
      return isUp;
    } catch {
      setIsBackendOnline(false);
      return false;
    }
  };

  useEffect(() => {
    checkBackendHealth();
    try {
      const stored = localStorage.getItem('udyamsetu_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.isAuthenticated) {
          setAuth(parsed);
          if (parsed.age || parsed.gender || parsed.social_category || parsed.address) {
            const detectedState = detectStateFromAddress(parsed.address);
            setUserProfile((prev) => ({
              ...prev,
              full_name: parsed.name,
              email: parsed.email || parsed.phoneOrEmail,
              location_state: detectedState || prev.location_state,
              age: parsed.age || prev.age,
              gender: parsed.gender ? (parsed.gender.toLowerCase() as any) : prev.gender,
              social_category: (parsed.social_category as any) || prev.social_category,
              education_level: parsed.education_level || prev.education_level,
              educational_qualification: parsed.education_level || prev.educational_qualification,
              address: parsed.address || prev.address
            }));
          }
        }
      }
    } catch {
      // Ignore storage parse error
    }
  }, []);

  const loadDemoProfile = (demo: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...demo }));
  };

  // Unified Matching Execution: Backend with Client Fallback
  const executeMatching = async (profileToUse?: UserProfile) => {
    const p = profileToUse || userProfile;

    try {
      const isUp = await api.checkHealth();
      if (isUp) {
        setIsBackendOnline(true);
        const res = await api.matching.calculate(p);

        const mapItem = (item: any): MatchResult & { nextBestActions?: any[]; evidenceCitation?: any } => {
          const localScheme = VERIFIED_SCHEMES.find(
            (s) => s.id === item.scheme_id || s.slug === item.scheme_slug
          ) || {
            id: item.scheme_id,
            name: item.scheme_name,
            slug: item.scheme_slug || item.scheme_id,
            code: item.scheme_id.toUpperCase(),
            level: item.level || 'central',
            state_name: item.state_name,
            ministry: item.ministry || 'Ministry of MSME',
            description: item.scheme_name,
            brief_summary: item.scheme_name,
            detailed_benefits: [],
            eligibility_criteria: [],
            documents_required: [
              { id: 'doc-aadhaar', name: 'Aadhaar Card', mandatory: true },
              { id: 'doc-pan', name: 'PAN Card', mandatory: true },
              { id: 'doc-bank', name: 'Bank Statement (6M)', mandatory: true }
            ],
            application_process: [],
            official_portal_url: item.evidence?.source_url || 'https://msme.gov.in',
            business_types: ['All Sectors'],
            funding_types: ['Loan', 'Subsidy']
          } as any;

          return {
            scheme: localScheme,
            eligibilityStatus: item.eligibility_status,
            eligibilityLabel: item.eligibility_label,
            relevanceScore: item.relevance_score,
            relevanceBreakdown: {
              locationScore: item.relevance_breakdown.location_score,
              sectorScore: item.relevance_breakdown.sector_score,
              needScore: item.relevance_breakdown.need_score,
              profileScore: item.relevance_breakdown.beneficiary_score,
              readinessScore: item.relevance_breakdown.readiness_score
            },
            whyMatchedReasons: item.why_matched || [],
            whyNotReasons: item.why_not_eligible || [],
            gapAnalysis: item.gap_analysis
              ? {
                  condition: item.gap_analysis.condition,
                  actionRequired: item.gap_analysis.action_required,
                  timeEstimate: item.gap_analysis.time_estimate,
                  portalUrl: item.gap_analysis.portal_url
                }
              : undefined,
            readinessPercentage: item.readiness_percentage || 80,
            missingDocumentsCount: (item.missing_requirements || []).length,
            nextBestActions: item.next_best_actions || [],
            evidenceCitation: item.evidence
          };
        };

        setMatchResults({
          bestMatches: res.best_matches.map(mapItem),
          nearMatches: res.near_matches.map(mapItem),
          otherSchemes: res.ineligible_schemes.map(mapItem),
          summary: res.summary
        });
        return;
      }
    } catch (e) {
      console.warn('Backend matching failed, running offline client-side engine:', e);
    }

    // Graceful offline fallback
    setIsBackendOnline(false);
    const results = runEligibilityMatching(p, VERIFIED_SCHEMES);
    setMatchResults(results as any);
  };

  const register = async (formData: RegistrationFormData): Promise<{ success: boolean; error?: string }> => {
    try {
      const isUp = await api.checkHealth();
      if (isUp) {
        const res = await api.auth.register({
          full_name: formData.fullName,
          email_or_phone: formData.email,
          password: formData.password,
          gender: formData.gender === 'Female' ? 'female' : formData.gender === 'Male' ? 'male' : formData.gender === 'Prefer not to say' ? 'prefer_not_to_say' : 'other',
          address: formData.address,
          age: formData.age,
          social_category: formData.category,
          education_level: formData.educationalQualification
        });

        api.setToken(res.access_token);
        
        const newAuth: UserAuth = {
          isAuthenticated: true,
          name: res.full_name,
          phoneOrEmail: res.email_or_phone,
          email: res.email_or_phone,
          role: (res.role as any) || 'user',
          gender: res.gender || formData.gender,
          age: res.age || formData.age,
          social_category: res.social_category || formData.category,
          education_level: res.education_level || formData.educationalQualification,
          address: res.address || formData.address
        };
        setAuth(newAuth);
        localStorage.setItem('udyamsetu_auth_user', JSON.stringify(newAuth));

        // Update userProfile with registered details for Find Scheme eligibility
        const detectedState = detectStateFromAddress(formData.address);
        setUserProfile((prev) => ({
          ...prev,
          full_name: formData.fullName,
          email: formData.email,
          location_state: detectedState || prev.location_state,
          age: formData.age,
          gender: (formData.gender === 'Female' ? 'female' : formData.gender === 'Male' ? 'male' : formData.gender === 'Prefer not to say' ? 'prefer_not_to_say' : 'other') as any,
          social_category: formData.category as any,
          education_level: formData.educationalQualification,
          educational_qualification: formData.educationalQualification,
          address: formData.address
        }));

        return { success: true };
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('already exists')) {
        return { success: false, error: msg };
      }
      console.warn('Backend register failed, using offline fallback:', err);
    }

    // Offline fallback registration
    const existingUsers = JSON.parse(localStorage.getItem('udyamsetu_local_users') || '[]');
    if (existingUsers.some((u: any) => u.email.toLowerCase() === formData.email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const newUserRecord = {
      ...formData,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    existingUsers.push(newUserRecord);
    localStorage.setItem('udyamsetu_local_users', JSON.stringify(existingUsers));

    const offlineAuth: UserAuth = {
      isAuthenticated: true,
      name: formData.fullName,
      phoneOrEmail: formData.email,
      email: formData.email,
      role: 'user',
      gender: formData.gender,
      age: formData.age,
      social_category: formData.category,
      education_level: formData.educationalQualification,
      address: formData.address
    };
    setAuth(offlineAuth);
    localStorage.setItem('udyamsetu_auth_user', JSON.stringify(offlineAuth));

    const detectedOfflineState = detectStateFromAddress(formData.address);
    setUserProfile((prev) => ({
      ...prev,
      full_name: formData.fullName,
      email: formData.email,
      location_state: detectedOfflineState || prev.location_state,
      age: formData.age,
      gender: (formData.gender === 'Female' ? 'female' : formData.gender === 'Male' ? 'male' : formData.gender === 'Prefer not to say' ? 'prefer_not_to_say' : 'other') as any,
      social_category: formData.category as any,
      education_level: formData.educationalQualification,
      educational_qualification: formData.educationalQualification,
      address: formData.address
    }));

    return { success: true };
  };

  const login = async (param1: string, param2?: string, fallbackName?: string): Promise<{ success: boolean; error?: string }> => {
    let emailOrPhone = '';
    let password = '';
    let name = fallbackName || '';

    if (param2 && (param2.includes('@') || param2.startsWith('+') || /^\d{10}$/.test(param2.replace(/\s/g, '')))) {
      // Legacy modal call: login(name, phoneOrEmail)
      name = param1;
      emailOrPhone = param2;
      password = 'demo1234';
    } else {
      // Standard login: login(emailOrPhone, password)
      emailOrPhone = param1;
      password = param2 || 'demo1234';
      if (!name && emailOrPhone.includes('@')) {
        name = emailOrPhone.split('@')[0];
        name = name.charAt(0).toUpperCase() + name.slice(1);
      }
    }

    try {
      const isUp = await api.checkHealth();
      if (isUp) {
        const tokenRes = await api.auth.login(emailOrPhone, password);
        api.setToken(tokenRes.access_token);
        const authedUser: UserAuth = {
          isAuthenticated: true,
          name: tokenRes.full_name || name || 'Entrepreneur',
          phoneOrEmail: tokenRes.email_or_phone || emailOrPhone,
          email: tokenRes.email_or_phone || emailOrPhone,
          role: (tokenRes.role as any) || 'user',
          gender: tokenRes.gender,
          age: tokenRes.age,
          social_category: tokenRes.social_category,
          education_level: tokenRes.education_level,
          address: tokenRes.address
        };
        setAuth(authedUser);
        localStorage.setItem('udyamsetu_auth_user', JSON.stringify(authedUser));

        const detectedState = detectStateFromAddress(tokenRes.address);
        if (tokenRes.age || tokenRes.gender || tokenRes.social_category || tokenRes.address) {
          setUserProfile((prev) => ({
            ...prev,
            full_name: tokenRes.full_name || prev.full_name,
            email: tokenRes.email_or_phone || prev.email,
            location_state: detectedState || prev.location_state,
            age: tokenRes.age || prev.age,
            gender: tokenRes.gender ? (tokenRes.gender.toLowerCase() as any) : prev.gender,
            social_category: (tokenRes.social_category as any) || prev.social_category,
            education_level: tokenRes.education_level || prev.education_level,
            educational_qualification: tokenRes.education_level || prev.educational_qualification,
            address: tokenRes.address || prev.address
          }));
        }
        return { success: true };
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('Incorrect password') || msg.includes('401')) {
        return { success: false, error: 'Incorrect password. Please verify and try again.' };
      }
      if (msg.includes('No account') || msg.includes('404')) {
        return { success: false, error: 'No registered account found with this email. Please create an account.' };
      }
      console.warn('Backend login unavailable, checking offline users:', err);
    }

    // Offline fallback
    const existingUsers = JSON.parse(localStorage.getItem('udyamsetu_local_users') || '[]');
    const matchedUser = existingUsers.find(
      (u: any) => u.email.toLowerCase() === emailOrPhone.toLowerCase()
    );

    if (matchedUser) {
      if (matchedUser.password && password && matchedUser.password !== password && password !== 'demo1234') {
        return { success: false, error: 'Incorrect password. Please verify and try again.' };
      }
      const offlineAuth: UserAuth = {
        isAuthenticated: true,
        name: matchedUser.fullName || name || 'Entrepreneur',
        phoneOrEmail: matchedUser.email,
        email: matchedUser.email,
        role: 'user',
        gender: matchedUser.gender,
        age: matchedUser.age,
        social_category: matchedUser.category,
        education_level: matchedUser.educationalQualification,
        address: matchedUser.address
      };
      setAuth(offlineAuth);
      localStorage.setItem('udyamsetu_auth_user', JSON.stringify(offlineAuth));

      const detectedOfflineState = detectStateFromAddress(matchedUser.address);
      setUserProfile((prev) => ({
        ...prev,
        full_name: matchedUser.fullName,
        email: matchedUser.email,
        location_state: detectedOfflineState || prev.location_state,
        age: matchedUser.age || prev.age,
        gender: (matchedUser.gender === 'Female' ? 'female' : matchedUser.gender === 'Male' ? 'male' : matchedUser.gender === 'Prefer not to say' ? 'prefer_not_to_say' : 'other') as any,
        social_category: (matchedUser.category as any) || prev.social_category,
        education_level: matchedUser.educationalQualification || prev.education_level,
        educational_qualification: matchedUser.educationalQualification || prev.educational_qualification,
        address: matchedUser.address || prev.address
      }));
      return { success: true };
    }

    const quickAuth: UserAuth = {
      isAuthenticated: true,
      name: name || (emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Entrepreneur'),
      phoneOrEmail: emailOrPhone || '+91 98765 43210',
      email: emailOrPhone.includes('@') ? emailOrPhone : undefined,
      role: 'user'
    };
    setAuth(quickAuth);
    localStorage.setItem('udyamsetu_auth_user', JSON.stringify(quickAuth));
    return { success: true };
  };

  const logout = () => {
    api.setToken(null);
    localStorage.removeItem('udyamsetu_auth_user');
    setAuth({
      isAuthenticated: false,
      name: '',
      phoneOrEmail: '',
      role: 'user'
    });
  };

  const saveScheme = async (scheme: Scheme) => {
    if (savedApplications.some((a) => a.schemeId === scheme.id)) return;
    
    const newApp: SavedApplication = {
      schemeId: scheme.id,
      schemeName: scheme.name,
      savedAt: new Date().toISOString().split('T')[0],
      notes: 'Discovered on UdyamSetu matching flow.',
      completedDocs: [scheme.documents_required[0]?.id || 'doc-aadhaar'],
      preparationStatus: Math.round((1 / Math.max(1, scheme.documents_required.length)) * 100)
    };
    setSavedApplications([...savedApplications, newApp]);

    // Async sync with backend SQLite
    try {
      if (isBackendOnline) {
        await api.applications.save(scheme.id, scheme.name, scheme.slug, newApp.notes);
      }
    } catch (e) {
      console.warn('Failed to sync saved application with backend:', e);
    }
  };

  const removeSavedScheme = async (schemeId: string) => {
    setSavedApplications(savedApplications.filter((a) => a.schemeId !== schemeId));
    try {
      if (isBackendOnline) {
        await api.applications.delete(schemeId);
      }
    } catch (e) {
      console.warn('Failed to delete application on backend:', e);
    }
  };

  const toggleDocCompletion = async (schemeId: string, docId: string) => {
    let willBeCompleted = false;
    setSavedApplications((prev) =>
      prev.map((app) => {
        if (app.schemeId !== schemeId) return app;
        const exists = app.completedDocs.includes(docId);
        willBeCompleted = !exists;
        const updated = exists ? app.completedDocs.filter((id) => id !== docId) : [...app.completedDocs, docId];
        const scheme = VERIFIED_SCHEMES.find((s) => s.id === schemeId);
        const totalDocs = scheme?.documents_required.length || 3;
        return {
          ...app,
          completedDocs: updated,
          preparationStatus: Math.round((updated.length / totalDocs) * 100)
        };
      })
    );

    try {
      if (isBackendOnline) {
        await api.applications.toggleDoc(schemeId, docId, willBeCompleted);
      }
    } catch (e) {
      console.warn('Failed to toggle doc on backend:', e);
    }
  };

  const updateApplicationNotes = (schemeId: string, notes: string) => {
    setSavedApplications((prev) =>
      prev.map((app) => (app.schemeId === schemeId ? { ...app, notes } : app))
    );
  };

  const toggleCompareScheme = (schemeId: string) => {
    if (comparedSchemeIds.includes(schemeId)) {
      setComparedSchemeIds(comparedSchemeIds.filter((id) => id !== schemeId));
    } else {
      if (comparedSchemeIds.length >= 3) {
        alert('You can compare up to 3 schemes at a time.');
        return;
      }
      setComparedSchemeIds([...comparedSchemeIds, schemeId]);
    }
  };

  const clearCompare = () => {
    setComparedSchemeIds([]);
  };

  const submitIssueReport = async (report: Omit<IssueReport, 'submittedAt'>) => {
    const fullReport: IssueReport = {
      ...report,
      submittedAt: new Date().toISOString()
    };
    setSubmittedReports([fullReport, ...submittedReports]);

    try {
      if (isBackendOnline) {
        await api.governance.submitReport(
          report.schemeId,
          report.schemeName,
          report.issueType,
          report.description
        );
      }
    } catch (e) {
      console.warn('Failed to submit report to backend:', e);
    }
  };

  const openSchemeDetail = (slug: string) => {
    setSelectedSchemeSlug(slug);
    setActiveView('scheme-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        dataSaver,
        setDataSaver,
        isBackendOnline,
        checkBackendHealth,
        auth,
        setAuth,
        login,
        register,
        logout,
        userProfile,
        setUserProfile,
        loadDemoProfile,
        matchResults,
        executeMatching,
        savedApplications,
        saveScheme,
        removeSavedScheme,
        toggleDocCompletion,
        updateApplicationNotes,
        comparedSchemeIds,
        toggleCompareScheme,
        clearCompare,
        submittedReports,
        submitIssueReport,
        activeView,
        setActiveView,
        selectedSchemeSlug,
        openSchemeDetail,
        selectedStateId,
        setSelectedStateId
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
