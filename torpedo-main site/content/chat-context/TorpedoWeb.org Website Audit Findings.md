# TorpedoWeb.org Website Audit Findings

## 1. Legal & Compliance Flaws

| Flaw | Severity | URL(s) | Rationale/Remediation |
| :--- | :--- | :--- | :--- |
| **Vague Governing Law** | High | `/terms-of-service` | The ToS mentions "jurisdiction in which Torpedo Web operates" instead of explicitly stating Delaware. This creates ambiguity and legal risk. |
| **Missing Delaware Arbitration Clause** | High | `/terms-of-service` | No explicit arbitration or venue clause for Delaware, increasing potential litigation costs. |
| **Inadequate Privacy Disclosures (GDPR/CCPA)** | High | `/privacy-policy` | Lacks detailed mapping of data subject rights, lawful bases, and specific transfer mechanisms required for global operations. |
| **Missing Cookie Consent Mechanism** | Medium | All | No visible cookie banner or granular consent flow for tracking technologies. |
| **No Data Processing Addendum (DPA)** | High | `/privacy-policy` | As a digital agency processing client data, a public-facing or linkable DPA is missing. |
| **Missing DMCA Notice Procedures** | Medium | `/terms-of-service` | No safe harbor protections for user-generated content or third-party integrations. |

## 2. Technical & Security Flaws

| Flaw | Severity | URL(s) | Rationale/Remediation |
| :--- | :--- | :--- | :--- |
| **Missing Security Headers** | Medium | All | Lack of HSTS, CSP, and X-Frame-Options headers (to be verified via shell tools if needed). |
| **Public Email Exposure** | Low | All | `hello@torpedoweb.org` is exposed in plain text, increasing spam risk. Use obfuscation or contact forms. |

## 3. UX & SEO Flaws

| Flaw | Severity | URL(s) | Rationale/Remediation |
| :--- | :--- | :--- | :--- |
| **Single-Page Navigation Issues** | Low | Home | Some "SCROLL" links or sections might not have proper ARIA labels for accessibility. |
| **Generic Testimonials** | Low | Home | Testimonials lack links to projects or verifiable proof, which may impact professional credibility. |

## 4. Privacy & Tracking

- **Tracking Found:** Mentions analytics and site functionality.
- **Retention:** Vague "as long as needed" statement.
- **Breach Notification:** No mention of procedures or timelines.

## 5. Detailed Security Header Analysis

| Header | Status | Impact |
| :--- | :--- | :--- |
| **Strict-Transport-Security** | Present | Good protection against man-in-the-middle attacks. |
| **Content-Security-Policy** | **MISSING** | High risk of Cross-Site Scripting (XSS) and data injection. |
| **X-Frame-Options** | **MISSING** | Risk of clickjacking attacks. |
| **X-Content-Type-Options** | **MISSING** | Risk of MIME-type sniffing. |
| **Referrer-Policy** | **MISSING** | Potential leakage of sensitive information in referrer headers. |

**Note:** The site appears to be hosted on Vercel and is currently redirecting some requests to `/blocked`, suggesting active bot protection or geo-blocking that may interfere with legitimate crawlers and user experience.
