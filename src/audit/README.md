# Audit engines

Phase 2 engines under `engines/`:

| Engine | File | Tooling |
|--------|------|---------|
| SEO | `seo.ts` | Playwright DOM |
| Speed | `speed.ts` | Lighthouse |
| Accessibility | `accessibility.ts` | @axe-core/playwright |
| Technical | `technical.ts` | Headers + DOM |
| UX | `ux.ts` | DOM heuristics |
| CRO | `cro.ts` | DOM heuristics |
| Security | `security.ts` | Headers + mixed content |
| AI readiness | `ai-readiness.ts` | JSON-LD, llms.txt HEAD |

Orchestration: `orchestrator.ts` · Pipeline: `processor.ts` · Worker: `npm run worker`
