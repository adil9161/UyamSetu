/**
 * UdyamSetu AI Advisor Statutory Policy Contract
 * Smart India Hackathon 2026 Core Architectural Boundary:
 * Deterministic rules decide eligibility. Intelligence personalizes the experience. AI explains and guides.
 * AI must NEVER invent or override official eligibility rules.
 */

export interface AIAdvisorPolicy {
  mayExplainEligibility: true;
  mayRankEligibleSchemes: true;
  maySuggestPreparationSteps: true;
  maySuggestQuestions: true;
  mayInventEligibility: false;
  mayInventBenefits: false;
  mayInventApplicationLinks: false;
  mayOverrideHardRules: false;
  mayClaimGovernmentApproval: false;
}

export const AI_ADVISOR_POLICY: AIAdvisorPolicy = {
  mayExplainEligibility: true,
  mayRankEligibleSchemes: true,
  maySuggestPreparationSteps: true,
  maySuggestQuestions: true,
  mayInventEligibility: false,
  mayInventBenefits: false,
  mayInventApplicationLinks: false,
  mayOverrideHardRules: false,
  mayClaimGovernmentApproval: false
};

/**
 * Validates that an AI-generated explanation does not violate statutory safety constraints.
 */
export function validateAIExplanation(content: string, deterministicStatus: string): boolean {
  const contentLower = content.toLowerCase();

  // If deterministic status is ineligible, AI cannot claim qualification
  if (deterministicStatus === 'ineligible') {
    if (contentLower.includes('you are eligible') || contentLower.includes('definitely qualify') || contentLower.includes('guaranteed approval')) {
      return false;
    }
  }

  // AI cannot fabricate official approval
  if (contentLower.includes('government has approved') || contentLower.includes('sanction guaranteed')) {
    return false;
  }

  return true;
}
