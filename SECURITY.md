# Security Policy

## 1. Supported Versions

We release patches and security fixes for the current primary version of UdyamSetu:

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| < 2.0   | :x:                |

---

## 2. Reporting a Vulnerability

The UdyamSetu project team takes civic-technology security and citizen privacy with utmost seriousness.

If you believe you have found a security vulnerability:

1. **Do not open a public GitHub issue.**
2. Send a detailed report to the security team via private repository advisory or email: `security@udyamsetu.org` (or directly contact maintainers).
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
4. You will receive an acknowledgment within 48 hours.

---

## 3. Strict Citizen Privacy Commitments

1. **Zero Financial Credential Collection**: UdyamSetu strictly evaluates scheme eligibility. The system **never** requests or stores bank account passwords, ATM PINs, UPI credentials, or OTPs.
2. **Deterministic Processing**: Personal demographic information provided in eligibility evaluations is processed strictly for rule matching.
3. **No Committed Secrets**: API keys, JWT secrets, and database credentials must never be committed to Git history. Always use `.env` files following `.env.example`.
