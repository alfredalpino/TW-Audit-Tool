---
name: torpedo-web-design
description: Applies Torpedo Web 2.0 clay/keycap skeuomorphism and exact CSS tokens so marketing UI matches torpedoweb.org. Use when building or restyling marketing pages, landing sections, components, modals, footers, heroes, FAQs, service grids, blog UI, brand guardrails, DESIGN-GUIDE, clay buttons, warm cream/dark themes, or Torpedo orange CTAs.
---

# Torpedo Web Design System (Theme Applier)

You are implementing **TorpedoWeb 2.0** — warm luxury surfaces, **PBT keycap** clay controls, Syne headlines. Output must match **https://torpedoweb.org**, not generic Tailwind.

## Step 0 — Load canonical spec

Before writing UI code, read **`docs/DESIGN-GUIDE.md`** (v2.1). For class-string copy-paste templates, use **`docs/DESIGN-GUIDE.md` §8–§9** and grep existing components. Tokens live in **`app/globals.css`**.

Project rule (when editing marketing files): `.cursor/rules/torpedo-design-system.mdc`.

---

## Non‑negotiable rules

| Area | Requirement |
|------|-------------|
| Colors | `var(--brand)` `#ff4e00`, `var(--bg-base\|void\|surface)`, `var(--fg-primary\|secondary\|tertiary)`, `var(--border)` — **never** `bg-white`, `text-gray-*`, `border-gray-*`, flat `bg-orange-*` |
| Legacy hex | `#FF5500` / `text-torpedo-orange` only in email or old files — **not** new marketing JSX |
| Buttons | `@/components/ui/Button` → `tw-clay-btn-*` (`brand`, `secondary`, `surface`, `nav`, `light-brand`, `light-secondary`, `ghost`) |
| Cards | `@/components/ui/ClayCard` with `hover` + optional `var(--gradient-card)` overlay on group-hover |
| Layout | `ClientLayout` → `<main id="main-content" className="… bg-[var(--bg-base)] text-[var(--fg-primary)]">` |
| Sections | `border-t border-[var(--border)]` bands + inner `tw-section`; alternate `base` / `surface` / `void` (see guide §8.1) |
| Type | `font-display` (Syne) headlines, `font-sans` (DM Sans) body, `font-mono` (JetBrains) labels |
| Eyebrows | `[ BRACKETED CAPS ]` + `useTextScramble(text, 900, true, 3000)` or `ServicesEyebrowScramble` |
| Motion | `sectionVariants` / `cardVariants` from `@/lib/animations`, `viewport={{ once: true, margin: '-10% 0px' }}` |
| Skeuo | Grain (`--surface-noise`), inset bevel shadows, hover `translateY(-1px)`, active `+1px` — do not flatten |
| Nav/Footer | Reuse `Navbar` / `Footer` — do not rebuild |

---

## Workflows

### A. New marketing page

1. Create `app/(marketing)/…/page.tsx` under existing `(marketing)/layout.tsx` (gets `ClientLayout`).
2. Wrap content:

```tsx
<main id="main-content" className="flex min-h-screen w-full flex-col bg-[var(--bg-base)] text-[var(--fg-primary)]">
```

3. **Inner-page hero** (services-style):

```tsx
<section className="border-b border-[var(--border)] bg-[var(--bg-void)] py-14 md:py-20">
  <div className="tw-section">
    <ServicesEyebrowScramble text="[ CATEGORY ]" />
    <h1 className="tw-heading-section tw-prose-flow mt-4 font-display font-extrabold tracking-tight text-[var(--fg-primary)]">Title</h1>
    <p className="tw-prose-flow mt-6 max-w-3xl text-base leading-[1.6] text-[var(--fg-secondary)] md:text-lg">Lead</p>
  </div>
</section>
```

4. Add 1+ content bands: `border-t` + `py-[var(--section-py)] md:py-[var(--section-py-lg)]` (homepage) or `py-14 md:py-20` (inner).
5. End with **final CTA** band: `bg-[var(--bg-void)]`, `<Button variant="brand" size="lg" withArrow />`.
6. Grep a similar page (`ServicesIndexView`, `WhatWeBuild`, `FinalHomeCTA`) and mirror structure before inventing classes.

### B. Homepage-quality section

```tsx
'use client';
import { motion } from 'framer-motion';
import { sectionVariants } from '@/lib/animations';
import { useTextScramble } from '@/hooks/useTextScramble';

const eyebrow = useTextScramble('[ SECTION LABEL ]', 900, true, 3000);

<section className="border-t border-[var(--border)] bg-[var(--bg-base)] py-[var(--section-py)] md:py-[var(--section-py-lg)]" aria-labelledby="…">
  <motion.div className="tw-section" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-10% 0px' }} variants={sectionVariants}>
    <p className="tw-prose-flow mb-4 max-w-full font-display text-[clamp(0.756rem,2vw,0.98rem)] font-bold uppercase leading-snug tracking-[0.2em] text-[var(--brand)] sm:text-[clamp(0.81rem,1.6vw,1.02rem)]">{eyebrow}</p>
    <h2 className="tw-heading-section tw-prose-flow font-display font-bold tracking-tight text-[var(--fg-primary)]">…</h2>
  </motion.div>
</section>
```

Swap `bg-[var(--bg-base)]` for `surface` or `void` per alternation table in DESIGN-GUIDE §8.1.

### C. Clay feature card

```tsx
<ClayCard as="article" hover className="group relative overflow-hidden p-5 sm:p-6 md:p-8">
  <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'var(--gradient-card)' }} aria-hidden />
  <span className="pointer-events-none absolute -right-2 -top-6 font-display text-[length:5rem] font-extrabold text-[var(--fg-primary)] opacity-[0.05] group-hover:opacity-[0.08]" aria-hidden">01</span>
  <div className="relative z-[1]">…</div>
</ClayCard>
```

Reference: `components/home/WhatWeBuild.tsx`, `components/services/ServiceGridCard.tsx`.

### D. Homepage hero only

Use `components/home/HomeHero.tsx` pattern (`bg-[var(--bg-void)]`, `HomeHeroDecor`, `tw-hero-h1`, `Button variant="brand"`). Do **not** copy legacy `components/Hero.tsx` (`text-torpedo-orange`).

---

## Component decision tree

```
CTA → Button variant="brand" | "secondary" | "nav" | "light-*"
Container → ClayCard (hover) | tw-clay-panel
Form field → tw-clay-input
Hero → HomeHero (full) | ServicesIndexView header (inner)
Eyebrow → useTextScramble | ServicesEyebrowScramble | MonoBracketEyebrowScramble (footer)
```

---

## Pre‑flight checklist (run before finishing)

- [ ] Read `docs/DESIGN-GUIDE.md` §0 self-validation
- [ ] No gray Tailwind on marketing surfaces
- [ ] All CTAs use `Button` clay variants
- [ ] Section backgrounds alternate (not three identical bands in a row)
- [ ] `font-display` on H1/H2; eyebrows bracketed + scramble where peers do
- [ ] Focus: `outline` / `ring-[var(--brand)]`
- [ ] Touch targets ≥ 44px on primary controls
- [ ] `prefers-reduced-motion`: no essential info in hover-only motion
- [ ] Compared visually to `components/home/*` or `ServicesIndexView`

---

## Do not copy (legacy / admin)

- `components/Hero.tsx` — old torpedo-* colors
- `components/ui/Section.tsx` — prefer `tw-section` bands for new work
- CRM / `border-gray-200 bg-white` admin UI
- Flat `shadow-md` buttons without `tw-clay-btn`

---

## Canonical file map

| Need | Path |
|------|------|
| Full guardrail | `docs/DESIGN-GUIDE.md` |
| Tokens + clay CSS | `app/globals.css` |
| Button | `components/ui/Button.tsx` |
| Card | `components/ui/ClayCard.tsx` |
| Animations | `lib/animations.ts` |
| Scramble | `hooks/useTextScramble.ts` |
| Shell | `components/ClientLayout.tsx` |
| Homepage | `components/home/*` |
| Services index | `components/services/ServicesIndexView.tsx` |

---

## User prompt shorthand

When the user says “apply Torpedo design” or attaches this skill:

> Match torpedoweb.org exactly per docs/DESIGN-GUIDE.md v2.1 — clay keycaps, warm tokens, tw-section bands, no gray Tailwind.

For deeper templates and z-index/motion tables, open **`docs/DESIGN-GUIDE.md`** — do not improvise a parallel design system.
