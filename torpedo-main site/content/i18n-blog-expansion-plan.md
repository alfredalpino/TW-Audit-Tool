# International Blog Expansion Plan — Torpedo Web Phase 2

**Agent:** International Blog Expansion (Agent 5)  
**Date:** 2026-05-29  
**Scope:** Architecture + localization strategy for overlay locales; no bulk content generation.

---

## 1. Current Infrastructure Summary

| Layer | Path | Role |
|---|---|---|
| Blog loader | `lib/blog.ts` | Reads `public/blogs/*.md` (135 posts), gray-matter frontmatter |
| Localized loader | `lib/blog-localized.ts` | Overlay locales merge native posts + English fallback with metadata overlays |
| Blog metadata | `lib/i18n/blog-metadata.ts` | Index/post SEO copy per locale; metadata-only overlays |
| US routes | `app/(marketing)/blog/` | Default en-US; overlay locales rewrite here via middleware |
| India routes | `app/(marketing)/en-in/blog/` | Dedicated en-IN content tree |
| Native content | `content/localized-blogs/{locale}/` | Full native rewrites (premium templates) |
| i18n config | `lib/i18n/config.ts` | 10 locales; overlay vs content locale split in `detection.ts` |

**Overlay locales** (UI rewrite, blog metadata localized): `fr-FR`, `fr-MA`, `fr-CH`, `es-MX`, `de-CH`, `tr-TR`, `ru-RU`, `ar-AE`  
**Content locales** (dedicated routes): `en-US`, `en-IN`

---

## 2. Top 20 Blog Posts by SEO Value (India / US Focus)

Scored on: commercial intent, branded/service alignment, geographic relevance, conversion proximity, keyword defensibility.

| Rank | Slug | Primary Keyword | Market | Intent |
|---|---|---|---|---|
| 1 | `seo-agency-lucknow-pricing-guide-what-to-pay` | seo agency lucknow pricing guide | IN | Transactional |
| 2 | `best-seo-agency-in-lucknow-what-to-ask-before-hiring` | best seo agency in lucknow | IN | Transactional |
| 3 | `google-ads-agency-lucknow-smbs-what-actually-works` | google ads agency lucknow | IN | Transactional |
| 4 | `performance-marketing-agency-uttar-pradesh-growth-audit` | performance marketing agency uttar pradesh | IN | Transactional |
| 5 | `custom-website-vs-template-for-lead-generation-india` | custom website vs template lead generation | IN/US | Commercial |
| 6 | `local-seo-audit-lucknow-checklist-that-finds-revenue-gaps` | local seo audit lucknow | IN | Commercial |
| 7 | `website-redesign-for-lead-generation-up-operational-guide` | website redesign lead generation up | IN | Commercial |
| 8 | `conversion-rate-optimization-checklist-website-lead-gen` | CRO checklist website lead gen | IN/US | Commercial |
| 9 | `why-website-not-ranking-india-fix-founder-playbook` | why website not ranking india | IN | Problem-aware |
| 10 | `google-ads-vs-meta-ads-local-smb-india-decision-guide` | google ads vs meta ads local smb | IN | Commercial |
| 11 | `agency-selection-checklist-for-founders-no-fluff` | agency selection checklist founders | US/IN | Commercial |
| 12 | `technical-seo-checklist-india-2026-priority-fixes` | technical seo checklist india 2026 | IN | Commercial |
| 13 | `website-conversion-tracking-implementation-guide-ga4-gtm` | conversion tracking GA4 GTM | US/IN | Commercial |
| 14 | `seo-and-ppc-synergy-for-local-lead-generation-system` | seo ppc synergy local leads | IN/US | Commercial |
| 15 | `ui-ux-design-agency-lucknow-conversion-playbook` | ui ux design agency lucknow | IN | Transactional |
| 16 | `mbbs-abroad-consultant-lucknow-how-to-choose` | mbbs abroad consultant lucknow | IN | Transactional |
| 17 | `mbbs-abroad-fees-breakdown-indian-families-2026-guide` | mbbs abroad fees breakdown | IN | Commercial |
| 18 | `whatsapp-marketing-funnel-india-lead-to-sale-system` | whatsapp marketing funnel india | IN | Commercial |
| 19 | `nextjs-seo-architecture-for-service-websites-2026` | nextjs seo architecture service websites | US/IN | Thought leadership |
| 20 | `page-speed-fixes-that-improve-lead-conversion-checklist` | page speed fixes lead conversion | US/IN | Commercial |

---

## 3. Localization Strategy

### Tier A — Full Native Rewrite (priority)

Universal commercial playbooks adapted to local market examples, pricing, regulations, and search behavior.

| Source post (EN) | Target markets | Rationale |
|---|---|---|
| Agency pricing guides | FR, MX, DE, TR, RU, AE, SA | High CPC, strong purchase intent |
| Custom vs template | FR, MX, DE, TR | Core service decision content |
| Agency selection checklist | All overlay locales | Trust-building, low geo specificity |
| CRO / conversion tracking | FR, MX, DE, AE | Universal ops, local case studies |
| Google vs Meta ads decision | MX, TR, AE | Paid media demand markets |

### Tier B — Metadata + Intro Localization (English body fallback)

Technical/evergreen posts where body translation is lower ROI initially.

- `nextjs-seo-architecture-for-service-websites-2026`
- `website-conversion-tracking-implementation-guide-ga4-gtm`
- `technical-seo-checklist-india-2026-priority-fixes` → retitle for market
- `page-speed-fixes-that-improve-lead-conversion-checklist`
- `agency-scorecard-for-monthly-performance-review`

Implementation: `BLOG_POST_META_OVERLAYS` in `lib/i18n/blog-metadata.ts` until full rewrite ships.

### Tier C — UI-Only / No Localization (India-specific)

Keep on `/en-in/blog` only; exclude from overlay locale sitemap emphasis.

- All Lucknow/UP/Kanpur city posts
- MBBS abroad vertical (India-only counseling)
- India city SEO rollouts (`delhi-ncr-*`, `mumbai-*`, `chennai-*`, etc.)
- UP clinic/local citation hyperlocal content

### Tier D — New Market-Native Content (net-new slugs)

Create under `content/localized-blogs/{locale}/` with `localeOnly: true`. Do not mirror English slugs unless `sourceSlug` documents lineage.

---

## 4. New Blog Topic Opportunities (10 per Market)

High-intent topics with competitor gap analysis. Gaps = weak local agency content, thin pricing guides, or US/India-centric results dominating SERPs.

### France (`fr-FR`)

| # | Topic | Primary keyword (FR) | Gap |
|---|---|---|---|
| 1 | Tarifs agence SEO Paris 2026 | agence seo paris tarifs | ✅ Sample published |
| 2 | Site sur mesure vs WordPress pour leads B2B | site sur mesure vs wordpress leads | Generic WP content, no ops framing |
| 3 | SEO local Google Business Profile Île-de-France | optimisation fiche google paris | GBP guides lack conversion focus |
| 4 | RGPD et tracking conversion : guide fondateur | rgpd tracking conversion site web | Legal guides miss marketing ops |
| 5 | Refonte site sans perdre le SEO : checklist PME | refonte site web sans perdre seo | Dev agencies skip migration QA |
| 6 | Agence Google Ads vs Meta Ads PME France | google ads vs meta ads pme france | Platform blogs dominate |
| 7 | Core Web Vitals et conversion : audit pratique | core web vitals conversion audit | Technical, not revenue-linked |
| 8 | Choix agence web Paris : 12 questions | choisir agence web paris | Listicles lack scoring framework |
| 9 | SEO technique Next.js pour sites services | seo nextjs site vitrine | Dev content, not buyer intent |
| 10 | Marketing automation PME : stack minimal viable | marketing automation pme france | SaaS vendors own SERP |

### Mexico (`es-MX`)

| # | Topic | Primary keyword (ES-MX) | Gap |
|---|---|---|---|
| 1 | Precios agencia SEO CDMX 2026 | agencia seo cdmx precios | ✅ Sample published |
| 2 | Sitio personalizado vs plantilla para leads | sitio web personalizado vs plantilla | Template vendors dominate |
| 3 | SEO local negocio Guadalajara / Monterrey | seo local guadalajara negocios | Thin city playbooks |
| 4 | Google Ads vs Meta Ads PYMES México | google ads vs meta ads pymes mexico | No operator decision framework |
| 5 | WhatsApp Business API embudo ventas | whatsapp business api embudo ventas | Tool docs, not funnel design |
| 6 | Auditoría SEO técnica checklist 2026 | auditoria seo tecnica mexico | Generic international lists |
| 7 | Landing pages conversión servicios profesionales | landing page conversion servicios | Design-focused, not CRO ops |
| 8 | Tracking conversiones GA4 ecommerce servicios | tracking conversiones ga4 mexico | Retail-heavy content |
| 9 | Agencia performance marketing CDMX : señales alerta | agencia marketing performance cdmx | No red-flag framework |
| 10 | Presupuesto marketing trimestral PYMES | presupuesto marketing trimestral pyme | Academic, not operator templates |

### Germany (`de-DE` / `de-CH` scaffold)

| # | Topic | Primary keyword (DE) | Gap |
|---|---|---|---|
| 1 | SEO Agentur Kosten München/Berlin 2026 | seo agentur kosten münchen | Price transparency weak |
| 2 | Custom Website vs Template B2B Leads | website individuell vs template leads | US/EN results in SERP |
| 3 | DSGVO-konformes Conversion-Tracking | dsgvo conversion tracking website | Legal-only content |
| 4 | Local SEO Google Unternehmensprofil | google unternehmensprofil optimierung | Checklist without CRO |
| 5 | Website Relaunch ohne SEO-Verlust | website relaunch seo checklist | Agency sales pages only |
| 6 | Google Ads vs Meta Ads KMU Entscheidung | google ads vs meta ads kmu | Platform comparison blogs |
| 7 | Core Web Vitals Conversion Impact | core web vitals conversion | Developer-focused |
| 8 | Agentur Auswahl Checkliste Gründer | agentur auswahl checkliste | Generic startup content |
| 9 | Next.js SEO Architektur Dienstleister | nextjs seo architektur | English dev docs rank |
| 10 | Marketing Budget Quartalsplanung KMU | marketing budget planung kmu | Finance angle, not ops |

### Turkey (`tr-TR`)

| # | Topic | Primary keyword (TR) | Gap |
|---|---|---|---|
| 1 | SEO ajansı fiyatları İstanbul 2026 | seo ajansı fiyatları istanbul | Opaque pricing |
| 2 | Özel web sitesi vs şablon lead üretimi | özel web sitesi vs şablon | Template market heavy |
| 3 | Google İşletme Profili optimizasyonu | google işletme profili optimizasyonu | Basic how-tos only |
| 4 | Google Ads vs Meta Ads KOBİ karşılaştırma | google ads vs meta ads kobi | No decision framework |
| 5 | KVKK uyumlu dönüşüm takibi | kvkk dönüşüm takibi | Legal, not marketing ops |
| 6 | Web sitesi yenileme SEO kaybı önleme | web sitesi yenileme seo | Thin migration guides |
| 7 | Dönüşüm oranı optimizasyon checklist | dönüşüm oranı optimizasyonu | E-commerce focused SERP |
| 8 | Ajans seçimi kontrol listesi | dijital ajans seçimi | Listicles without scoring |
| 9 | WhatsApp pazarlama hunisi Türkiye | whatsapp pazarlama hunisi | Tool vendors dominate |
| 10 | Performans pazarlama ajansı değerlendirme | performans pazarlama ajansı | No audit rubric |

### Russia (`ru-RU`)

| # | Topic | Primary keyword (RU) | Gap |
|---|---|---|---|
| 1 | Стоимость SEO агентства Москва 2026 | стоимость seo агентства москва | Price opacity |
| 2 | Индивидуальный сайт vs шаблон для лидов | сайт на заказ vs шаблон лиды | Template sellers rank |
| 3 | Локальное SEO Яндекс/Google для бизнеса | локальное seo для бизнеса | Platform basics only |
| 4 | Google Ads vs таргет VK/Meta для МСБ | google ads vs таргет малый бизнес | No unified framework |
| 5 | GDPR/152-FZ и tracking конверсий | tracking конверсий сайт 152 fz | Legal fragmentation |
| 6 | Редизайн сайта без потери SEO | редизайн сайта seo checklist | Thin content |
| 7 | CRO checklist для B2B услуг | cro checklist b2b | E-commerce SERP |
| 8 | Как выбрать digital агентство | как выбрать digital агентство | Generic advice |
| 9 | Next.js SEO для сервисных сайтов | nextjs seo архитектура | English technical docs |
| 10 | Маркетинг бюджет квартал SMB | маркетинг бюджет план smb | Not operator-focused |

### UAE (`ar-AE`)

| # | Topic | Primary keyword (AR/EN) | Gap |
|---|---|---|---|
| 1 | SEO agency pricing Dubai 2026 | seo agency dubai pricing | Premium market, thin guides |
| 2 | Custom website vs template free zone business | custom website vs template uae | Free zone focus missing |
| 3 | Google Business Profile Dubai local SEO | google business profile dubai seo | Listing basics only |
| 4 | Google Ads vs Meta Ads UAE SMB | google ads vs meta ads uae | Platform blogs |
| 5 | Arabic/English bilingual SEO architecture | bilingual seo website uae | Technical gap |
| 6 | Conversion tracking GA4 UAE compliance | ga4 conversion tracking uae | Generic GA4 content |
| 7 | Website speed mobile UAE 5G optimization | website speed optimization uae | CDN vendor content |
| 8 | Agency selection checklist Dubai founders | choose digital agency dubai | Lifestyle blogs rank |
| 9 | WhatsApp Business funnel UAE services | whatsapp business funnel uae | Tool documentation |
| 10 | Performance marketing audit framework UAE | performance marketing audit uae | No operator rubric |

### Saudi Arabia (`ar-SA` — scaffold via en-US + ar overlay future)

| # | Topic | Primary keyword | Gap |
|---|---|---|---|
| 1 | SEO agency pricing Riyadh/Jeddah 2026 | seo agency riyadh pricing | Emerging market, EN-only SERP |
| 2 | Vision 2030 digital presence for SMBs | digital transformation smb saudi | Policy content, not ops |
| 3 | Arabic RTL website conversion best practices | rtl website conversion arabic | Dev-focused |
| 4 | Google Ads vs Snapchat/TikTok KSA | google ads vs snapchat ads saudi | No SMB framework |
| 5 | PDPL-compliant marketing analytics | pdpl marketing analytics saudi | Legal-only |
| 6 | E-commerce vs lead-gen website architecture KSA | lead generation website saudi | Retail-heavy |
| 7 | Local SEO Google Maps Saudi cities | local seo saudi arabia business | Thin |
| 8 | Agency onboarding checklist founders KSA | digital agency onboarding saudi | Missing |
| 9 | WhatsApp commerce funnel Saudi services | whatsapp marketing saudi arabia | Generic |
| 10 | Marketing budget planning Q1–Q4 KSA SMB | marketing budget saudi smb | Not operator templates |

---

## 5. Metadata Templates per Locale

### Blog Index (`buildBlogIndexMetadata`)

```typescript
// Pattern in lib/i18n/blog-metadata.ts
{
  title: '{Blog|Blog|Blog|Блог|المدونة}',
  description: '{Market-specific value prop + Torpedo Web}',
  openGraph: {
    title: 'Blog | TORPEDO WEB',
    description: '{same as description}',
    url: '{prefix}/blog',  // e.g. /fr/blog, /es-mx/blog
    locale: '{og locale}', // fr_FR, es_MX, etc.
  },
  alternates: buildLanguageAlternates('/blog', canonicalLocale),
}
```

### Blog Post (`buildBlogPostMetadata`)

```typescript
{
  title: '{Localized H1 or overlay title}',
  description: '{Localized excerpt ≤160 chars}',
  openGraph: {
    title: '{title} | {TORPEDO WEB | Torpedo Web India}',
    description: '{excerpt}',
    url: '{prefix}/blog/{slug}',
    locale: '{og locale}',
  },
  alternates: buildLanguageAlternates('/blog/{slug}', canonicalLocale),
}
```

### JSON-LD (Article + Breadcrumb)

- `buildBreadcrumb`: Home → `{breadcrumbBlog}` → `{post.title}`
- `buildArticle`: `headline`, `description`, `url`, `datePublished`, `dateModified`
- List schema on index: `{schemaListName}` + absolute URLs per locale prefix

### Frontmatter Template (Native Posts)

```yaml
---
title: ""
excerpt: ""
date: "YYYY-MM-DD"
published_at: "ISO8601"
primary_keyword: ""
secondary_keywords: []
locale: "fr-FR"          # target locale code
localeOnly: true          # exclude English slug collision
sourceSlug: "english-slug-if-adapted"  # optional lineage
---
```

---

## 6. Implementation Status (Phase 2)

| Deliverable | Status |
|---|---|
| `lib/i18n/blog-metadata.ts` | ✅ Done |
| `lib/blog-localized.ts` | ✅ Done |
| Locale-aware blog index metadata | ✅ Done |
| Locale-aware post metadata + fallback | ✅ Done |
| Sample FR posts (2) | ✅ Done |
| Sample ES-MX post (1) | ✅ Done |
| Metadata overlays (FR, ES-MX) | ✅ Starter set |
| `ar-SA` locale code | ⏳ Future — use en-US + AE overlay until added |
| `de-DE` locale | ⏳ Use de-CH folder scaffold; add de-DE when locale ships |
| Sitemap localized slug entries | ⏳ Next — extend sitemap for native slugs per locale |

---

## 7. Sample Article Slugs (Premium Templates)

| Locale | Slug | URL |
|---|---|---|
| fr-FR | `agence-seo-paris-tarifs-guide-2026` | `/fr/blog/agence-seo-paris-tarifs-guide-2026` |
| fr-FR | `site-web-sur-mesure-vs-template-generation-leads` | `/fr/blog/site-web-sur-mesure-vs-template-generation-leads` |
| es-MX | `agencia-seo-cdmx-guia-precios-2026` | `/es-mx/blog/agencia-seo-cdmx-guia-precios-2026` |

---

## 8. Rollout Cadence (Editorial)

- **Phase 2a (now):** Architecture + 3 premium templates + metadata overlays
- **Phase 2b:** 5 native posts per overlay locale (Tier A topics)
- **Phase 2c:** Metadata overlays for Tier B evergreen posts
- **Phase 2d:** Sitemap + Search Console hreflang validation per `docs/seo-i18n-validation.md`

Do **not** bulk-generate 100+ posts in this phase. Use batch orchestrator for Case C India content separately.

---

## 9. File Reference

```
lib/blog.ts                          # English source of truth
lib/blog-localized.ts                # Overlay merge + fallback
lib/i18n/blog-metadata.ts            # SEO copy + overlays
content/localized-blogs/fr/*.md      # French native posts
content/localized-blogs/es-MX/*.md   # Mexican Spanish native posts
app/(marketing)/blog/page.tsx        # Locale-aware index (US + overlays)
app/(marketing)/en-in/blog/page.tsx  # India index
```
