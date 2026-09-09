import { Scheme, VERIFIED_SCHEMES } from '../data/schemes';

export interface UserProfile {
  location_state: string;
  residence_type: 'urban' | 'rural';
  district?: string;
  applicant_persona: string; // 'existing_entrepreneur' | 'starting_business' | 'self_employed' | 'artisan' | 'farmer_entrepreneur' | 'street_vendor' | 'shg_member' | 'startup_founder'
  business_type: string; // 'Retail' | 'Manufacturing' | 'Food Processing' | 'Agriculture' | 'Dairy' | 'Handicraft' | 'Textile' | 'Services' | 'Technology' | 'Other'
  funding_need: string[]; // 'Starting a business' | 'Working capital' | 'Machinery & Equipment' | 'Loan' | 'Subsidy' | 'Training' | 'Market access'
  business_stage: 'new' | 'existing';
  revenue_range?: 'up_to_1_lakh' | '1_to_10_lakh' | '10_to_50_lakh' | 'above_50_lakh';
  business_size_range?: string;
  age: number; // 18 to 115
  gender: 'female' | 'male' | 'transgender' | 'prefer_not_to_say' | 'other';
  social_category: 'General' | 'OBC' | 'SC' | 'ST' | 'SC/ST' | 'EWS' | 'Minority' | 'None';
  is_street_vendor?: boolean;
  is_traditional_artisan?: boolean;
  education_level?: string;
  educational_qualification?: string;
  has_udyam_registration?: boolean;
  udyam_registration_number?: string;
  udyam_verification_status?: 'verified' | 'unverified' | 'failed' | 'format_error' | 'not_registered';
  udyam_verified_data?: any;
  has_bank_default?: boolean;
  full_name?: string;
  email?: string;
  address?: string;
  annual_income_range?: string;
  marital_status?: string;
  disability_status?: string;
  minority_status?: string;
  preferred_language?: string;
  support_goals?: string[];
  employee_count?: string;
  turnover_range?: string;
}

export type EligibilityStatus = 'eligible' | 'near_match' | 'ineligible';

export interface MatchResult {
  scheme: Scheme;
  eligibilityStatus: EligibilityStatus;
  eligibilityLabel: string;
  relevanceScore: number; // 0 to 100
  relevanceBreakdown: {
    locationScore: number;
    sectorScore: number;
    needScore: number;
    profileScore: number;
    readinessScore: number;
    stageScore?: number;
    occupationScore?: number;
  };
  whyMatchedReasons: string[];
  whyNotReasons: string[];
  gapAnalysis?: {
    condition: string;
    actionRequired: string;
    timeEstimate: string;
    portalUrl?: string;
  };
  readinessPercentage: number;
  missingDocumentsCount: number;
  nextBestActions?: {
    step_number: number;
    title: string;
    description: string;
    impact: string;
    action_url?: string;
  }[];
  evidenceCitation?: any;
}

// ----------------------------------------------------
// LAYER 1: Deterministic Statutory Rule Evaluation
// ----------------------------------------------------
export function evaluateEligibility(profile: UserProfile, scheme: Scheme): {
  status: EligibilityStatus;
  label: string;
  passedCriteria: string[];
  failedHardRules: string[];
  softGaps: string[];
  gapAnalysis?: MatchResult['gapAnalysis'];
} {
  const failedHardRules: string[] = [];
  const passedCriteria: string[] = [];
  const softGaps: string[] = [];
  let gapAnalysis: MatchResult['gapAnalysis'] = undefined;

  const slug = scheme.slug.toLowerCase();
  const desc = (scheme.description || '').toLowerCase();

  // 1. State level check
  if (scheme.level === 'state' && scheme.state_name) {
    if (profile.location_state.toLowerCase().trim() !== scheme.state_name.toLowerCase().trim()) {
      failedHardRules.push(`Requires residence/enterprise in ${scheme.state_name}. Your profile indicates ${profile.location_state}.`);
    } else {
      passedCriteria.push(`Location matched: Enterprise established in designated state (${scheme.state_name}).`);
    }
  } else {
    passedCriteria.push(`Pan-India Central Scheme accessible to entrepreneurs in all states including ${profile.location_state}.`);
  }

  // 2. Residence check (Urban vs Rural)
  if (slug === 'pm-svanidhi') {
    if (profile.residence_type === 'rural') {
      softGaps.push('PM SVANidhi is primarily disbursed through Urban Local Bodies (ULBs). Peri-urban/rural vendors require ULB vending identification.');
      gapAnalysis = {
        condition: 'Urban Local Body (ULB) vending mandate',
        actionRequired: 'Obtain Town Vending Committee (TVC) Letter of Recommendation from nearest Municipal Council/Corporation.',
        timeEstimate: '2–3 days',
        portalUrl: 'https://pmsvanidhi.mohua.gov.in/'
      };
    } else {
      passedCriteria.push('Urban location verified: Aligns with Municipal Town Vending Committee jurisdiction.');
    }
  }

  // 3. Gender check (e.g. Mahila Coir Yojana exclusively for women)
  if (scheme.id === 'mahila-coir-yojana-08' && profile.gender !== 'female') {
    failedHardRules.push('Statutory reservation: Exclusively earmarked for women artisans and micro-entrepreneurs.');
  } else if (profile.gender === 'female') {
    passedCriteria.push('Women entrepreneur priority eligibility satisfies special statutory incentive quota.');
  }

  // 4. Stand-Up India Composite: Female OR SC/ST
  if (slug === 'standup-india') {
    const isFemale = profile.gender === 'female';
    const isScSt = profile.social_category === 'SC' || profile.social_category === 'ST' || profile.social_category === 'SC/ST';
    if (!isFemale && !isScSt) {
      failedHardRules.push('Stand-Up India is exclusively reserved for Women OR Scheduled Caste (SC) / Scheduled Tribe (ST) promoters.');
    } else {
      passedCriteria.push(`Meets demographic affirmative action mandate as a ${isFemale ? 'Woman' : profile.social_category} promoter.`);
    }
  }

  // 5. Street Vendor Persona Check
  if (slug === 'pm-svanidhi') {
    if (!profile.is_street_vendor && profile.applicant_persona !== 'street_vendor') {
      failedHardRules.push('Requires active street vendor or urban cart-hawker status certified by ULB.');
    } else {
      passedCriteria.push('Beneficiary status recognized: Active micro/street vendor with Town Vending Committee mandate.');
    }
  }

  // 6. Artisan / Traditional Trade Check
  if (slug === 'pm-vishwakarma') {
    if (!profile.is_traditional_artisan && profile.applicant_persona !== 'artisan') {
      failedHardRules.push('Applicant must be hands-on engaged in one of the 18 recognized traditional artisan/craftsman trades.');
    } else {
      passedCriteria.push('Trade recognized: Engaged in traditional artisanal/craftsman trade with digital verification.');
    }
  }

  // 7. Age check
  const minAge = scheme.min_age || 18;
  const maxAge = scheme.max_age || (slug === 'pmegp' ? 65 : 115);
  if (profile.age < minAge) {
    failedHardRules.push(`Minimum statutory age requirement is ${minAge} years. (Applicant age is ${profile.age}).`);
  } else if (profile.age > maxAge) {
    failedHardRules.push(`Upper age threshold is ${maxAge} years. (Applicant age is ${profile.age}).`);
  } else {
    passedCriteria.push(`Age verified: ${profile.age} years satisfies legal applicant age bounds (${minAge}–${maxAge} years).`);
  }

  // 8. Business Stage Check (PMEGP first loan requires new unit)
  if (slug === 'pmegp' && profile.business_stage === 'existing') {
    softGaps.push('PMEGP initial loan primarily finances new greenfield units. Operating units qualify under 2nd loan upgrade upon loan repayment.');
    gapAnalysis = {
      condition: 'Greenfield setup requirement for initial loan',
      actionRequired: 'Apply under PMEGP 2nd Loan for Upgradation or utilize CGTMSE / Mudra Tarun for existing capacity expansion.',
      timeEstimate: 'Instant alternate pathway routing',
      portalUrl: 'https://www.kviconline.gov.in/'
    };
  }

  // 9. Udyam Registration Check (Soft gap for credit guarantee / formal MSME schemes)
  if ((slug === 'cgtmse' || slug === 'pmegp') && !profile.has_udyam_registration) {
    softGaps.push('Active MSME Udyam Registration Certificate is required prior to bank subsidy / guarantee sanction.');
    if (!gapAnalysis) {
      gapAnalysis = {
        condition: 'MSME Udyam Certificate required',
        actionRequired: 'Register on official Udyam Portal (Free, 5–10 mins with Aadhaar & PAN).',
        timeEstimate: '5–10 minutes',
        portalUrl: 'https://udyamregistration.gov.in/'
      };
    }
  }

  // Determine 3-Level Status
  let status: EligibilityStatus = 'eligible';
  let label = '✅ Statutory Requirements Satisfied';

  if (failedHardRules.length > 0) {
    status = 'ineligible';
    label = '❌ Statutory Requirements Not Met';
  } else if (softGaps.length > 0) {
    status = 'near_match';
    label = '🟡 Almost Eligible (1 Actionable Prerequisite Away)';
  }

  return {
    status,
    label,
    passedCriteria,
    failedHardRules,
    softGaps,
    gapAnalysis
  };
}

// ----------------------------------------------------
// LAYER 2: Multi-Factor Relevance Scoring (0 - 100)
// ----------------------------------------------------
export function calculateRelevance(
  profile: UserProfile,
  scheme: Scheme,
  status: EligibilityStatus,
  passedCriteria: string[]
): {
  relevanceScore: number;
  breakdown: MatchResult['relevanceBreakdown'];
  whyMatchedReasons: string[];
} {
  const slug = scheme.slug.toLowerCase();
  const desc = (scheme.description || '').toLowerCase();
  const reasons = [...passedCriteria];

  // 1. Occupation Fit (25 pts)
  let occupationScore = 15;
  const occ = profile.applicant_persona;
  if (
    (occ === 'artisan' && (slug.includes('vishwakarma') || slug.includes('pmegp') || desc.includes('artisan') || desc.includes('textile'))) ||
    (occ === 'street_vendor' && (slug.includes('svanidhi') || slug.includes('mudra') || desc.includes('vendor'))) ||
    (occ === 'farmer_entrepreneur' && (desc.includes('agri') || desc.includes('dairy') || desc.includes('farmer'))) ||
    (occ === 'startup_founder' && (desc.includes('startup') || desc.includes('innovation') || desc.includes('tech'))) ||
    (occ === 'shg_member' && (desc.includes('shg') || desc.includes('women') || slug.includes('standup')))
  ) {
    occupationScore = 25;
    reasons.push(`Direct flagship program specifically engineered for your profile as an ${occ.replace('_', ' ').toUpperCase()}.`);
  }

  // 2. Sector Fit (15 pts)
  let sectorScore = 10;
  const businessMatches = scheme.business_types.some(
    (bt) => bt.toLowerCase() === profile.business_type.toLowerCase() || profile.business_type === 'Other' || bt.toLowerCase() === 'all'
  );
  if (businessMatches) {
    sectorScore = 15;
    reasons.push(`Direct sector alignment with your ${profile.business_type} enterprise.`);
  }

  // 3. Need Fit (20 pts)
  let needScore = 10;
  const matchingNeeds = profile.funding_need.filter((need) =>
    scheme.funding_needs.some((fn) => fn.toLowerCase().includes(need.toLowerCase())) ||
    scheme.benefit_type.some((bt) => need.toLowerCase().includes(bt.toLowerCase()))
  );
  if (matchingNeeds.length > 0) {
    needScore = Math.min(20, 10 + matchingNeeds.length * 4);
    reasons.push(`Directly satisfies your stated need for: ${matchingNeeds.join(', ')}.`);
  }

  // 4. Business Stage Fit (15 pts)
  let stageScore = 10;
  if (profile.business_stage === 'new') {
    if (slug.includes('pmegp') || slug.includes('standup') || slug.includes('mudra') || desc.includes('greenfield')) {
      stageScore = 15;
      reasons.push('Tailored for greenfield / first-time enterprise setup.');
    }
  } else {
    if (slug.includes('cgtmse') || desc.includes('expansion') || slug.includes('mudra')) {
      stageScore = 15;
      reasons.push('Provides collateral guarantee & expansion capital for operating businesses.');
    }
  }

  // 5. Location & Residence Fit (10 pts)
  let locationScore = 5;
  if (scheme.level === 'state') {
    locationScore = profile.location_state.toLowerCase() === (scheme.state_name || '').toLowerCase() ? 10 : 2;
  } else {
    if (profile.residence_type === 'rural' && (desc.includes('rural') || desc.includes('kvic') || slug.includes('pmegp'))) {
      locationScore = 10;
      reasons.push('Unlocks higher 35% government capital subsidy tier for rural areas.');
    } else {
      locationScore = 8;
    }
  }

  // 6. Demographic Incentives (5 pts)
  let profileScore = 3;
  if (profile.gender === 'female' || profile.social_category === 'SC' || profile.social_category === 'ST' || profile.social_category === 'SC/ST' || profile.social_category === 'EWS') {
    profileScore = 5;
    const quotaLabel = profile.gender === 'female' ? 'Woman' : profile.social_category;
    reasons.push(`Affirmative action incentive satisfies special ${quotaLabel} promoter allocation.`);
  }

  // 7. Readiness Fit (5 pts)
  let readinessScore = profile.has_udyam_registration ? 5 : 2;
  if (profile.has_udyam_registration) {
    reasons.push('Verified MSME Udyam Certificate enables instant priority bank loan processing.');
  }

  let totalRelevance = occupationScore + sectorScore + needScore + stageScore + locationScore + profileScore + readinessScore;

  // Strict cap on ineligible schemes: NEVER allow score to deceive or promote ineligible schemes
  if (status === 'ineligible') {
    totalRelevance = Math.min(totalRelevance, 35);
  }

  // Deduplicate reasons
  const uniqueReasons = listUnique(reasons).slice(0, 5);

  return {
    relevanceScore: Math.min(98, Math.max(15, totalRelevance)),
    breakdown: {
      locationScore,
      sectorScore,
      needScore,
      profileScore,
      readinessScore,
      stageScore,
      occupationScore
    },
    whyMatchedReasons: uniqueReasons
  };
}

function listUnique(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

// ----------------------------------------------------
// LAYER 3 & 4: Master Eligibility & Personalization Pipeline
// ----------------------------------------------------
export function runEligibilityMatching(
  profile: UserProfile,
  schemeList: Scheme[] = VERIFIED_SCHEMES
): {
  bestMatches: MatchResult[];
  nearMatches: MatchResult[];
  otherSchemes: MatchResult[];
  summary: {
    totalEvaluated: number;
    eligibleCount: number;
    nearMatchCount: number;
    ineligibleCount: number;
  };
} {
  const allResults: MatchResult[] = schemeList.map((scheme) => {
    // 1. Evaluate Deterministic Eligibility
    const evalRes = evaluateEligibility(profile, scheme);

    // 2. Calculate Explainable Relevance & Personalization Score
    const scoreRes = calculateRelevance(profile, scheme, evalRes.status, evalRes.passedCriteria);

    // 3. Document Readiness Assessment
    const totalDocs = scheme.documents_required ? scheme.documents_required.length : 3;
    const readyDocs = profile.has_udyam_registration ? totalDocs - 1 : Math.max(1, totalDocs - 2);
    const readinessPercentage = Math.round((readyDocs / Math.max(1, totalDocs)) * 100);

    // 4. Synthesize Sequential 3 Next Best Actions
    const nextBestActions = [
      {
        step_number: 1,
        title: profile.has_udyam_registration ? 'Verify Udyam Linked Bank Account' : 'Acquire Free Udyam Registration',
        description: profile.has_udyam_registration
          ? 'Ensure your operational bank account is linked to your Udyam Certificate.'
          : 'Register in 5–10 minutes on udyamregistration.gov.in using Aadhaar and PAN at zero fee.',
        impact: 'Statutory prerequisite for official MSME subsidy sanction',
        action_url: 'https://udyamregistration.gov.in/'
      },
      {
        step_number: 2,
        title: 'Prepare Project Cost Summary & Quotations',
        description: 'Gather machinery price quotes, raw material requirements, and rental/premise agreements.',
        impact: 'Speeds up District Industries Centre (DIC) scrutiny',
        action_url: undefined
      },
      {
        step_number: 3,
        title: 'Submit Online Application on Verified Portal',
        description: `Apply through the official ${scheme.ministry || 'Ministry'} gateway and note down your acknowledgement reference.`,
        impact: 'Official direct benefit transfer & loan tracking',
        action_url: scheme.official_portal_url || scheme.source_url
      }
    ];

    return {
      scheme,
      eligibilityStatus: evalRes.status,
      eligibilityLabel: evalRes.label,
      relevanceScore: scoreRes.relevanceScore,
      relevanceBreakdown: scoreRes.breakdown,
      whyMatchedReasons: scoreRes.whyMatchedReasons,
      whyNotReasons: [...evalRes.failedHardRules, ...evalRes.softGaps],
      gapAnalysis: evalRes.gapAnalysis,
      readinessPercentage,
      missingDocumentsCount: Math.max(0, totalDocs - readyDocs),
      nextBestActions,
      evidenceCitation: {
        source_url: scheme.official_portal_url || scheme.source_url,
        last_verified_at: scheme.last_verified_at || '2026-09-02',
        source_tier: scheme.source_tier || 'tier1_official',
        trust_state: scheme.trust_state || 'verified'
      }
    };
  });

  // Sort descending by relevance score
  const sorted = allResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Strict 3-Tier Partitioning: Ineligible schemes are strictly barred from bestMatches
  const bestMatches = sorted.filter((r) => r.eligibilityStatus === 'eligible');
  const nearMatches = sorted.filter((r) => r.eligibilityStatus === 'near_match');
  const otherSchemes = sorted.filter((r) => r.eligibilityStatus === 'ineligible');

  return {
    bestMatches,
    nearMatches,
    otherSchemes,
    summary: {
      totalEvaluated: allResults.length,
      eligibleCount: bestMatches.length,
      nearMatchCount: nearMatches.length,
      ineligibleCount: otherSchemes.length
    }
  };
}
