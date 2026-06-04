Below is your **complete technical roadmap document** for rebuilding Torpedo Web on **Next.js 16 (App Router)** with:

* Reverse proxy preview system (Step 4 – Option C(Reverse proxy preview system))
* Supabase Auth + PostgreSQL (Step 5 – Option C(Supabase Auth and Backend))
* WordPress delivery layer
* Custom booking system
* Client dashboard
* Production-ready structure for scale

This is structured so you can paste sections directly into Cursor and begin implementation.

---

# TORPEDO WEB — PLATFORM REBUILD ROADMAP

**Architecture: Next.js 16 + Supabase + WordPress (Reverse-Proxy Secured)**

---

# 1. SYSTEM OVERVIEW

## Core Philosophy

Marketing, application logic, and client delivery are separate layers but unified under one platform.

```
Marketing Layer      → Next.js (SSR / SEO optimized)
Application Layer    → Next.js (App Router + API Routes)
Database/Auth        → Supabase (Postgres + RLS)
Client Delivery      → WordPress (staging + production)
Security Layer       → Next.js Middleware + Reverse Proxy
Hosting              → Vercel (App) + VPS (WordPress)
```

---

# 2. TECH STACK (FINALIZED)

Frontend:

* Next.js 16 (App Router)
* TypeScript
* Tailwind (custom theme)
* Framer Motion
* Lucide Icons

Backend:

* Next.js Route Handlers
* Supabase (PostgreSQL + Auth)
* Edge Middleware

External:

* Google Calendar API
* Resend (emails)

---

# 3. PROJECT STRUCTURE

```
/app
  /(marketing)
    page.tsx
    about/page.tsx
    services/page.tsx
    book/page.tsx

  /(portal)
    dashboard/page.tsx
    preview/page.tsx
    projects/[id]/page.tsx

  /api
    /preview/validate/route.ts
    /preview/proxy/[slug]/route.ts
    /booking/create/route.ts

/middleware.ts
/lib
  supabase.ts
  auth.ts
  tokens.ts
  rate-limit.ts
  proxy.ts
```

---

# 4. DATABASE SCHEMA (SUPABASE)

## users

* id (uuid, primary key)
* role (admin | team | client)
* created_at

## projects

* id
* client_id (uuid)
* name
* slug
* staging_url
* status
* created_at

## preview_tokens

* id
* project_id
* token_hash
* expires_at
* max_views
* current_views
* is_active
* created_at

## bookings

* id
* name
* email
* project_type
* budget_range
* timeline
* scheduled_at
* created_at

## milestones

* id
* project_id
* title
* status
* due_date

Enable Row Level Security:

* Clients can only view their own projects
* Admin can view all

---

# 5. AUTHENTICATION — SUPABASE (Option C)

Why Supabase:

* Built-in auth
* JWT-based sessions
* RLS security
* Easy integration with Next.js

Implementation:

* Install Supabase SDK
* Create client in /lib/supabase.ts
* Use server-side client in route handlers
* Protect /portal routes via middleware

Role-based access:

* Admin
* Team
* Client

---

# 6. PREVIEW SYSTEM — REVERSE PROXY (Option C)

This is the most important part.

You do NOT expose WordPress staging publicly.

### Goal

All preview traffic must pass through Next.js.

---

## Flow

1. User enters 6-character code

2. POST /api/preview/validate

3. Server:

   * Hash token
   * Compare with DB
   * Check expiry
   * Increment view count
   * Return signed preview session

4. User redirected to:

```
/api/preview/proxy/project-slug?session=jwt
```

5. Proxy handler:

   * Validate JWT
   * Fetch content from WordPress staging
   * Return response
   * Strip WP headers
   * Block direct access

WordPress staging should:

* Not be indexed
* Not linked publicly
* Possibly protected by firewall rules

---

## Token Security

6-character alphanumeric uppercase.

Do NOT store plain token.

Store:
SHA-256 hash(token)

Add:

* Rate limiting middleware
* Max attempts per IP
* Expiry window (7–14 days)

---

# 7. MIDDLEWARE LOGIC

Use Next.js middleware for:

* Protecting /portal routes
* Checking Supabase session
* Blocking brute-force preview attempts
* Validating preview session token

---

# 8. CUSTOM BOOKING SYSTEM

Route:
/book

Multi-step UI:

1. Project type
2. Budget range
3. Timeline
4. Description
5. Calendar slot

Backend:

* Store booking in DB
* Create Google Calendar event
* Send branded confirmation email

Remove Calendly completely.

---

# 9. CLIENT DASHBOARD

Route:
/portal/dashboard

Features:

## Overview

* Project status
* Milestones
* Payment status

## Preview Access

* Active preview tokens
* Generate new token (admin only)

## File Exchange

* Supabase storage
* Upload/download system

## Activity Log

* Comments
* Updates
* Version logs

---

# 10. WORDPRESS DELIVERY STRATEGY

For each client:

Production:
clientdomain.com

Staging:
staging.torpedoweb.org/project-slug

Rules:

* Noindex
* Hidden from navigation
* Accessed only through proxy

---

# 11. DEVELOPMENT SPRINT PLAN

## Sprint 1 — Foundation (Week 1)

* Scaffold Next.js 16
* Setup Supabase
* Create DB schema
* Configure RLS
* Implement Auth
* Protect /portal routes

Deliverable:
Working auth + dashboard skeleton

---

## Sprint 2 — Preview System (Week 2)

* Token generator utility
* Hashing logic
* Validation route
* Proxy route
* Middleware security
* Rate limiting

Deliverable:
Fully secure preview system

---

## Sprint 3 — Booking System (Week 3)

* Multi-step form
* DB integration
* Google Calendar sync
* Email confirmation

Deliverable:
Calendly removed

---

## Sprint 4 — Dashboard Expansion (Week 4)

* Project detail page
* Milestones
* File upload
* Activity logs

Deliverable:
Complete client portal

---

# 12. DEPLOYMENT STRATEGY

Next.js → Vercel
Supabase → Managed
WordPress → VPS (DigitalOcean / Hetzner)

Add:

* Env variables securely
* Edge middleware enabled
* Rate limits configured

---

# 13. SECURITY CHECKLIST

* Hash all preview tokens
* Enable RLS
* Rate limit preview validation
* Expiry on tokens
* Strip WordPress headers in proxy
* Disable direct staging access via firewall
* Use HTTPS everywhere

---

# 14. POSITIONING IMPACT

This transforms Torpedo Web into:

* Structured digital delivery platform
* Secure preview infrastructure
* Controlled client lifecycle system
* Productized service architecture

This is not agency-grade.
This is platform-grade.

---

# 15. FIRST TASK FOR CURSOR

Paste this:

“Scaffold a Next.js 16 App Router project with TypeScript. Configure Supabase client. Create database schema for users, projects, preview_tokens, bookings. Implement role-based auth with middleware protecting /portal routes.”

Start there.

---