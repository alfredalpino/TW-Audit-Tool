# TorpedoWeb LLC Technical Implementation Checklist

This checklist outlines the technical steps required to implement the updated legal and privacy policies, enhance website security, and ensure compliance. It is designed for TorpedoWeb's engineering and operations teams.

## 1. Website & Security Enhancements

| Task | Description | Priority | Estimated Effort | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Implement Cookie Consent Banner** | Develop and deploy a cookie consent banner with granular control options for different cookie categories (essential, analytics, marketing). Integrate with a Consent Management Platform (CMP) if feasible. | High | 3-5 days | To Do |
| **Update Security Headers** | Configure web server/CDN to include missing security headers: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`. | High | 1-2 days | To Do |
| **Obfuscate Public Email Addresses** | Replace plain-text `hello@torpedoweb.org` with a contact form or JavaScript obfuscation to reduce spam. | Medium | 0.5 days | To Do |
| **Review & Harden Vercel Configuration** | Investigate and address the `/blocked` redirect issue. Ensure Vercel's security features are fully utilized. | High | 1-2 days | To Do |
| **Implement HSTS Preload** | Submit `torpedoweb.org` for HSTS preload list to enforce HTTPS. | Medium | 0.5 days | To Do |

## 2. Legal Policy Implementation

| Task | Description | Priority | Estimated Effort | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Publish New Terms of Service** | Replace current `/terms-of-service` page content with the production-ready Markdown/HTML. | High | 0.5 days | To Do |
| **Publish New Privacy Policy** | Replace current `/privacy-policy` page content with the production-ready Markdown/HTML. | High | 0.5 days | To Do |
| **Link DPA** | Ensure the Data Processing Addendum (DPA) is readily available for clients, either as a downloadable PDF or a linked page. | High | 0.5 days | To Do |
| **Update Internal Document Links** | Ensure all internal references to ToS and Privacy Policy point to the new versions. | Low | 0.5 days | To Do |

## 3. Data Privacy & Compliance

| Task | Description | Priority | Estimated Effort | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Data Subject Request (DSR) Workflow** | Establish a clear, documented process for handling DSRs (access, rectification, erasure, etc.) from users, including a dedicated intake form/email. | High | 2-3 days | To Do |
| **Data Retention Policy Enforcement** | Implement technical mechanisms (e.g., automated scripts, database configurations) to enforce data retention schedules as defined in the Privacy Policy. | High | 3-5 days | To Do |
| **Breach Notification Playbook** | Develop and disseminate an internal playbook for responding to and notifying authorities/users in the event of a data breach. | High | 2-3 days | To Do |
| **Vendor/Subprocessor Review** | Audit all third-party vendors and subprocessors to ensure they meet data protection standards and have appropriate DPAs in place. | Medium | 5-7 days | To Do |
| **Internal Privacy Training** | Conduct mandatory training for all employees/contractors on data privacy best practices, DSR handling, and breach protocols. | Medium | 1 day | To Do |

## 4. Sprint Backlog (Example)

This is a prioritized example sprint backlog. Effort estimates are in story points or ideal days.

| Priority | User Story | Effort (Days) | Code/API Changes | Status |
| :--- | :--- | :--- | :--- | :--- |
| 1 | As a user, I want to see a cookie consent banner so I can manage my privacy preferences. | 3 | Frontend (React/JS), CMP integration | To Do |
| 2 | As a system administrator, I want to configure security headers to protect against common web vulnerabilities. | 1 | Web server config (Nginx/Apache) or Vercel config | To Do |
| 3 | As a legal team member, I want the new ToS and Privacy Policy to be live on the website. | 0.5 | CMS update, HTML/MD file upload | To Do |
| 4 | As a user, I want to submit a Data Subject Request through a dedicated form. | 2 | Backend API, Frontend form, Email integration | To Do |
| 5 | As a developer, I want to ensure all public email addresses are obfuscated to prevent spam. | 0.5 | Frontend (JS) | To Do |
| 6 | As a legal team member, I want the DPA to be easily accessible for clients. | 0.5 | CMS update, file upload | To Do |
| 7 | As a system administrator, I want to enforce data retention policies for user data. | 4 | Database scripts, cron jobs | To Do |

---

**Requires Licensed Delaware Attorney for Final Sign-off for legal implications of technical changes.**
