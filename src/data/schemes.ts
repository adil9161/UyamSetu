import allSchemesRaw from './all_schemes.json';
import allStatesRaw from './states_data.json';

export type TrustState = 'verified' | 'stale' | 'flagged' | 'deprecated' | 'pending';
export type SchemeLevel = 'central' | 'state' | 'joint';
export type SourceTier = 'tier1_official' | 'tier2_program' | 'tier3_secondary';

export interface EligibilityRule {
  id: string;
  attribute: string;
  operator: 'eq' | 'neq' | 'gte' | 'lte' | 'in' | 'contains';
  value: any;
  label: string;
  explanation: string;
  isHardRule: boolean;
}

export interface Scheme {
  id: string;
  slug: string;
  name: string;
  name_hi: string;
  code: string;
  ministry: string;
  department: string;
  level: SchemeLevel;
  state_id?: string | null;
  state_name?: string | null;
  application_mode?: string;
  description: string;
  description_hi: string;
  benefit_summary: string;
  benefit_type: ('loan' | 'subsidy' | 'working_capital' | 'training' | 'equipment' | 'credit_guarantee')[];
  benefit_amount_min: number;
  benefit_amount_max: number;
  subsidy_percentage?: number | null;
  target_categories: string[];
  target_genders: ('all' | 'female' | 'male' | 'transgender')[];
  business_types: string[];
  funding_needs: string[];
  min_age?: number;
  max_age?: number;
  education_required?: string;
  eligibility_text?: string;
  exclusions_text?: string;
  rules: EligibilityRule[];
  documents_required: {
    id: string;
    title: string;
    description: string;
    isMandatory: boolean;
  }[];
  application_steps: {
    step: number;
    title: string;
    description: string;
    portalName: string;
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  source_name: string;
  source_url: string;
  source_tier: SourceTier;
  last_verified_at: string;
  trust_state: TrustState;
  official_portal_url: string;
}

export interface StateData {
  id: string;
  name: string;
  name_hi: string;
  total_schemes: number;
  central_schemes: number;
  state_schemes: number;
  top_sectors: { sector: string; count: number }[];
  key_departments: string[];
}

// Flagship Showcase Schemes (Deeply curated with high-precision rules)
export const FLAGSHIP_SCHEMES: Scheme[] = [
  {
    id: 'pmegp-central-01',
    slug: 'pmegp',
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    name_hi: 'प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)',
    code: 'MSME-PMEGP-2026',
    ministry: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
    department: 'Khadi and Village Industries Commission (KVIC)',
    level: 'central',
    description: 'A credit-linked subsidy scheme aimed at generating self-employment opportunities through establishment of micro-enterprises in non-farm sector for individual entrepreneurs, SHGs, and institutions.',
    description_hi: 'गैर-कृषि क्षेत्र में सूक्ष्म उद्यमों की स्थापना के माध्यम से स्वरोजगार के अवसर पैदा करने के लिए एक क्रेडिट-लिंक्ड सब्सिडी योजना।',
    benefit_summary: 'Project cost up to ₹50 Lakh (Manufacturing) / ₹20 Lakh (Services) with 15% to 35% government capital subsidy.',
    benefit_type: ['loan', 'subsidy'],
    benefit_amount_min: 100000,
    benefit_amount_max: 5000000,
    subsidy_percentage: 35,
    target_categories: ['General', 'SC', 'ST', 'OBC', 'Minorities', 'Women', 'Ex-Servicemen', 'PH', 'MSME / Entrepreneur'],
    target_genders: ['all', 'female'],
    business_types: ['Manufacturing', 'Services', 'Food Processing', 'Handicraft', 'Textile', 'Agri-Allied'],
    funding_needs: ['Starting a business', 'Machinery & Equipment', 'Loan', 'Subsidy'],
    min_age: 18,
    education_required: '8th pass for projects above ₹10 Lakh in Mfg / ₹5 Lakh in Services',
    rules: [
      {
        id: 'pmegp-rule-age',
        attribute: 'age',
        operator: 'gte',
        value: 18,
        label: 'Minimum Age 18 Years',
        explanation: 'The applicant must be at least 18 years of age at the time of application.',
        isHardRule: true,
      },
      {
        id: 'pmegp-rule-stage',
        attribute: 'business_stage',
        operator: 'in',
        value: ['new', 'starting'],
        label: 'New Enterprises Only',
        explanation: 'Only newly established enterprises are eligible under PMEGP (existing units assisted under other govt subsidies are ineligible for 1st loan).',
        isHardRule: true,
      }
    ],
    documents_required: [
      { id: 'doc-aadhaar', title: 'Aadhaar Card', description: 'UIDAI verified identity proof', isMandatory: true },
      { id: 'doc-caste', title: 'Special Category / Caste Certificate', description: 'Required for claiming 25% or 35% higher subsidy rate', isMandatory: false },
      { id: 'doc-edu', title: 'Educational Qualification Certificate (8th / 10th)', description: 'Mandatory if project cost > ₹10 Lakh (Mfg) / ₹5 Lakh (Services)', isMandatory: true },
      { id: 'doc-dpr', title: 'Detailed Project Report (DPR)', description: 'Breakdown of machinery, capital costs, and working capital requirement', isMandatory: true },
      { id: 'doc-rural', title: 'Rural Area Certificate', description: 'Issued by Gram Panchayat or Tehsildar for 35% rural subsidy claim', isMandatory: false }
    ],
    application_steps: [
      { step: 1, title: 'Online Registration', description: 'Submit applicant details on official KVIC PMEGP e-Portal.', portalName: 'kvic.gov.in/pmegp' },
      { step: 2, title: 'DPR & Document Upload', description: 'Upload project report, caste certificate, and photo.', portalName: 'PMEGP e-Portal' },
      { step: 3, title: 'Task Force Review', description: 'District Level Task Force Committee (DLTFC) reviews the proposal.', portalName: 'District MSME Centre / DIC' },
      { step: 4, title: 'Bank Appraisal & Sanction', description: 'Financing bank evaluates viability and sanctions credit.', portalName: 'Selected Public / Private Bank' },
      { step: 5, title: 'EDP Training & Subsidy Release', description: 'Complete mandatory Entrepreneurship Development Training to claim subsidy.', portalName: 'Online Samadhan / KVIC' }
    ],
    source_name: 'Khadi and Village Industries Commission (KVIC) / Ministry of MSME',
    source_url: 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp',
    source_tier: 'tier1_official',
    last_verified_at: '2026-08-28',
    trust_state: 'verified',
    official_portal_url: 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp'
  },
  {
    id: 'standup-india-02',
    slug: 'standup-india',
    name: 'Stand-Up India Scheme',
    name_hi: 'स्टैंड-अप इंडिया योजना',
    code: 'FIN-SUI-2026',
    ministry: 'Ministry of Finance',
    department: 'Department of Financial Services (DFS) & SIDBI',
    level: 'central',
    description: 'Facilitates bank loans between ₹10 Lakh and ₹1 Crore to at least one SC or ST borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise in manufacturing, services, agri-allied, or trading.',
    description_hi: 'विनिर्माण, सेवा, कृषि-संबद्ध या व्यापार में ग्रीनफील्ड उद्यम स्थापित करने के लिए प्रति बैंक शाखा में कम से कम एक एससी/एसटी और एक महिला उद्यमी को ₹10 लाख से ₹1 करोड़ का बैंक ऋण।',
    benefit_summary: 'Composite loan between ₹10 Lakh to ₹1 Crore covering 85% of project cost with concessional interest rates.',
    benefit_type: ['loan', 'credit_guarantee'],
    benefit_amount_min: 1000000,
    benefit_amount_max: 10000000,
    target_categories: ['SC', 'ST', 'Women', 'MSME / Entrepreneur'],
    target_genders: ['female', 'all'],
    business_types: ['Manufacturing', 'Services', 'Retail', 'Agriculture & Allied', 'Food Processing'],
    funding_needs: ['Starting a business', 'Working capital', 'Machinery & Equipment', 'Loan'],
    min_age: 18,
    rules: [
      {
        id: 'sui-rule-category',
        attribute: 'target_demographic',
        operator: 'in',
        value: ['female', 'sc', 'st'],
        label: 'Women or SC/ST Entrepreneur',
        explanation: 'Applicant must be either a Woman entrepreneur or belong to Scheduled Caste (SC) / Scheduled Tribe (ST). In non-individual enterprises, 51% shareholding must be held by SC/ST or woman.',
        isHardRule: true,
      }
    ],
    documents_required: [
      { id: 'doc-identity', title: 'Identity Proof (PAN / Aadhaar / Voter ID)', description: 'Government verified ID', isMandatory: true },
      { id: 'doc-caste-cert', title: 'SC/ST Certificate (if applicable)', description: 'Authorized category verification for male applicants', isMandatory: false },
      { id: 'doc-project', title: 'Greenfield Project Plan & Machinery Quotations', description: 'Financial projection for 3-5 years', isMandatory: true }
    ],
    application_steps: [
      { step: 1, title: 'Profile on Stand-Up Mitra', description: 'Register as a Ready Borrower on standupmitra.in.', portalName: 'standupmitra.in' },
      { step: 2, title: 'Select Lending Bank Branch', description: 'Choose preferred scheduled commercial bank or lead bank branch.', portalName: 'Stand-Up Portal' },
      { step: 3, title: 'Bank Appraisal & Sanction', description: 'Branch inspects viability and sanctions composite term loan.', portalName: 'Commercial Bank' }
    ],
    source_name: 'Stand-Up India Portal / Ministry of Finance / SIDBI',
    source_url: 'https://www.standupmitra.in/',
    source_tier: 'tier1_official',
    last_verified_at: '2026-08-28',
    trust_state: 'verified',
    official_portal_url: 'https://www.standupmitra.in/'
  },
  {
    id: 'pm-mudra-03',
    slug: 'mudra-yojana',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    name_hi: 'प्रधानमंत्री मुद्रा योजना (PMMY)',
    code: 'FIN-MUDRA-2026',
    ministry: 'Ministry of Finance',
    department: 'Mudra Bank / Financial Services',
    level: 'central',
    description: 'Provides collateral-free loans up to ₹20 Lakh to non-corporate, non-farm small and micro enterprises across three categories: Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 Lakh), and Tarun (₹5 Lakh to ₹20 Lakh).',
    description_hi: 'गैर-कॉर्पोरेट, गैर-कृषि लघु और सूक्ष्म उद्यमों को तीन श्रेणियों (शिशु, किशोर और तरुण) में ₹20 लाख तक का बिना गारंटी ऋण।',
    benefit_summary: 'Collateral-free loan up to ₹20 Lakh (Tarun Plus) with affordable interest rates & Mudra Card for working capital.',
    benefit_type: ['loan', 'working_capital', 'equipment'],
    benefit_amount_min: 20000,
    benefit_amount_max: 2000000,
    target_categories: ['General', 'OBC', 'SC', 'ST', 'Women', 'Artisan', 'Street Vendor', 'MSME / Entrepreneur'],
    target_genders: ['all', 'female', 'male'],
    business_types: ['Retail', 'Services', 'Manufacturing', 'Food Processing', 'Handicraft', 'Textile'],
    funding_needs: ['Working capital', 'Machinery & Equipment', 'Loan', 'Starting a business'],
    min_age: 18,
    rules: [
      {
        id: 'mudra-rule-age',
        attribute: 'age',
        operator: 'gte',
        value: 18,
        label: 'Minimum Age 18 Years',
        explanation: 'Any Indian citizen who has a business plan for a non-farm income-generating activity.',
        isHardRule: true,
      }
    ],
    documents_required: [
      { id: 'doc-id', title: 'Self-attested Identity Proof', description: 'Voter ID / Driving License / PAN / Aadhaar', isMandatory: true },
      { id: 'doc-bank', title: 'Last 6 Months Bank Statement', description: 'Existing account transaction history', isMandatory: true }
    ],
    application_steps: [
      { step: 1, title: 'Choose Loan Category', description: 'Identify Shishu, Kishore, or Tarun tier.', portalName: 'JanSamarth / Mudra' },
      { step: 2, title: 'Apply on JanSamarth', description: 'Submit digital application on official JanSamarth portal.', portalName: 'jansamarth.in' }
    ],
    source_name: 'JanSamarth Portal / Micro Units Development & Refinance Agency (MUDRA)',
    source_url: 'https://www.mudra.org.in/',
    source_tier: 'tier1_official',
    last_verified_at: '2026-08-28',
    trust_state: 'verified',
    official_portal_url: 'https://www.jansamarth.in/'
  },
  {
    id: 'pm-vishwakarma-04',
    slug: 'pm-vishwakarma',
    name: 'PM Vishwakarma Scheme',
    name_hi: 'पीएम विश्वकर्मा योजना',
    code: 'MSME-VISHWA-2026',
    ministry: 'Ministry of MSME & Ministry of Skill Development',
    department: 'Central Nodal Agency for Traditional Crafts',
    level: 'central',
    description: 'Holistic support for traditional artisans and craftspeople working in 18 designated trades: carpentry, boat making, blacksmith, goldsmith, potter, sculptor, cobbler, tailor, basket maker, and others. Includes PM Vishwakarma Certificate, skill upgrading, toolkit incentive of ₹15,000, and collateral-free enterprise loans up to ₹3 Lakh at 5% interest.',
    description_hi: '18 पारंपरिक व्यवसायों में काम करने वाले कारीगरों और शिल्पकारों के लिए प्रमाण पत्र, ₹15,000 टूलकिट अनुदान और 5% रियायती ब्याज पर ₹3 लाख तक का बिना गारंटी ऋण।',
    benefit_summary: 'PM Vishwakarma ID card + ₹15,000 Toolkit Incentive + ₹1 Lakh (Tranche 1) & ₹2 Lakh (Tranche 2) loans at concessional 5% interest.',
    benefit_type: ['training', 'subsidy', 'loan', 'equipment'],
    benefit_amount_min: 15000,
    benefit_amount_max: 300000,
    subsidy_percentage: 100,
    target_categories: ['Artisan', 'OBC', 'SC', 'ST', 'Youth'],
    target_genders: ['all', 'female', 'male'],
    business_types: ['Handicraft', 'Textile', 'Services', 'Manufacturing'],
    funding_needs: ['Machinery & Equipment', 'Training', 'Loan', 'Subsidy', 'Working capital'],
    min_age: 18,
    rules: [
      {
        id: 'vishwa-rule-trade',
        attribute: 'traditional_trade',
        operator: 'in',
        value: ['carpenter', 'boat_builder', 'blacksmith', 'potter', 'sculptor', 'cobbler', 'tailor', 'Handicraft', 'Textile'],
        label: 'Engaged in 18 Recognized Trades',
        explanation: 'The artisan must be hands-on engaged in family-based traditional trades on self-employment basis.',
        isHardRule: true,
      }
    ],
    documents_required: [
      { id: 'doc-vishwa-aadhaar', title: 'Aadhaar Card with Mobile Link', description: 'Mandatory for biometric eKYC authentication', isMandatory: true },
      { id: 'doc-vishwa-bank', title: 'Bank Account Passbook', description: 'For direct DBT transfer of ₹15,000 toolkit stipend and loans', isMandatory: true }
    ],
    application_steps: [
      { step: 1, title: 'Biometric Registration at CSC', description: 'Visit nearest Common Services Centre (CSC) for Aadhaar biometric e-KYC.', portalName: 'pmvishwakarma.gov.in' },
      { step: 2, title: 'Toolkit Grant of ₹15,000', description: 'Digital e-Voucher issued for purchasing modern trade toolkits.', portalName: 'PM Vishwakarma e-Voucher' },
      { step: 3, title: 'Collateral-free Loan Access', description: 'Avail Tranche 1 (₹1 Lakh) and Tranche 2 (₹2 Lakh) at 5% interest.', portalName: 'Partner Banks' }
    ],
    source_name: 'Ministry of MSME / PM Vishwakarma Portal',
    source_url: 'https://pmvishwakarma.gov.in/',
    source_tier: 'tier1_official',
    last_verified_at: '2026-08-28',
    trust_state: 'verified',
    official_portal_url: 'https://pmvishwakarma.gov.in/'
  }
];

// Merge Full 2066 Ingested Schemes from all_schemes.json
const rawList = (allSchemesRaw as unknown) as Scheme[];

// Map IDs to avoid duplication with Flagship items
const flagshipIds = new Set(FLAGSHIP_SCHEMES.map((s) => s.slug));
const additionalSchemes = rawList.filter((s) => !flagshipIds.has(s.slug));

export const VERIFIED_SCHEMES: Scheme[] = [...FLAGSHIP_SCHEMES, ...additionalSchemes];

export const INDIAN_STATES: StateData[] = (allStatesRaw as unknown) as StateData[];

// Helper utilities for fast search and matching
export function getSchemesByState(stateName: string): Scheme[] {
  const normState = stateName.toLowerCase().trim();
  return VERIFIED_SCHEMES.filter(
    (s) => s.level === 'central' || (s.level === 'state' && s.state_name?.toLowerCase().trim() === normState)
  );
}

export function searchSchemes(query: string, limit: number = 50): Scheme[] {
  const q = query.toLowerCase().trim();
  if (!q) return VERIFIED_SCHEMES.slice(0, limit);
  return VERIFIED_SCHEMES.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.ministry.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      (s.state_name && s.state_name.toLowerCase().includes(q))
  ).slice(0, limit);
}
