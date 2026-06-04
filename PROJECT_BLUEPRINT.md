# Torpedo Website Intelligence Auditor — Project Blueprint

**Version:** 1.0  
**Domain:** `audit.torpedoweb.org`  
**Source of truth:** `AudittoolPlan.md`, `DESIGN-GUIDE.md`  
**Status:** Phase 2 complete — real audit engines + worker pipeline

---

## 1. Executive summary

The Torpedo Website Intelligence Auditor is an enterprise-grade website intelligence platform that ties every technical finding to business impact (traffic loss, lead leakage, conversion loss, revenue leakage, trust loss, growth opportunity). It is a lead-generation and expertise demonstration engine for Torpedo Web, designed to scale to **tens of thousands of audits per month** with queue-backed workers, PostgreSQL persistence, and a data-dense engineering-product UI.

**Product UI aesthetic:** Dark, high-contrast developer tooling (Linear, Vercel, Raycast, Stripe Dashboard) with **Torpedo brand tokens** (orange CTAs `#ff4e00`, Syne/DM Sans/JetBrains Mono, dark surfaces from DESIGN-GUIDE §3.5). Marketing landing uses the same tokens but may use lighter hero bands; the **app shell defaults to `data-theme="dark"`**.

---

## 2. System design

### 2.1 High-level architecture

```mermaid
flowchart TB
  subgraph clients [Clients]
    Browser[Browser / Marketing + App]
    Admin[Admin Dashboard]
  end

  subgraph vercel [Vercel Edge + Serverless]
    Next[Next.js App Router]
    API[Route Handlers / Server Actions]
  end

  subgraph data [Data Layer]
    PG[(PostgreSQL)]
    Redis[(Redis / Upstash)]
  end

  subgraph workers [Worker Tier - Phase 2+]
    AW[Audit Worker]
    SW[Screenshot Worker]
    RW[Report Worker]
    EW[Email Worker]
  end

  subgraph external [External Services]
    LH[Lighthouse]
    PW[Playwright]
    AXE[axe-core]
    RS[Resend]
    ST[Object Storage]
  end

  Browser --> Next
  Admin --> Next
  Next --> API
  API --> PG
  API --> Redis
  API -->|enqueue| Redis
  Redis --> AW
  AW --> LH
  AW --> PW
  AW --> AXE
  AW --> PG
  SW --> PW
  SW --> ST
  RW --> PG
  EW --> RS
```

### 2.2 Request paths

| Path | Handler | Phase |
|------|---------|-------|
| Public audit submit | `POST /api/audits` → create `AuditRun` → enqueue `audit:run` | 1 stub, 2 real |
| Poll status | `GET /api/audits/[id]` | 1 |
| Lead unlock | `POST /api/leads` | 2 |
| PDF download | `GET /api/reports/[id]/pdf` | 3 |
| Admin CRUD | `/api/admin/*` + RLS / role guard | 3 |

### 2.3 Monorepo vs single-app decision

**Phase 1:** Single Next.js application at repo root (`/`) with `src/` layout — fastest path to production structure without Turborepo overhead.

**Phase 4+ (optional):** Extract `packages/audit-engines`, `packages/scoring`, `apps/worker` when worker CPU/memory needs isolation from Vercel serverless limits.

```
TW-Audit-Tool/
├── PROJECT_BLUEPRINT.md
├── AudittoolPlan.md
├── DESIGN-GUIDE.md
├── src/
│   ├── app/                    # Next.js routes
│   ├── components/             # Shared UI
│   ├── features/               # Domain features
│   ├── audit/                  # Audit engines (by category)
│   ├── workers/                # BullMQ processors (Phase 2)
│   ├── lib/                    # Infra: db, queue, auth, scoring
│   ├── types/
│   ├── hooks/
│   └── actions/
├── drizzle/                    # Migrations
├── scripts/                    # worker entry, seed
└── public/
```

---

## 3. Database ERD

### 3.1 Entity relationship diagram

```mermaid
erDiagram
  organizations ||--o{ users : has
  organizations ||--o{ audits : owns
  users ||--o{ audit_runs : triggers
  audits ||--o{ audit_runs : has
  audit_runs ||--o{ findings : produces
  audit_runs ||--o| reports : generates
  audit_runs ||--o{ leads : captures
  audit_runs ||--o{ audit_scores : scores
  audit_runs ||--o{ screenshots : stores

  organizations {
    uuid id PK
    string name
    string slug UK
    timestamptz created_at
  }

  users {
    uuid id PK
    uuid organization_id FK
    string email UK
    string name
    enum role
    timestamptz created_at
  }

  audits {
    uuid id PK
    uuid organization_id FK
    string url
    string normalized_url UK
    jsonb metadata
    timestamptz created_at
  }

  audit_runs {
    uuid id PK
    uuid audit_id FK
    uuid user_id FK
    enum status
    enum trigger
    jsonb config
    jsonb summary
    int overall_score
    timestamptz started_at
    timestamptz completed_at
  }

  findings {
    uuid id PK
    uuid audit_run_id FK
    enum category
    enum severity
    string title
    text description
    text recommendation
    text business_impact
    jsonb evidence
    int priority_score
    float category_weight
  }

  audit_scores {
    uuid id PK
    uuid audit_run_id FK
    enum category
    int score
    jsonb breakdown
  }

  leads {
    uuid id PK
    uuid audit_run_id FK
    string email
    string name
    string phone
    string company
    enum source
    timestamptz created_at
  }

  reports {
    uuid id PK
    uuid audit_run_id FK
    enum status
    string storage_key
    timestamptz generated_at
  }

  screenshots {
    uuid id PK
    uuid audit_run_id FK
    enum viewport
    string storage_key
    jsonb annotations
  }
```

### 3.2 Indexes (production)

| Table | Index | Purpose |
|-------|-------|---------|
| `audits` | `(normalized_url)` | Dedupe / history |
| `audit_runs` | `(audit_id, created_at DESC)` | Timeline |
| `audit_runs` | `(status)` WHERE pending | Worker pickup |
| `findings` | `(audit_run_id, severity, priority_score DESC)` | Matrix UI |
| `leads` | `(email, created_at)` | Admin search |

---

## 4. Worker flow diagrams

### 4.1 Audit run pipeline

```mermaid
sequenceDiagram
  participant U as User
  participant API as Next API
  participant Q as BullMQ
  participant W as Audit Worker
  participant DB as PostgreSQL

  U->>API: POST /api/audits { url }
  API->>DB: upsert Audit, insert AuditRun (queued)
  API->>Q: audit:run { runId }
  API-->>U: { runId, status: queued }

  Q->>W: process job
  W->>DB: status = running
  par Category engines
    W->>W: SEO engine
    W->>W: Speed (Lighthouse)
    W->>W: A11y (axe)
    W->>W: CRO / UX / Tech / Security / Compliance / AI
  end
  W->>DB: findings, audit_scores, summary
  W->>Q: screenshot:capture
  W->>Q: report:generate
  W->>DB: status = completed
  U->>API: GET /api/audits/[id]
  API-->>U: scores, findings, impact ranges
```

### 4.2 Queue topology

```mermaid
flowchart LR
  subgraph queues [BullMQ Queues]
    Q1[audit:run]
    Q2[screenshot:capture]
    Q3[report:generate]
    Q4[email:send]
  end

  Q1 --> Q2
  Q1 --> Q3
  Q3 --> Q4
```

| Queue | Concurrency | Retries | Backoff |
|-------|-------------|---------|---------|
| `audit:run` | 5 per worker instance | 3 | exponential 2s |
| `screenshot:capture` | 10 | 2 | fixed 5s |
| `report:generate` | 3 | 3 | exponential |
| `email:send` | 20 | 5 | exponential |

**Phase 1:** Queue client + job type definitions + no-op processor stub. **Phase 2:** Deploy `scripts/worker.ts` on Railway/Fly/Render with Playwright browsers.

---

## 5. Audit methodology

Each category is an **isolated engine** under `src/audit/<category>/` implementing:

```typescript
interface AuditEngine {
  category: AuditCategory;
  run(ctx: AuditContext): Promise<EngineResult>;
}
```

`AuditContext`: normalized URL, Playwright page handle (Phase 2), Lighthouse flags, locale/currency for impact copy.

### 5.1 Category checklist (from AudittoolPlan)

| Category | Key signals | Tools |
|----------|-------------|-------|
| SEO | title, meta, canonical, sitemap, robots, schema, OG, headings, links | fetch + HTML parse |
| Speed | LCP, CLS, INP, FCP, TTFB, bundles | Lighthouse |
| Accessibility | WCAG, contrast, keyboard, ARIA | axe-core |
| CRO | CTAs, forms, trust, friction | DOM heuristics |
| UX | hierarchy, spacing, IA, mobile | rules + vision (later) |
| Technical | framework, SSR/CSR, CWV architecture | headers + Lighthouse |
| Security | HTTPS, HSTS, CSP, headers | fetch + securityheaders |
| Compliance | GDPR/CCPA/ADA signals, cookie banner | DOM + policy links |
| AI Readiness | schema, semantic HTML, llms.txt | fetch |
| Mobile Experience | viewports, overflow, tap targets | Playwright |
| Screenshot Intelligence | desktop/mobile/tablet | Playwright + storage |

Every finding **must** include `business_impact` (narrative + optional impact band).

---

## 6. Scoring methodology

### 6.1 Weighted overall score (0–100)

| Category | Weight |
|----------|--------|
| SEO | 20% |
| Speed | 20% |
| UX | 15% |
| Accessibility | 10% |
| CRO | 15% |
| Technical | 10% |
| Security | 5% |
| AI Readiness | 5% |

```text
overall = round( Σ (categoryScore × weight) )
```

Category scores start at 100; deduct by severity-weighted findings:

| Severity | Deduction (cap per category) |
|----------|------------------------------|
| critical | 25 |
| high | 15 |
| medium | 8 |
| low | 3 |
| info | 0 |

### 6.2 Business impact engine (ranges, not fake precision)

Inputs: category scores, severity counts, site signals (e-commerce vs lead-gen heuristic from Phase 3).

Outputs (stored on `audit_runs.summary`):

```typescript
interface BusinessImpactSummary {
  trafficLoss: ImpactRange;      // e.g. "Moderate — est. 8–15% organic visibility risk"
  leadLoss: ImpactRange;
  conversionLoss: ImpactRange;
  revenueLeakage: ImpactRange;   // currency from geo/IP or user org setting
  growthOpportunity: ImpactRange;
}
```

**Rule:** Always present as ranges or qualitative bands until calibrated with Analytics API (future).

### 6.3 Priority matrix

`priority_score = severityWeight × categoryWeight × businessMultiplier`

Used for issue tables default sort.

---

## 7. UI architecture

### 7.1 Route map

| Route | Layout | Purpose |
|-------|--------|---------|
| `/` | `marketing` | Hero + URL input + social proof |
| `/audit/[runId]` | `app` | Live progress → results dashboard |
| `/audit/[runId]/report` | `app` | Executive summary + matrix |
| `/dashboard` | `app` + auth | Org audits list (Phase 2) |
| `/admin` | `app` + admin role | Leads, audits, exports (Phase 3) |
| `/login` | `auth` | NextAuth (Phase 2) |

### 7.2 Layout shells

- **`(marketing)`:** Dark hero, Torpedo logo, glass sticky nav, orange CTA — drives audits.
- **`(app)`:** Sidebar + top bar, dense tables, monospace metrics, Recharts — no clay cards.
- **`(auth)`:** Minimal centered panel.

### 7.3 Component hierarchy

```text
components/
├── ui/              # shadcn primitives (Button, Input, Table, Badge)
├── layout/
│   ├── AppShell.tsx
│   ├── MarketingHeader.tsx
│   └── MarketingFooter.tsx
├── audit/
│   ├── AuditUrlForm.tsx
│   ├── AuditProgress.tsx
│   ├── ScoreRing.tsx
│   ├── CategoryScoreGrid.tsx
│   ├── FindingsTable.tsx
│   ├── ImpactSummary.tsx
│   └── PriorityMatrix.tsx
└── charts/          # Recharts wrappers (Phase 2)
```

### 7.4 Design token mapping (dashboard)

| Token | Dashboard use |
|-------|----------------|
| `--bg-void` `#060606` | Page background |
| `--bg-base` `#0c0c0c` | Main canvas |
| `--bg-surface` `#141414` | Cards, panels |
| `--brand` `#ff4e00` | Primary CTA, focus, critical accents |
| `--fg-primary` | Headlines |
| `--fg-secondary` | Table secondary text |
| `font-mono` | Scores, IDs, timestamps |
| `font-display` | Section titles only |

---

## 8. API contracts

### 8.1 `POST /api/audits`

**Request:**

```json
{
  "url": "https://example.com",
  "categories": ["seo", "speed", "accessibility"],
  "options": { "mobile": true, "desktop": true }
}
```

**Response 201:**

```json
{
  "auditId": "uuid",
  "runId": "uuid",
  "status": "queued",
  "pollUrl": "/api/audits/uuid/runs/uuid"
}
```

### 8.2 `GET /api/audits/[runId]`

**Response 200:**

```json
{
  "id": "uuid",
  "status": "completed",
  "url": "https://example.com",
  "overallScore": 72,
  "scores": [{ "category": "seo", "score": 68 }],
  "impact": {
    "trafficLoss": { "label": "Moderate", "range": "8–15%" },
    "leadLoss": { "label": "Low", "range": null }
  },
  "findings": [],
  "createdAt": "ISO-8601"
}
```

### 8.3 `POST /api/leads` (Phase 2)

```json
{
  "runId": "uuid",
  "name": "string",
  "email": "string",
  "phone": "optional",
  "company": "optional"
}
```

### 8.4 Validation & limits

- Zod schemas in `src/lib/validations/`
- Rate limit: 10 audits / IP / hour (Phase 2, Upstash Ratelimit)
- URL sanitization: HTTPS only, block private IPs (SSRF guard)

---

## 9. Queue strategy

| Concern | Approach |
|---------|----------|
| Broker | Redis (Upstash in prod, local Docker in dev) |
| Library | BullMQ 5.x |
| Job payload | `{ runId: string }` only — hydrate from DB in worker |
| Idempotency | `jobId = runId` on `audit:run` |
| Stalled jobs | BullMQ stalledInterval + alert |
| Phase 1 | `lib/queue/client.ts` + mock processor stub |
| Phase 2 | `src/audit/processor.ts` + `scripts/worker.ts`; mock via `AUDIT_USE_MOCK=true` |

---

## 10. Component inventory (Phase 1 delivered)

| Component | Status Phase 1 |
|-----------|----------------|
| `AuditUrlForm` | ✅ |
| `MarketingHeader` / `MarketingFooter` | ✅ |
| `AppShell` | ✅ stub |
| `ScoreRing` | ✅ placeholder |
| `FindingsTable` | ✅ mock data |
| `ImpactSummary` | ✅ |
| `AuditProgress` | ✅ |
| `CategoryScoreGrid` | ✅ |
| `PriorityMatrix` | ✅ Phase 2 |
| `LeadCaptureForm` | ✅ Phase 2 |
| Admin tables | Phase 3 |

---

## 11. Infrastructure plan

| Layer | Service | Notes |
|-------|---------|-------|
| Web | Vercel | Next.js, edge middleware rate limit |
| DB | PostgreSQL | Drizzle ORM; local via `docker compose`; production: any Postgres host |
| Redis | Redis (local Docker / Upstash) | BullMQ |
| Storage | Local disk / S3 | Screenshots, PDFs |
| Email | Resend | Transactional reports |
| Workers | Railway or Fly.io | Playwright + Chromium, not on Vercel |
| DNS | `audit.torpedoweb.org` → Vercel | |

### 11.1 Environment variables

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tw_audit
REDIS_URL=redis://localhost:6379
NEXTAUTH_SECRET=
NEXTAUTH_URL=
RESEND_API_KEY=             # Phase 3
S3_BUCKET=                  # Phase 2
```

---

## 12. Deployment strategy

1. **Preview:** Vercel PR previews + preview Postgres (optional).
2. **Staging:** `staging.audit.torpedoweb.org` + staging Redis.
3. **Production:** Blue/green via Vercel promotions; worker deploy separate pipeline.
4. **Migrations:** `drizzle-kit migrate` in CI before deploy.

---

## 13. Scaling

| Scale target | Tactic |
|--------------|--------|
| 10k audits/mo | 2–3 worker replicas, queue concurrency 5 |
| 100k audits/mo | Shard workers by queue; read replicas for dashboard |
| Hot URLs | Cache audit result 24h by `normalized_url` + config hash |
| DB | Partition `audit_runs` by month (Phase 5) |
| Cost control | Lighthouse sampling; depth limits on crawl |

---

## 14. Security model

| Threat | Mitigation |
|--------|------------|
| SSRF on URL input | Block RFC1918, localhost, metadata IPs |
| Abuse / bots | Rate limits, Turnstile (Phase 2) |
| SQL injection | Drizzle parameterized queries |
| XSS | React default escape; sanitize report HTML |
| Auth | NextAuth + org-scoped rows |
| Secrets | Vercel env only; never commit `.env` |
| Queue poisoning | Zod job payload; worker trusts DB only |
| PII | Encrypt leads at rest (DB + app policy); retention policy |

---

## 15. Phased build plan

### Phase 0 — Blueprint ✅

This document.

### Phase 1 — Foundation (current)

- Next.js App Router + TypeScript + Tailwind
- Drizzle schema + initial migration
- Redis/BullMQ stubs
- Core models + mock audit completion
- Homepage + audit flow UI
- Auth placeholder

### Phase 2 — Real audits ✅ (implemented)

- ✅ Playwright + Lighthouse worker (`scripts/worker.ts`, `npm run worker`)
- ✅ Modular engines under `src/audit/engines/` (SEO, speed, a11y, technical, security, CRO, UX)
- ✅ BullMQ pipeline with stages: crawling → analyzing → scoring → complete
- ✅ Persist findings, category scores, overall score, business impact summary to Postgres
- ✅ Dashboard: executive summary, category grid, priority matrix, polling progress
- ✅ Lead capture `POST /api/leads` + gated lower-priority findings
- ✅ In-memory rate limit (IP + domain) on `POST /api/audits`
- ✅ Desktop screenshot stub → `storage/screenshots/{runId}/`
- ⏳ Deferred: SSE (polling only), Turnstile, Upstash ratelimit, compliance/mobile engines

### Phase 3 — Reports & delivery ✅ (implemented)

- ✅ React PDF reports (`GET /api/audits/[runId]/report`, `REPORT_STORAGE_PATH`)
- ✅ Resend email on lead unlock (`RESEND_API_KEY`, `email_logs`)
- ✅ Business impact range formatters (`src/lib/scoring/format-impact.ts`)
- ⏳ Admin dashboard + export
- ⏳ Rate limiting + Turnstile

### Phase 4 — Scale & monetization

- Org billing, audit quotas
- Cached re-runs, API keys
- Advanced CRO/AI engines
- Observability (Sentry, Axiom)

### Phase 5 — Enterprise

- Multi-tenant SSO
- White-label PDF
- Dedicated workers
- SLA dashboards

---

## 16. Observability (Phase 2+)

- Structured logs: `pino` with `runId` correlation
- Metrics: queue depth, job duration histogram, audit success rate
- Alerts: failed job rate > 5%, queue lag > 10 min

---

## 17. Local development

```bash
cp .env.example .env.local    # set DATABASE_URL + REDIS_URL (defaults match docker-compose)
npm run db:up                 # postgres:16 + redis:7 on localhost
npm install
npm run db:push               # apply Drizzle schema to local Postgres
npm run dev                   # http://localhost:3000
npm run worker                # BullMQ consumer (Playwright + Lighthouse)
```

No Supabase or other BaaS is required. Use any Postgres instance by setting `DATABASE_URL`.

---

## 18. Decisions log

| Decision | Rationale |
|----------|-----------|
| Single app vs monorepo now | Faster Phase 1; extract later |
| Drizzle over Prisma | Specified in AudittoolPlan |
| Local PostgreSQL + Drizzle | No BaaS; `docker compose` for dev; `postgres` driver + Drizzle in app |
| Dark default theme | User requirement for SaaS UI |
| Mock audit in Phase 1 | Unblocks UI/DB/API contract without Playwright infra |
| `organization_id` on audits | Future multi-tenant without migration pain |

---

## 19. Open questions for product owner

1. Default currency for revenue ranges (USD vs INR vs geo-detect)?
2. Free audit limits per domain per day?
3. Production Postgres host (RDS, Neon, self-hosted, etc.)?
4. Worker hosting preference (Railway vs Fly vs AWS)?

---

*End of blueprint — implementation tracked in repo `src/` and git history.*
