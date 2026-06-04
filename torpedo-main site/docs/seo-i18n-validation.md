# SEO i18n validation report

Generated as part of the Torpedo Web multilingual rollout.

## hreflang coverage

| Check | Status |
|-------|--------|
| All 10 locales in `lib/i18n/config.ts` | Pass |
| `buildLanguageAlternates()` emits BCP-47 keys + `x-default` | Pass |
| Canonical points to active locale path | Pass |
| `en-US` / `en-IN` backward-compatible aliases (`usPath`, `indiaPath`) | Pass |

## Sitemap

| Check | Status |
|-------|--------|
| Static marketing routes discovered from `app/(marketing)` | Pass |
| `alternates.languages` on globally localized routes | Pass |
| India-only routes (`/en-in/local`, `/en-in/best`, city pages) excluded from global alternates | Pass |
| Blog + service pages include US + overlay locale URLs | Pass |

## Structured data

| Check | Status |
|-------|--------|
| `buildWebSite()` supports optional `locale` for `inLanguage` | Pass |
| FAQ / Service / Article builders accept `locale` | Pass |
| Default (no locale) lists all configured languages | Pass |

## Crawler safety

| Check | Status |
|-------|--------|
| Search bots skip geo redirects (`proxy.ts`) | Pass |
| Lighthouse / PSI audit bots skip geo redirects | Pass |
| UI-overlay locales use **rewrite** (not redirect) for same content tree | Pass |
| No duplicate canonical for overlay locales (distinct prefixed URLs) | Pass |

## Manual verification checklist

1. Open `/` → view source → confirm `<link rel="alternate" hreflang="...">` for each locale.
2. Visit `/fr/services` → confirm 200, French chrome, English body (until page translations ship).
3. Google Search Console → inspect URL → validate hreflang return links.
4. Run `npm run i18n:validate` before each locale message change.

## Known follow-ups

- Full page copy translation for `es-MX`, `fr-FR`, etc. (UI chrome is translated; body uses en-US source via rewrite).
- Arabic RTL layout polish for `ar-AE` when Arabic content ships.
- Migrate to `app/[locale]/(marketing)` dynamic segment when duplicating en-IN-style content for additional markets.
