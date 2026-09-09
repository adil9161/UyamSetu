# Contributing to UdyamSetu

Thank you for your interest in contributing to **UdyamSetu — AI-Powered Government Scheme Discovery & Eligibility Platform** (Smart India Hackathon 2026).

We welcome contributions from open-source developers, civic-tech enthusiasts, and researchers.

---

## 1. Code of Conduct

Please review and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all community interactions and contributions.

---

## 2. Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher
- **npm** or **yarn**

### Local Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_GITHUB_REPOSITORY_URL/UdyamSetu.git
   cd UdyamSetu
   ```

2. **Frontend Setup**:
   ```bash
   npm install
   npm run dev
   ```

3. **Backend Setup**:
   ```bash
   cd backend
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS / Linux:
   source .venv/bin/activate

   pip install -r requirements.txt
   python run.py
   ```

---

## 3. Contribution Workflow

1. **Create an Issue**: Open an issue describing the proposed feature, bugfix, or scheme dataset addition.
2. **Branch Naming**: Use descriptive branch prefixes:
   - `feat/add-new-state-schemes`
   - `fix/scoring-engine-boundary`
   - `docs/update-api-spec`
3. **Run Regression Tests**:
   ```bash
   python backend/tests/test_engine.py
   python backend/tests/test_demo_profiles.py
   npm run build
   ```
4. **Submit Pull Request**: Ensure PR descriptions reference the related issue and clearly articulate the changes made.

---

## 4. Grounding & Zero-Hallucination Guidelines

When adding or updating schemes:
- All statutory rules must be backed by official ministry circulars or gazette notifications.
- Include official portal links and verification timestamps.
- Do not invent artificial subsidies or eligibility criteria.
