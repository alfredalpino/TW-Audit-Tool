You are a Staff Software Architect, Staff Product Designer, Technical SEO Expert, Accessibility Consultant, CRO Consultant, Security Auditor, and SaaS Product Lead.

Your task is to design and build a production-grade platform called:

# Torpedo Website Intelligence Auditor

Domain:

```text
audit.torpedoweb.org
```

This is not a simple website audit tool.

This is an enterprise-grade Website Intelligence Platform that helps businesses discover:

- SEO issues
- Speed issues
- Accessibility issues
- UX issues
- CRO issues
- Technical issues
- Security issues
- Legal compliance issues
- AI discoverability issues
- Revenue leakage

The goal is:

1. Generate high-quality leads for Torpedo Web
2. Demonstrate technical expertise
3. Provide real business value
4. Create the best free website auditor on the internet

---

# PRIMARY GOAL

Instead of giving users generic scores, estimate:

```text
Traffic Loss
Lead Loss
Conversion Loss
Revenue Leakage
Growth Opportunities
```

Every issue should be tied to business impact.

Example:

Bad:

"Missing alt tags"

Good:

"Accessibility violations may expose the business to compliance risk and reduce usability for a portion of visitors."

---

# TECH STACK

Build using (Use the latest updated version of the libraries and apps.):

Frontend:

```text
Next.js 16.2.7
React
TypeScript
Tailwind CSS
ShadCN UI
Framer Motion
```

Backend:

```text
Next.js Route Handlers
Node.js
TypeScript
```

Database:

```text
PostgreSQL (local Docker Compose for dev; managed Postgres in production)
```

ORM:

```text
Drizzle ORM
```

Queue:

```text
BullMQ
Redis
```

Auditing:

```text
Lighthouse
Playwright
axe-core
web-vitals
```

Reports:

```text
React PDF
```

Charts:

```text
Recharts
```

Email:

```text
Resend
```

Deployment:

```text
Vercel
```

---

# PROJECT STRUCTURE

Generate complete folder architecture.

Example:

```text
src/

app/

components/

features/

audit/

seo/
speed/
cro/
ux/
technical/
security/
accessibility/
compliance/
ai-readiness/

workers/

audit-worker/

lib/

lighthouse/
playwright/
scoring/
reports/
screenshots/

types/

hooks/

actions/

db/
```

Design the architecture for future scalability.

---

# BRANDING

Company:

Torpedo Web

Positioning:

Premium Digital Engineering Firm

Theme:

Dark Luxury

Colors:

```text
Black
White
Gray
Subtle Blue Accent
```

Style:

```text
Linear
Vercel
Stripe
Apple
```

Characteristics:

```text
Fast
Minimal
Premium
Technical
Trustworthy
```

---

# LANDING PAGE

Design complete homepage.

Sections:

## Hero

Headline:

```text
Find What Is Costing Your Website Traffic, Leads, and Revenue.
```

Subheadline:

```text
Analyze speed, SEO, accessibility, conversions, security, compliance, and growth opportunities in under 60 seconds.
```

Input:

```text
Enter Website URL
```

CTA:

```text
Run Free Audit
```

---

# HEADER

Left:

```text
Torpedo Logo
```

Navigation:

```text
Features
How It Works
Audit Categories
Pricing
FAQ
```

Right:

```text
Run Audit
Book Consultation
```

Sticky navigation.

Glassmorphism effect.

---

# FOOTER

Columns:

Company

```text
About
Contact
Services
Case Studies
```

Resources

```text
Blog
Guides
Documentation
```

Tools

```text
Website Auditor
SEO Auditor
Speed Auditor
Accessibility Auditor
```

Legal

```text
Privacy Policy
Terms
Cookie Policy
```

---

# AUDIT CATEGORIES

Design each audit category as its own engine.

---

# 1. SEO AUDIT

Analyze:

```text
Title Tag
Meta Description
Canonical Tags
Sitemap
Robots.txt
Indexability
Structured Data
Schema
Open Graph
Twitter Cards
H1 Usage
Heading Hierarchy
Broken Links
Image SEO
Internal Linking
```

Output:

Score

Issues

Recommendations

Business Impact

Priority

---

# 2. SPEED AUDIT

Analyze:

```text
LCP
CLS
INP
FCP
TTFB
JS Bundle Size
Image Optimization
Caching
Compression
```

Desktop and Mobile.

Generate charts.

---

# 3. ACCESSIBILITY AUDIT

Using:

```text
axe-core
```

Analyze:

```text
Alt Text
Contrast
Keyboard Navigation
Focus States
ARIA
Labels
Forms
Screen Reader Compatibility
```

Generate:

```text
WCAG Compliance Score
ADA Risk Score
```

---

# 4. CRO AUDIT

Conversion Rate Optimization.

Analyze:

```text
CTA Visibility
CTA Placement
Lead Forms
Trust Signals
Social Proof
Testimonials
Review Presence
Navigation Friction
Conversion Friction
```

Estimate:

```text
Lead Leakage
Conversion Leakage
```

---

# 5. UX AUDIT

Analyze:

```text
Visual Hierarchy
Spacing
Typography
Readability
Consistency
Mobile Usability
Layout Stability
Information Architecture
```

---

# 6. TECHNICAL AUDIT

Analyze:

```text
Framework Detection
SSR
CSR
Hydration
Bundle Analysis
Core Web Vitals
Code Splitting
Performance Architecture
```

Detect:

```text
Next.js
React
Shopify
WordPress
Webflow
Wix
Framer
Laravel
```

---

# 7. SECURITY AUDIT

Analyze:

```text
HTTPS
TLS
HSTS
CSP
Referrer Policy
Security Headers
Mixed Content
```

Generate security score.

---

# 8. LEGAL COMPLIANCE AUDIT

Analyze:

```text
ADA
WCAG
GDPR
CCPA
DPDP
Cookie Banner
Privacy Policy
Terms
```

Generate compliance score.

---

# 9. AI READINESS AUDIT

Analyze:

```text
Schema
Semantic HTML
Metadata
Content Structure
AI Discoverability
Entity Coverage
llms.txt
```

Generate:

```text
AI Visibility Score
```

---

# 10. CONTENT AUDIT

Analyze:

```text
Readability
Thin Content
Heading Structure
Keyword Usage
Content Quality
```

---

# 11. MOBILE EXPERIENCE AUDIT

Using Playwright.

Capture:

```text
iPhone
Android
Tablet
Desktop
```

Detect:

```text
Overflow
Broken Layouts
Tap Targets
Responsive Issues
```

Store screenshots.

---

# SCREENSHOT ENGINE

Create screenshot service.

Capture:

```text
Desktop
Mobile
Tablet
```

Annotate:

```text
Problem Areas
```

Save screenshots.

Generate reports.

---

# SCORING ENGINE

Design weighted scoring.

Example:

```text
SEO 20%
Speed 20%
UX 15%
Accessibility 10%
CRO 15%
Technical 10%
Security 5%
AI Readiness 5%
```

Generate:

```text
Overall Score
```

0-100.

---

# BUSINESS IMPACT ENGINE

Create formulas to estimate:

```text
Traffic Loss
Lead Loss
Revenue Leakage
Growth Opportunity
```

Based on:

```text
SEO
Speed
CRO
UX
```

Return ranges.

Never show fake precision.

Use ranges.

Example:

```text
₹20,000 - ₹80,000 monthly opportunity
```

---

# PDF REPORT GENERATOR

Generate beautiful PDF.

Sections:

```text
Executive Summary
Scores
Issues
Recommendations
Screenshots
Business Impact
Next Steps
```

Brand:

Torpedo Web.

---

# LEAD CAPTURE

After audit:

Show summary.

Blur detailed recommendations.

Unlock by entering:

```text
Name
Email
Phone
Company
```

Store in PostgreSQL via Drizzle ORM.

Send report via email.

---

# DASHBOARD

Create admin dashboard.

View:

```text
Leads
Audits
Reports
Emails
```

Search.

Filter.

Export.

---

# DATABASE SCHEMA

Generate complete schema.

Tables:

```text
users
audits
audit_scores
audit_issues
screenshots
reports
leads
email_logs
```

Include indexes.

Include relationships.

---

# WORKERS

Design background workers.

Workers:

```text
Audit Worker
Screenshot Worker
Report Worker
Email Worker
```

Use BullMQ.

Retry strategy.

Error handling.

Monitoring.

---

# API DESIGN

Generate complete API architecture.

Routes.

Request examples.

Response examples.

Validation.

Rate limiting.

Caching.

---

# SECURITY

Implement:

```text
Rate Limiting
Bot Protection
Input Validation
Zod
Sanitization
Queue Isolation
```

---

# DOCUMENTATION

Generate:

1. Product Requirements Document
2. System Design Document
3. Folder Structure Documentation
4. Database Documentation
5. Worker Documentation
6. Deployment Guide
7. Local Development Guide
8. Scaling Guide
9. Cost Estimation Guide
10. Future SaaS Expansion Guide

---

# FINAL DELIVERABLE

Produce:

1. Complete architecture
2. Complete technical documentation
3. Complete database schema
4. Complete UI wireframes
5. Component architecture
6. Worker architecture
7. API architecture
8. Folder structure
9. Build phases
10. MVP roadmap
11. Production roadmap
12. Enterprise roadmap

Do not generate shallow content.

Think like a principal engineer building a venture-backed SaaS platform that must handle tens of thousands of audits per month. Design everything for maintainability, scalability, observability, and future monetization.