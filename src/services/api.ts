/**
 * UdyamSetu Unified Frontend API Client.
 * Connects React 19 UI with Python FastAPI Intelligence Backend.
 * Features automated health probes, JWT handling, and graceful offline fallback.
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

class ApiClient {
  private token: string | null = null;
  private isOnline: boolean | null = null;

  constructor() {
    this.token = localStorage.getItem('udyamsetu_auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('udyamsetu_auth_token', token);
    } else {
      localStorage.removeItem('udyamsetu_auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Request failed with status ${response.status}`);
      }

      this.isOnline = true;
      return await response.json();
    } catch (error) {
      if ((error as any)?.name === 'TypeError' && (error as any)?.message?.includes('fetch')) {
        this.isOnline = false;
      }
      throw error;
    }
  }

  // Probe backend status
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(2000) });
      this.isOnline = res.ok;
      return res.ok;
    } catch {
      this.isOnline = false;
      return false;
    }
  }

  getIsOnline(): boolean | null {
    return this.isOnline;
  }

  // API Namespaces
  health = {
    check: () => this.request<{ status: string; total_schemes_indexed: number }>('/health'),
    benchmark: () => this.request<any>('/health/benchmark')
  };

  auth = {
    login: (email_or_phone: string, password?: string) =>
      this.request<{
        access_token: string;
        token_type: string;
        role: string;
        user_id: number;
        full_name: string;
        email_or_phone: string;
        age?: number;
        gender?: string;
        social_category?: string;
        education_level?: string;
        address?: string;
      }>(
        '/auth/login',
        { method: 'POST', body: JSON.stringify({ email_or_phone, password: password || 'demo1234' }) }
      ),
    register: (payload: {
      full_name: string;
      email_or_phone: string;
      password?: string;
      gender?: string;
      address?: string;
      age?: number;
      social_category?: string;
      education_level?: string;
    }) =>
      this.request<{
        access_token: string;
        token_type: string;
        role: string;
        user_id: number;
        full_name: string;
        email_or_phone: string;
        age?: number;
        gender?: string;
        social_category?: string;
        education_level?: string;
        address?: string;
      }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    me: () => this.request<any>('/auth/me')
  };

  schemes = {
    list: (params: { query?: string; level?: string; state_name?: string; sector?: string; page?: number; limit?: number } = {}) => {
      const q = new URLSearchParams();
      if (params.query) q.set('query', params.query);
      if (params.level && params.level !== 'all') q.set('level', params.level);
      if (params.state_name) q.set('state_name', params.state_name);
      if (params.sector && params.sector !== 'all') q.set('sector', params.sector);
      if (params.page) q.set('page', params.page.toString());
      if (params.limit) q.set('limit', params.limit.toString());
      return this.request<{ data: any[]; pagination: any }>(`/schemes?${q.toString()}`);
    },
    get: (slugOrId: string) => this.request<any>(`/schemes/${slugOrId}`),
    stats: () => this.request<any>('/schemes/stats/eda')
  };

  matching = {
    calculate: (profile: any) =>
      this.request<{
        best_matches: any[];
        near_matches: any[];
        ineligible_schemes: any[];
        summary: any;
        recommendation_id?: number;
      }>('/matching/calculate', {
        method: 'POST',
        body: JSON.stringify(profile)
      }),
    explain: (schemeId: string, profile?: any) =>
      this.request<{
        scheme_id: string;
        scheme_name: string;
        eligibility: string;
        overall_score: number;
        decision_trail: { step_name: string; status: string; details: string }[];
        rules_passed: string[];
        rules_failed: string[];
        evidence_citation: any;
        next_best_actions: any[];
      }>('/matching/explain', {
        method: 'POST',
        body: JSON.stringify({ scheme_id: schemeId, profile })
      }),
    history: (limit: number = 10) => this.request<any[]>(`/matching/history?limit=${limit}`)
  };

  ai = {
    chat: (query: string, userState?: string, userSector?: string) =>
      this.request<{
        answer: string;
        answer_hi?: string;
        sources: { name: string; url: string; date: string; confidence: number }[];
        suggested_action?: { label: string; view: string; slug?: string };
        engine_mode: string;
        confidence: number;
        model_used: string;
      }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ query, user_state: userState, user_sector: userSector })
      })
  };

  applications = {
    list: () => this.request<any[]>('/applications'),
    save: (schemeId: string, schemeName: string, schemeSlug?: string, notes?: string) =>
      this.request<any>('/applications', {
        method: 'POST',
        body: JSON.stringify({ scheme_id: schemeId, scheme_name: schemeName, scheme_slug: schemeSlug, notes })
      }),
    delete: (schemeId: string) => this.request<any>(`/applications/${schemeId}`, { method: 'DELETE' }),
    toggleDoc: (schemeId: string, documentId: string, isCompleted: boolean) =>
      this.request<any>(`/applications/${schemeId}/docs`, {
        method: 'PATCH',
        body: JSON.stringify({ document_id: documentId, is_completed: isCompleted })
      })
  };

  governance = {
    metrics: () => this.request<any>('/governance/metrics'),
    submitReport: (schemeId: string, schemeName: string, issueType: string, description: string) =>
      this.request<any>('/governance/reports', {
        method: 'POST',
        body: JSON.stringify({ scheme_id: schemeId, scheme_name: schemeName, issue_type: issueType, description })
      }),
    reports: () => this.request<any[]>('/governance/reports'),
    auditLogs: (limit: number = 20) => this.request<any[]>(`/governance/audit-logs?limit=${limit}`)
  };

  demo = {
    getProfiles: () => this.request<any[]>('/demo/profiles')
  };
}

export const api = new ApiClient();
