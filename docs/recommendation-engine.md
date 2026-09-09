# UdyamSetu Personalization & Recommendation Engine v2.2

## Multi-Factor Personalization Scoring

Personalization operates strictly after hard eligibility filtering.

### Transparent Signal Weights
$$\text{Relevance Score} = \sum (\text{Weight}_i \times \text{Factor}_i)$$

| Dimension | Weight | Description |
|---|---|---|
| **Occupation Fit** | **25%** | Trade and persona alignment (Tailor vs Street Vendor vs Farmer vs Startup) |
| **Support Need Fit** | **20%** | Match between stated needs (Loan, Subsidy, Machinery) and scheme benefits |
| **Business Stage Fit** | **15%** | Greenfield / New Enterprise vs Brownfield / Existing unit expansion |
| **Sector Fit** | **15%** | Taxonomy alignment with business sector |
| **Location & Residence Fit** | **10%** | State jurisdiction match + Rural higher subsidy multiplier (15% vs 35%) |
| **Demographic Incentives** | **5%** | Affirmative action incentives (Women, SC, ST) |
| **Readiness & Udyam** | **5%** | Active Udyam Registration and documentation readiness |
| **Benefit Fit** | **5%** | Scale alignment with applicant financial requirements |

### Signatures of Personalization
1. **Artisan / Tailor in Rural UP**:
   PM Vishwakarma and PMEGP (Textile & Garment) rise to the top with 35% rural subsidy highlight.
2. **Urban Street Vendor in Delhi**:
   PM SVANidhi and Mudra Shishu rise to the top with Certificate of Vending guidance.
3. **Tech Startup Founder in Bengaluru**:
   Startup India Seed Fund Scheme (SISFS) and CGTMSE credit guarantee rise to the top.
