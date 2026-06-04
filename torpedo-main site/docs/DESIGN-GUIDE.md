# Torpedo Web — Universal Design & Brand Guardrail

**Version:** 2.1 (TorpedoWeb 2.0 — Cursor theme applier)  
**Status:** Canonical — all marketing pages, new routes, and UI extensions must match **torpedoweb.org** exactly.  
**Source of truth in code:** `app/globals.css`, `lib/brand-tokens.ts`, `tailwind.config.ts`, `components/ui/Button.tsx`, `components/ui/ClayCard.tsx`  
**Live reference:** https://torpedoweb.org (warm light default, clay keycaps, Syne headlines)  
**Cursor skill:** `.cursor/skills/torpedo-web-design/SKILL.md` (invoke as `torpedo-web-design` for theme-applier workflows)

---

## 0. Cursor / AI agent mandate (read first)

When this file is attached to a task, you are a **theme applier**, not a generic UI generator. Output must be indistinguishable from the existing marketing site.

### 0.1 Non‑negotiable rules

1. **Never** use Tailwind neutrals on marketing UI: no `bg-white`, `bg-gray-*`, `text-gray-*`, `border-gray-*`, `shadow-md`, `rounded-lg` on buttons without clay classes.
2. **Always** use CSS variables: `var(--brand)`, `var(--bg-base)`, `var(--fg-primary)`, `var(--border)`, etc.
3. **Always** use existing components before creating markup:
   - `Button` from `@/components/ui/Button`
   - `ClayCard` from `@/components/ui/ClayCard`
   - `Navbar` / `Footer` via `ClientLayout` (do not rebuild nav/footer)
4. **Always** wrap marketing routes in the same shell as production:

```tsx
// app/(marketing)/your-page/page.tsx
export default function Page() {
  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col bg-[var(--bg-base)] text-[var(--fg-primary)]">
      {/* sections below */}
    </main>
  );
}
```

Layout chain: `app/(marketing)/layout.tsx` → `ClientLayout` → `Navbar` + `pt-[var(--nav-h)]` + children + `Footer`.

5. **Import** `@/app/globals.css` only via root layout (already done). Do not duplicate tokens in inline styles except `var(--gradient-card)` overlays.
6. **Skeuomorphism is mandatory** for buttons, cards, footer, inputs, and icon controls — use `.tw-clay-*` classes, not flat fills.
7. **Eyebrows** on homepage-style sections: bracketed uppercase + `useTextScramble(text, 900, true, 3000)` or `ServicesEyebrowScramble` / `MonoBracketEyebrowScramble`.
8. **Motion**: Framer `sectionVariants` / `cardVariants` from `@/lib/animations` with `viewport={{ once: true, margin: '-10% 0px' }}`.
9. If unsure between two styles, **grep the repo** for an existing section and copy its class string verbatim.

### 0.2 Self‑validation before finishing

- [ ] Every background is `--bg-base`, `--bg-void`, or `--bg-surface` (not white)
- [ ] Every section has `border-t border-[var(--border)]` unless it is the first hero with `border-b` only
- [ ] Primary CTA uses `<Button variant="brand" />` with `withArrow` where appropriate
- [ ] Cards use `<ClayCard hover />` with watermark number + `var(--gradient-card)` hover overlay
- [ ] Headlines use `font-display`; body uses `font-sans`; labels use `font-mono`
- [ ] Focus rings use `var(--brand)`
- [ ] No new hex colors introduced

---

## 1. Purpose

This guide is the **single brand guardrail** for Torpedo Web. It defines exact colors, typography, spacing, motion, and **skeuomorphic (“clay / keycap”)** treatment so every page feels like the same product—not a flat Tailwind template.

**Use this when:**

- Building a new marketing page (services, plans, portfolio, local SEO, agency, systems, etc.)
- Extending blog, contact, or programmatic templates
- Reviewing PRs for visual consistency
- Briefing designers or contractors

**Do not invent parallel palettes.** If a token exists below, use it. If something is missing, add it to `globals.css` first, then document it here.

---

## 2. Brand identity (non-visual)

| Attribute | Direction |
|-----------|-----------|
| Positioning | High-performance digital engineering & growth infrastructure |
| Visual mood | Warm luxury light (default), optional deep dark; **tactile**, not glossy corporate |
| Metaphor | **Mechanical keyboard keycaps** — beveled rims, PBT grain, press travel, recessed wells |
| Texture | Paper/linen grain on void areas; matte over gloss |
| Accent | Torpedo orange — energy, precision, CTAs |

Copy tone (UI): direct, confident, minimal fluff. Eyebrows are uppercase, bracketed or mono-labeled where appropriate.

---

## 3. Color system (exact values)

### 3.1 Primary web UI (always prefer CSS variables)

These drive the live site via `data-theme` on `<html>`. **Never hardcode random oranges** on marketing UI.

| Token | Hex / value | Role |
|-------|-------------|------|
| `--brand` | `#ff4e00` | Primary accent, CTAs, selection, focus rings |
| `--brand-hover` | `#ff6b2b` | Hover text (ghost buttons), secondary emphasis |
| `--brand-fg` | `#060606` | Text on brand/orange surfaces |
| `--brand-glow` | light: `rgba(255, 78, 0, 0.1)` · dark: `rgba(255, 78, 0, 0.15)` | Radial hero/manifesto glow |

**Brand button gradient (both themes):**

```css
linear-gradient(168deg, #e05a1a 0%, #c94800 22%, #b03c00 55%, #943200 100%)
```

**Brand borders:**

- `--clay-border-brand`: `1px solid rgba(170, 62, 14, 0.48)`
- `--clay-border-brand-dark`: `rgba(72, 20, 0, 0.62)` (bottom edge)

**Chat header gradient (shared):**

```css
linear-gradient(168deg, #e86828 0%, #d04a08 38%, #b83c00 100%)
```

### 3.2 Legacy / email / OG constants (`lib/brand-tokens.ts`)

Used in **HTML email**, some Tailwind `torpedo-*` utilities, and older references. Do **not** mix these into new marketing components when a CSS variable exists.

| Name | Hex | Use |
|------|-----|-----|
| `BRAND_TOKENS.orange` | `#FF5500` | Email templates, `text-torpedo-orange` |
| `BRAND_TOKENS.orangeDark` | `#C44A00` | Email secondary |
| `BRAND_TOKENS.dark` | `#0A0A0B` | Email background |
| `BRAND_TOKENS.gray` | `#888888` | Email muted |
| `BRAND_TOKENS.light` | `#F5F5F7` | Email panels |

**Rule:** Marketing pages → `var(--brand)` and `text-[var(--fg-primary)]`. Email only → `BRAND_TOKENS`.

### 3.3 Light theme backgrounds (default)

| Token | Hex | Usage |
|-------|-----|--------|
| `--bg-void` | `#f3efe6` | Deepest page void, scrollbar track |
| `--bg-base` | `#faf7f0` | `body` background |
| `--bg-surface` | `#f0ebe2` | Cards, elevated panels |
| `--bg-muted` | `#e6e0d5` | Inputs, wells |
| `--bg-ghost` | `#d9d2c6` | Scrollbar thumb, disabled chrome |

### 3.4 Light theme foreground

| Token | Hex | Usage |
|-------|-----|--------|
| `--fg-primary` | `#1c1916` | Headlines, body |
| `--fg-secondary` | `#5a554c` | Supporting copy |
| `--fg-tertiary` | `#8c8579` | Placeholders, meta |

### 3.5 Dark theme backgrounds

| Token | Hex |
|-------|-----|
| `--bg-void` | `#060606` |
| `--bg-base` | `#0c0c0c` |
| `--bg-surface` | `#141414` |
| `--bg-muted` | `#1c1c1c` |
| `--bg-ghost` | `#242424` |

### 3.6 Dark theme foreground

| Token | Hex |
|-------|-----|
| `--fg-primary` | `#f7f7f5` |
| `--fg-secondary` | `#b8b8b0` |
| `--fg-tertiary` | `#7a7a74` |

### 3.7 Borders & overlays

| Token | Light | Dark |
|-------|-------|------|
| `--border` | `rgba(28, 25, 22, 0.1)` | `rgba(242, 242, 240, 0.08)` |
| `--border-hover` | `rgba(28, 25, 22, 0.17)` | `rgba(242, 242, 240, 0.16)` |
| `--overlay-backdrop` | `rgb(28 25 22 / 0.42)` | `rgb(6 6 6 / 0.72)` |

### 3.8 Gradients (ambient)

| Token | Definition |
|-------|------------|
| `--gradient-hero` | Radial ellipse 80%×50% at 50% -10%, brand tint → transparent |
| `--gradient-card` | `135deg`, brand 5% (light) / 4% (dark) → transparent 60% |
| `--texture-warm-vignette` | Radial warm orange at top of textured sections |

### 3.9 Tailwind semantic aliases

Prefer these in JSX when using Tailwind color utilities:

- `bg-tw-base`, `bg-tw-surface`, `text-tw-fg`, `text-tw-fg-secondary`, `text-tw-brand`
- Legacy: `text-torpedo-orange` → email-era orange, **avoid on new pages** unless matching an existing programmatic template

### 3.10 Theme switching

- Attribute: `data-theme="light"` | `data-theme="dark"` on `<html>`
- Default: **light** (warm luxury)
- `themeColor` viewport meta: `#faf7f0` (light base)
- Toggle UI: `.tw-theme-toggle` (recessed track + keycap knob)

---

## 4. Typography

### 4.1 Font families

| Role | Family | Weights | CSS / Tailwind |
|------|--------|---------|----------------|
| Display / headlines | **Syne** | 700, 800 | `font-display`, `--font-syne` |
| Body / UI | **DM Sans** | 300, 400, 500 | `font-sans`, `--font-dm-sans` |
| Labels / code / eyebrows | **JetBrains Mono** | 400, 500 | `font-mono`, `--font-jetbrains-mono` |

Loaded in `lib/fonts.ts` via `marketingFontClassName` on the root layout.

### 4.2 Type scale (CSS variables)

| Variable | Size | Typical use |
|----------|------|-------------|
| `--text-xs` | `0.6875rem` (11px) | Eyebrow, micro labels |
| `--text-sm` | `0.8125rem` (13px) | Nav links |
| `--text-base` | `1rem` | Body |
| `--text-md` | `1.125rem` | Lead paragraphs |
| `--text-lg` | `1.25rem` | Subheads |
| `--text-xl` | `1.5rem` | Card titles |
| `--text-2xl` | `1.75rem` | — |
| `--text-3xl` | `2.25rem` | — |
| `--text-4xl` | `2.8rem` | Section headline (mobile anchor) |
| `--text-5xl` | `3.5rem` | Manifesto / final CTA |
| `--text-hero` | `clamp(2rem, 5vw, 5.5rem)` | Hero H1 |

Utility classes: `.tw-hero-h1`, `.tw-heading-section`, `.tw-hero-sub`

### 4.3 Tracking & casing patterns

| Pattern | Classes | Example |
|---------|---------|---------|
| Hero eyebrow | `font-display`, `uppercase`, `tracking-[0.16em]`–`0.18em`, `text-[var(--brand)]` | `[ DIGITAL INFRASTRUCTURE PARTNER ]` |
| Section mono label | `font-mono`, `text-[11px]`, `uppercase`, `tracking-[0.2em]`, `text-[var(--brand)]` | Process steps |
| Nav links | `text-[13px]`, `uppercase`, `tracking-[0.08em]` | Navbar |
| Footer headings | `letter-spacing: 0.2em` (`.tw-footer-heading`) | — |
| Display headlines | `font-display`, `font-bold`, `tracking-tight` | H1–H3 |

### 4.4 Prose

Blog and long-form: `.tw-prose-flow` with auto hyphens on paragraphs/headings. Article width: `.tw-blog-article` (`--blog-article-max`: 64.9rem). Intro: `.tw-blog-intro`.

---

## 5. Spacing & layout

### 5.1 Spacing scale (8px base)

| Token | Value |
|-------|-------|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |
| `--space-3xl` | 64px |
| `--space-4xl` | 96px |
| `--space-5xl` | 128px |
| `--space-6xl` | 192px |

### 5.2 Section vertical rhythm

| Token | Value |
|-------|-------|
| `--section-py` | 128px |
| `--section-py-lg` | 192px |

Use consistent section wrappers; avoid one-off `py-20` unless responsive override is documented.

### 5.3 Horizontal layout

| Token | Value |
|-------|-------|
| `--container-max` | 1280px |
| `--blog-container-max` | 85% of container (~1088px) |
| `--gutter` | 24px |
| `--nav-h` | `4.125rem` mobile · `5.5rem` ≥769px |

**Section shell:** `.tw-section` — centered, `max-width: min(1280px, 100%)`, responsive padding:

- default: `1rem`
- ≥640px: `1.5rem`
- ≥768px: `3rem`
- ≥1024px: `6rem`

**Blog shell:** `.tw-blog-section` (narrower max width).

### 5.4 Cards

| Token | Value |
|-------|-------|
| `--card-radius` | 12px |
| `--card-padding` | 32px |
| `--card-bg` | `var(--bg-surface)` |
| `--card-border` | `1px solid var(--border)` |

Clay components use **`--clay-radius-sm` (10px)**, **`--clay-radius-md` (14px)**, **`--clay-radius-lg` (18px)**.

### 5.5 Buttons (non-clay metrics)

| Token | Value |
|-------|-------|
| `--btn-radius` | 8px (legacy; clay buttons use `--clay-radius-sm`) |
| `--btn-padding` | `12px 24px` |

---

## 6. Skeuomorphism — the “Clay / Keycap” system

Torpedo Web skeuomorphism is **matte and tactile**, inspired by **PBT keycaps** on a warm desk—not iOS glossy bubbles.

### 6.1 Core principles

1. **Dual light source** — top-left rim highlight + bottom-right well shadow.
2. **Inset bevel** — `inset` shadows on top/left (light) and bottom/right (dark).
3. **Specular face** — soft `168deg` gradient overlay on the face (::after pseudo).
4. **Grain** — fractal noise SVG (`--surface-noise`) at low opacity, `mix-blend-mode: overlay`.
5. **Travel** — hover lifts `-1px`; active presses `+1px` and `scale(0.994)`.
6. **Border bottom** — darker bottom border simulates keycap lip.

### 6.2 Shadow stacks (use variables, never one-off box-shadow)

| State | Variable |
|-------|----------|
| Surface rest | `--clay-shadow-surface` |
| Surface hover | `--clay-shadow-surface-hover` |
| Surface pressed | `--clay-shadow-surface-pressed` |
| Brand rest | `--clay-shadow-brand` |
| Brand hover | `--clay-shadow-brand-hover` |
| Brand pressed | `--clay-shadow-brand-pressed` |
| Input inset | `--clay-shadow-input` |
| Card hover lift | `--clay-card-hover-shadow` |

Each stack combines:

- `--keycap-inset-bevel` (or brand variant)
- `--keycap-inset-specular`
- `--keycap-drop-rest` / `--keycap-drop-hover` / `--keycap-drop-pressed`

### 6.3 Surface gradients

| Variable | Light theme | Dark theme |
|----------|-------------|------------|
| `--clay-brand-grad` | Orange keycap gradient (same both themes) | Same |
| `--clay-surface-grad` | `#faf6ee → #e9e4da` | `#272727 → #161616` |
| `--clay-light-grad` | Warm cream stack | `#f4f4f6 → #dedee4` (inverted light keys on dark) |

### 6.4 Motion tokens

| Token | Value |
|-------|-------|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--keycap-travel-lift` | `-1px` |
| `--keycap-travel-press` | `1px` |
| Transition duration | `0.22s` buttons/icons · `0.25s` cards |

**Reduced motion:** `prefers-reduced-motion: reduce` disables transforms on clay/footer/toggle; keep color changes.

---

## 7. Component catalog

### 7.1 Buttons — always use `<Button />` or clay classes

**Component:** `components/ui/Button.tsx`

| Variant | Classes | When |
|---------|---------|------|
| `brand` | `tw-clay-btn tw-clay-btn-brand` | Primary CTA |
| `secondary` / `surface` | `tw-clay-btn-secondary` (+ `tw-clay-btn-surface`) | Secondary actions |
| `ghost` | `tw-clay-btn-ghost` | Tertiary / text |
| `nav` | `tw-clay-btn-nav` | Nav pill; hover → brand keycap |
| `light-brand` | `tw-clay-btn-light-brand` | Orange on light subsections |
| `light-secondary` | `tw-clay-btn-light-secondary` | Cream keycap on light bands |

**Sizes:** `sm` min-h 44px · `md` 48px · `lg` 52px (touch targets)

**Required:** Children wrapped in `<span className="relative z-[2]">` (handled by Button). Optional `shimmer` prop for marketing emphasis.

**Deprecated alias:** `.tw-btn-brand` — do not use in new code.

### 7.2 Cards

**Component:** `components/ui/ClayCard.tsx`

```tsx
<ClayCard hover light className="...">...</ClayCard>
```

| Class | Effect |
|-------|--------|
| `tw-clay-card` | Base embossed card |
| `tw-clay-card--hover` | Lift on hover |
| `tw-clay-card--light` | Light gradient variant (plans) |

### 7.3 Panels & FAQ wells

- `.tw-clay-panel` — section-scale embossed panel with grain ::before

### 7.4 Inputs

- `.tw-clay-input` — inset well, brand focus ring: `0 0 0 2px rgba(255, 78, 0, 0.2)`
- Footer: `.tw-footer-input` (deeper well, footer tokens)

**Standard form field pattern (popups/modals):**

```txt
rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] ...
focus:ring-2 focus:ring-[var(--brand)]/25
```

### 7.5 Icon buttons

- `.tw-clay-btn-icon` — square keycap with grain + specular

### 7.6 Navigation

- Scrolled state: `.tw-nav-glass` — frosted `backdrop-filter: blur(20px) saturate(180%)`, `--nav-glass-shadow`, `--nav-glass-inset`
- Logo offset utilities: `.tw-nav-logo-offset`, `.tw-nav-desktop-cluster` (do not break desktop alignment)

### 7.7 Footer

Shell: `.tw-footer` (gradient bg, grain, warm radial ::after)

| Element | Class |
|---------|-------|
| Panel | `tw-footer-panel` |
| Divider | `tw-footer-panel-rim` |
| Logo well | `tw-footer-logo-well` |
| Social | `tw-footer-social` |
| Links | `tw-footer-link` |
| Region block | `tw-footer-region` |

### 7.8 Chat (Torp AI)

| Element | Class |
|---------|-------|
| Panel | `tw-chat-shell` |
| Header | `tw-chat-header` |
| FAB | `tw-clay-btn-brand tw-chat-fab` |
| User bubble | `tw-chat-bubble-user` |
| AI bubble | `tw-chat-bubble-ai` |
| Agent bubble | `tw-chat-bubble-agent` |

### 7.9 Textures

| Class | Effect |
|-------|--------|
| `tw-texture-void` | Linen + noise + warm vignette on void bg |
| `tw-texture-surface` | Lighter texture on surfaces |
| `tw-dot-grid` | Hero dot matrix (`24px` grid) |

Body has global fixed grain via `body::before` (`--texture-base-opacity`).

### 7.10 Decorative

- `.tw-star` / `.tw-star--warm` / `.tw-star--cool` — ambient starfield
- `.animate-hero-chevron` — hero scroll hint
- Selection: `background: var(--brand); color: var(--brand-fg)`

### 7.11 Body copy defaults

| Element | Classes |
|---------|---------|
| Standard paragraph | `font-sans text-base font-normal leading-[1.6] text-[var(--fg-secondary)]` |
| Emphasized paragraph | `text-[var(--fg-primary)]` (first para in a story block) |
| Bullet list (mono rail) | `border-l-2 border-[var(--brand)] pl-3` on each `li` |
| Trust / meta line | `font-mono text-xs text-[var(--fg-tertiary)]` |
| Lead (inner hero) | `text-base md:text-lg leading-[1.6]` |

Line height on `body` is **1.6** globally.

### 7.12 `ClientLayout` shell (every marketing page)

```tsx
<div className="relative flex min-h-dvh w-full max-w-[100vw] flex-col bg-[var(--bg-base)] text-[var(--fg-primary)] selection:bg-[var(--brand)] selection:text-[var(--brand-fg)]">
  <Navbar />
  <div className="w-full min-w-0 flex-1 pt-[var(--nav-h)]">{children}</div>
  <Footer />
</div>
```

Children **must** use `id="main-content"` on `<main>` for skip link.

---

## 8. Section band rhythm (torpedoweb.org layout DNA)

Every long page is a **stack of horizontal bands**. Bands are separated by `border-t border-[var(--border)]` (or `border-b` on the top hero). Vertical padding is almost always `py-[var(--section-py)] md:py-[var(--section-py-lg)]` on homepage sections, or `py-14 md:py-20` on inner pages (services, etc.).

### 8.1 Background alternation (homepage order — copy this cadence)

| # | Section | Background | Notes |
|---|---------|------------|--------|
| 1 | Home hero | `--bg-void` | Full viewport minus nav; decor layers |
| 2 | Invisibility tax | `--bg-base` | Standard content band |
| 3 | Paradox | `--bg-surface` | Slightly elevated |
| 4 | What we build | `--bg-base` | Clay cards |
| 5 | Social proof | `--bg-void` | Testimonial carousel |
| 6 | Manifesto | `--bg-void` | Radial brand glow overlay |
| 7 | FAQ | `--bg-surface` | Accordion list |
| 8 | Final CTA | `--bg-void` | Large padding `--section-py-lg` only |

**Rule for new long pages:** alternate `base` → `surface` → `base` → `void` so the page “breathes” warm cream tones; never use 3+ identical bands in a row.

### 8.2 Standard section shell (homepage band)

```tsx
<section
  className="border-t border-[var(--border)] bg-[var(--bg-base)] py-[var(--section-py)] md:py-[var(--section-py-lg)]"
  aria-labelledby="your-section-heading"
>
  <motion.div
    className="tw-section"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-10% 0px' }}
    variants={sectionVariants}
  >
    {/* eyebrow + h2 + content */}
  </motion.div>
</section>
```

Swap `bg-[var(--bg-base)]` for `bg-[var(--bg-surface)]` or `bg-[var(--bg-void)]` per §8.1.

### 8.3 Inner page hero (services, process, blog index)

Shorter hero — **no** full viewport height. Pattern from `ServicesIndexView`:

```tsx
<section className="border-b border-[var(--border)] bg-[var(--bg-void)] py-14 md:py-20">
  <div className="tw-section min-w-0 max-w-full">
    <ServicesEyebrowScramble text="[ YOUR EYEBROW ]" />
    {/* or inline eyebrow classes — see §8.5 */}
    <h1 className="tw-heading-section tw-prose-flow mt-4 max-w-full min-w-0 break-words font-display font-extrabold tracking-tight text-balance text-[var(--fg-primary)] [overflow-wrap:anywhere]">
      Page title
    </h1>
    <p className="tw-prose-flow mt-6 max-w-3xl text-base leading-[1.6] text-[var(--fg-secondary)] md:text-lg">
      Lead paragraph
    </p>
  </div>
</section>
```

### 8.4 Homepage hero (canonical — `HomeHero`)

```tsx
<section
  className="relative flex min-h-[calc(100dvh-var(--nav-h))] min-w-0 flex-col items-center justify-center overflow-hidden bg-[var(--bg-void)] pb-24 pt-6 sm:pb-28 sm:pt-8"
  aria-labelledby="home-hero-heading"
>
  {/* HomeHeroDecor: AmbientParticles + gradient-hero + tw-dot-grid + horizon lines */}
  <div className="relative z-[10] mx-auto flex w-full min-w-0 max-w-[1280px] flex-col items-center px-4 pb-20 text-center sm:px-6 md:px-12 md:pb-16 lg:px-24">
    {/* HomeHeroEyebrow + HomeHeroCopy */}
  </div>
  {/* HomeHeroScrollHint */}
</section>
```

**HomeHeroDecor layers (z-index 2, pointer-events-none):**

```tsx
<div className="pointer-events-none absolute inset-0 z-[2] bg-[image:var(--gradient-hero)] opacity-55" />
<div className="pointer-events-none absolute inset-0 z-[2] tw-dot-grid opacity-[0.04]" />
{/* optional horizon lines: h-px bg-[var(--fg-primary)] opacity-[0.03] at 30%, 60%, 85% */}
```

**HomeHeroCopy (exact typography):**

```tsx
<h1
  id="home-hero-heading"
  className="tw-hero-h1 max-w-full font-display font-extrabold tracking-[-0.02em] text-[var(--fg-primary)]"
>
  Line one{' '}
  <span className="whitespace-nowrap text-[var(--brand)] max-[380px]:whitespace-normal">highlight</span>
  <br />
  line two
</h1>
<p className="tw-hero-sub tw-prose-flow mx-auto mt-8 max-w-[540px] font-sans font-light text-[var(--fg-secondary)]">
  Subtitle
</p>
<div className="mt-10 flex w-full max-w-md flex-col items-stretch gap-4 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
  <Button variant="brand" size="md" withArrow className="w-full sm:w-auto" />
  <Button variant="secondary" size="md" withArrow className="w-full sm:w-auto" />
</div>
```

### 8.5 Eyebrow label — exact class strings

| Context | Classes |
|---------|---------|
| Home hero | `tw-prose-flow mb-4 max-w-full font-display text-[clamp(0.805rem,2.3vw,0.934rem)] font-bold uppercase leading-snug tracking-[0.16em] text-[var(--brand)] sm:text-[clamp(0.863rem,1.725vw,1.006rem)] sm:tracking-[0.18em]` |
| Home sections | `tw-prose-flow mb-4 max-w-full font-display text-[clamp(0.756rem,2vw,0.98rem)] font-bold uppercase leading-snug tracking-[0.2em] text-[var(--brand)] sm:text-[clamp(0.81rem,1.6vw,1.02rem)]` |
| Final CTA | `tracking-[0.2em]` + slightly larger clamp (`0.791rem` → `1.05rem`) |
| Services index | `ServicesEyebrowScramble` component (same scramble, `tracking-[0.2em]`) |
| Footer region | `tw-footer-heading … font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand)]` |

**Copy format:** `[ ALL CAPS LABEL ]` with brackets.

**Scramble hook (all marketing eyebrows):**

```tsx
const scrambled = useTextScramble('[ SECTION LABEL ]', 900, true, 3000);
```

### 8.6 Section header block (below eyebrow)

```tsx
<h2
  id="section-id"
  className="tw-heading-section tw-prose-flow max-w-4xl font-display font-bold tracking-tight text-[var(--fg-primary)]"
>
  Headline
</h2>
<p className="mt-6 max-w-2xl font-sans text-base font-normal leading-[1.6] text-[var(--fg-secondary)]">
  Body intro
</p>
```

### 8.7 Clay feature card (WhatWeBuild / ServiceGridCard)

```tsx
<ClayCard as="article" hover className="group relative overflow-hidden p-5 sm:p-6 md:p-8 lg:p-10">
  <span
    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
    style={{ background: 'var(--gradient-card)' }}
    aria-hidden
  />
  <span
    className="pointer-events-none absolute -right-2 -top-6 font-display text-[length:5rem] font-extrabold leading-none text-[var(--fg-primary)] opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.08] sm:text-[length:6rem] md:text-[length:8rem]"
    aria-hidden
  >
    01
  </span>
  <div className="relative z-[1]">
    <p className="font-mono text-xs uppercase tracking-wider text-[var(--brand)]">Subtitle</p>
    <h3 className="mt-2 font-display text-2xl font-bold text-[var(--fg-primary)] md:text-3xl">Title</h3>
    <p className="mt-4 max-w-2xl font-sans text-base font-normal leading-[1.8] text-[var(--fg-secondary)]">...</p>
  </div>
</ClayCard>
```

**Feature chips (services grid):**

```tsx
className="rounded-[var(--clay-radius-sm)] border border-[var(--border)] bg-[var(--bg-base)]/60 px-2.5 py-1 font-mono text-[0.68rem] leading-snug text-[var(--fg-secondary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
```

**Orange pill badge:**

```tsx
className="rounded-full border border-[var(--brand)]/25 bg-[var(--brand)]/10 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wide text-[var(--brand)]"
```

### 8.8 Manifesto / emotional CTA band

```tsx
<section className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--bg-void)] py-[var(--section-py)] md:py-[var(--section-py-lg)]">
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--brand-glow),transparent_55%)]" aria-hidden />
  <motion.div className="relative z-[1] tw-section text-center" variants={sectionVariants} /* ... */>
    <h2 className="tw-prose-flow mx-auto max-w-4xl font-display text-[clamp(1.8rem,4.2vw,3rem)] font-bold leading-[1.15] tracking-tight text-[var(--fg-primary)]">
      ...
    </h2>
    <div className="mt-10 flex w-full max-w-lg flex-col gap-4 sm:flex-row sm:justify-center">
      <Button variant="brand" withArrow className="w-full sm:w-auto" />
      <Button variant="secondary" withArrow className="w-full sm:w-auto" />
    </div>
  </motion.div>
</section>
```

### 8.9 Final conversion section

```tsx
<section className="border-t border-[var(--border)] bg-[var(--bg-void)] py-[var(--section-py-lg)]">
  <motion.div className="tw-section text-center" variants={sectionVariants} /* ... */>
    {/* eyebrow scramble */}
    <h2 className="tw-heading-section tw-prose-flow mx-auto max-w-3xl font-display font-extrabold tracking-tight text-[var(--fg-primary)]">...</h2>
    <p className="mx-auto mt-6 max-w-xl font-sans text-base font-light leading-relaxed text-[var(--fg-secondary)]">...</p>
    <div className="mt-10 flex justify-center">
      <Button variant="brand" size="lg" withArrow className="w-full sm:w-auto" />
    </div>
    <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-3 font-mono text-xs text-[var(--fg-tertiary)] sm:flex-row sm:gap-8">
      <span>✓ Trust line one</span>
    </div>
  </motion.div>
</section>
```

### 8.10 FAQ accordion (homepage)

```tsx
<section id="faq" className="border-t border-[var(--border)] bg-[var(--bg-surface)] py-[var(--section-py)] md:py-[var(--section-py-lg)]">
  <motion.div className="tw-section" variants={sectionVariants} /* ... */>
    <div className="mx-auto w-full max-w-3xl">
      <h2 className="tw-heading-section tw-prose-flow font-display font-bold text-[var(--fg-primary)]">...</h2>
      <ul className="mt-10 divide-y divide-[var(--border)] border-t border-b border-[var(--border)]">
        <li>
          <button type="button" className="flex min-h-[44px] w-full items-start justify-between gap-4 py-4 text-left sm:py-5">
            <span className="font-sans text-base font-medium text-[var(--fg-primary)]">Question</span>
            <Plus className="h-5 w-5 text-[var(--brand)]" />
          </button>
          <p className="pb-5 font-sans text-base font-normal leading-[1.6] text-[var(--fg-secondary)]">Answer</p>
        </li>
      </ul>
    </div>
  </motion.div>
</section>
```

Inner-page FAQ in clay panel: `ClayCard className="p-6 md:p-10"` with `border-b border-[var(--border)]` between items.

### 8.11 Blog

- Index cards: `rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 … hover:border-[var(--brand)]/40 hover:shadow-md`
- Article column: `.tw-blog-section`, `.tw-blog-article`, `.tw-blog-intro`
- Markdown: use `MarkdownProse` — never raw `prose-gray`

### 8.12 Modals / popups

```tsx
className="relative z-10 flex max-h-[min(calc(100dvh-1.5rem),40rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[rgb(var(--bg-base-rgb)/0.94)] shadow-[0_24px_48px_rgba(28,25,22,0.14),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-2xl"
```

Backdrop: `bg-[var(--overlay-backdrop)]`. Body class: `lead-popup-open`.

### 8.13 Legacy `Section` component

`components/ui/Section.tsx` uses `container max-w-7xl` + `py-12 md:py-24` — **older pattern**. New homepage-quality sections should use **`tw-section` inside a `<section>` band** (§8.2), not `Section`, unless extending legacy pages (`Services.tsx`, `WhoWeAre`).

---

## 9. Accessibility & interaction

| Requirement | Implementation |
|-------------|----------------|
| Focus visible | `outline: 2px solid var(--brand); outline-offset: 2px`–`3px` |
| Touch targets | Min 44×44px on primary controls |
| Contrast | Brand buttons use `--brand-fg` (#060606) on orange |
| Skip link | Pattern in `ClientLayout` — sr-only until focus |
| Scroll lock | Use established `html.*-open` classes for menus/popups |

---

## 10. Anti-patterns (reject in review)

| ❌ Don't | ✅ Do instead |
|----------|----------------|
| `bg-white`, `text-gray-600`, `border-gray-200` on marketing pages | `var(--bg-surface)`, `var(--fg-secondary)`, `var(--border)` |
| Flat `bg-orange-500` buttons | `<Button variant="brand" />` or `tw-clay-btn-brand` |
| Random `shadow-md` | `shadow-clay-brand`, `var(--clay-shadow-surface)` |
| `#FF5500` in web UI | `var(--brand)` / `#ff4e00` |
| Glossy gradients (`from-white to-gray-100`) | Clay surface gradients + grain |
| Skipping ::before/::after grain on custom “primary” buttons | Extend `.tw-clay-btn` in globals.css |
| CRM/admin gray UI on public routes | Admin uses separate neutral UI; marketing must use tokens |

**Note:** `/crm/*` and some legacy widgets (`BookingWidget`) use neutral white cards—**do not copy that to new marketing pages.**

---

## 11. Dark mode checklist

When adding components:

- [ ] Test with `data-theme="dark"` on `<html>`
- [ ] Borders use `var(--border)`, not hardcoded gray
- [ ] Gradients use theme tokens (`--clay-surface-grad`, etc.)
- [ ] Grain opacity respects `--btn-grain-opacity` / `--texture-*-opacity`
- [ ] Orange brand gradient stays the same; only surroundings shift

---

## 12. New page checklist

- [ ] Page background: `--bg-base` or `--bg-void` with texture utility if large void areas
- [ ] All text via `--fg-*` tokens
- [ ] Section wrapper: `.tw-section` or `.tw-blog-section`
- [ ] CTAs: `<Button />` clay variants only
- [ ] Cards: `<ClayCard />` or `.tw-clay-panel`
- [ ] Eyebrows: mono or display per §4.3
- [ ] Focus states visible
- [ ] `prefers-reduced-motion` respected (no essential info in hover-only transforms)
- [ ] No new hex colors without updating `globals.css` + this doc
- [ ] OG/theme meta still appropriate (`themeColor` for light base)

---

## 13. File reference map

| Concern | Path |
|---------|------|
| All CSS variables & clay classes | `app/globals.css` |
| Tailwind extensions | `tailwind.config.ts` |
| Email / legacy hex | `lib/brand-tokens.ts` |
| Fonts | `lib/fonts.ts` |
| Theme persistence | `lib/theme.ts`, `lib/theme-init-script.ts` |
| Button API | `components/ui/Button.tsx` |
| Card API | `components/ui/ClayCard.tsx` |
| Critical path CSS | `lib/critical-css.ts` |

---

## 14. Quick copy-paste snippets

### Primary CTA

```tsx
import Button from '@/components/ui/Button';

<Button variant="brand" size="lg" href="/contact" withArrow>
  Book a discovery call
</Button>
```

### Section container

```tsx
<section className="tw-section py-[var(--section-py)] tw-texture-void">
  ...
</section>
```

### Semantic colors in Tailwind arbitrary values

```tsx
className="bg-[var(--bg-surface)] text-[var(--fg-primary)] border-[var(--border)]"
```

---

## 15. Motion & animation bible

### 15.1 Easing

All clay hovers and Framer entrances use **`[0.16, 1, 0.3, 1]`** — same as CSS `--ease-out-expo`.

### 15.2 Framer variants (`lib/animations.ts`)

```ts
// Section entrance
sectionVariants: hidden { opacity: 0, y: 40 } → visible { opacity: 1, y: 0, duration: 0.7 }

// Card entrance
cardVariants: hidden { opacity: 0, y: 24, scale: 0.98 } → visible { duration: 0.5 }

// Stagger container (optional)
containerVariants: staggerChildren: 0.1, delayChildren: 0.2
```

**Standard usage:**

```tsx
import { motion } from 'framer-motion';
import { sectionVariants, cardVariants } from '@/lib/animations';

<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-10% 0px' }}
  variants={sectionVariants}
>
```

### 15.3 Text scramble

- Hook: `useTextScramble(text, 900, true, 3000)` from `@/hooks/useTextScramble`
- Respects `prefers-reduced-motion` (shows final text immediately)
- Use for eyebrows only — not body paragraphs

### 15.4 Below-the-fold performance

Wrap non-LCP sections: `<div className="tw-below-fold">...</div>` (content-visibility).

### 15.5 Ambient particles (hero only)

`AmbientParticles` — desktop only, GSAP, orange `rgba(255, 78, 0, 0.2)` or warm gray dots. Do not add to inner pages unless hero-scale.

### 15.6 Logo pulse

Navbar logo hover: add/remove `tw-logo-pulse` on mark (`@keyframes tw-logo-pulse`).

### 15.7 Marquee / scroll line

- Hero scroll hint: `ChevronDown` + `animate-hero-chevron`
- Legacy scroll line: `animate-[torpedo-scroll_1.5s_linear_infinite]` on orange bar

---

## 16. Z-index ladder

| Layer | z-index | Example |
|-------|---------|---------|
| Body grain | -1 | `body::before` |
| Section texture | 0 | `tw-texture-*::before` |
| Hero decor | 2 | gradients, dot grid |
| Hero content | 10 | copy, scroll hint |
| Clay card content | 1 | `relative z-[1]` inside cards |
| Button label | 2 | `z-[2]` on Button children |
| Navbar | 50 | fixed nav |
| Navbar mobile open | 1200 / 1500 | menu overlay |
| Skip link focus | 60 | |
| Chat FAB | 50 | `tw-chat-fab` |
| Modal | 10+ on panel | lead capture |

Do not use arbitrary `z-50` on section content — it breaks nav/menu stacking.

---

## 17. Navbar & footer (do not redesign)

### 17.1 Navbar

- **Fixed** top, height `var(--nav-h)`, `aria-label="Primary"`
- Rest: `bg-[var(--bg-void)]` + `border-b border-[var(--border)]`
- Scrolled (≥60px): add `tw-nav-glass border-b border-[var(--border)]`
- Logo: `/logo.svg` 32px, wordmark `TORPEDO WEB` — `font-display font-bold tracking-tight`
- Links: `text-[13px] uppercase tracking-[0.08em]` — active `text-[var(--brand)]` + underline scale
- CTA: `<Button variant="nav" size="sm">` with `ArrowRight`
- Mobile menu: `tw-clay-btn-icon` hamburger; full-screen `font-display text-2xl` links
- Include `<ThemeToggle size="nav" />`

### 17.2 Footer

- Root: `tw-footer` (gradient shell + grain)
- Panels: `tw-footer-panel`, divider `tw-footer-panel-rim`
- Links: `tw-footer-link`, social: `tw-footer-social`
- Regions: `tw-footer-region` + `tw-footer-heading`
- CTA card: `ClayCard` + `Button variant="brand"`
- Use `MonoBracketEyebrowScramble` for section labels where applicable

---

## 18. Component decision tree

```
Need a clickable action?
├─ Primary conversion → Button variant="brand" (+ withArrow)
├─ Secondary → variant="secondary" | "surface"
├─ On cream/light band → "light-brand" | "light-secondary"
├─ Nav bar only → variant="nav"
└─ Text-only → variant="ghost"

Need a container?
├─ Clickable card / feature → ClayCard hover
├─ Static FAQ block → ClayCard (no hover) or accordion list
├─ Full-width section well → tw-clay-panel
└─ Form field → tw-clay-input

Need a page section?
├─ Homepage narrative → §8.2 band + motion.div tw-section
├─ Index hero → §8.3 border-b + bg-void
├─ Full homepage hero → §8.4 HomeHero pattern
└─ Legacy block → Section (only if matching existing page)

Need eyebrow?
├─ Home / long-form → useTextScramble + §8.5 classes
├─ Services → ServicesEyebrowScramble
└─ Footer → MonoBracketEyebrowScramble
```

---

## 19. Full page blueprint (paste & adapt)

```tsx
// app/(marketing)/example/page.tsx
import { ServicesEyebrowScramble } from '@/components/services/ServicesEyebrowScramble';
import { ClayCard } from '@/components/ui/ClayCard';
import Button from '@/components/ui/Button';

export default function ExamplePage() {
  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col bg-[var(--bg-base)] text-[var(--fg-primary)]">
      {/* Inner hero */}
      <section className="border-b border-[var(--border)] bg-[var(--bg-void)] py-14 md:py-20">
        <div className="tw-section">
          <ServicesEyebrowScramble text="[ PAGE CATEGORY ]" />
          <h1 className="tw-heading-section tw-prose-flow mt-4 font-display font-extrabold tracking-tight text-[var(--fg-primary)]">
            Page title
          </h1>
          <p className="tw-prose-flow mt-6 max-w-3xl text-base leading-[1.6] text-[var(--fg-secondary)] md:text-lg">
            Lead copy
          </p>
        </div>
      </section>

      {/* Content band */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-base)] py-14 md:py-20">
        <div className="tw-section">
          <h2 className="tw-heading-section font-display font-bold text-[var(--fg-primary)]">Section title</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <ClayCard hover className="p-6 md:p-8">...</ClayCard>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-void)] py-[var(--section-py-lg)]">
        <div className="tw-section text-center">
          <Button variant="brand" size="lg" withArrow href="/book">
            Book a Strategy Call
          </Button>
        </div>
      </section>
    </main>
  );
}
```

Add Framer + scramble when building **marketing-grade** pages (homepage parity).

---

## 20. Legacy vs canonical (avoid drift)

| Legacy (do not copy to new pages) | Canonical (torpedoweb.org today) |
|-----------------------------------|-------------------------------------|
| `components/Hero.tsx` — `text-torpedo-orange`, `text-torpedo-dark`, `light-brand` on old hero | `components/home/HomeHero.tsx` — CSS vars, `variant="brand"` |
| `Section` + `max-w-7xl` container | `tw-section` bands |
| `text-torpedo-orange` in new JSX | `text-[var(--brand)]` |
| Flat white pricing/booking widgets | `ClayCard` + tokens |
| CRM `border-gray-200 bg-white` | Marketing tokens only |

---

## 21. Icons & links

- **Library:** `lucide-react` (prefer direct icon path imports in hot paths: `lucide-react/dist/esm/icons/arrow-right.js`)
- **CTA arrows:** `ArrowRight` with `group-hover:translate-x-1` on Button
- **Inline links:** `text-[var(--brand)] hover:text-[var(--brand-hover)]` or footer `tw-footer-link`
- **External:** `target="_blank" rel="noopener noreferrer"`

---

## 22. Cursor skill & prompt snippet

**Skill (recommended):** invoke **`torpedo-web-design`** — loads `.cursor/skills/torpedo-web-design/SKILL.md` with workflows + checklist. Pair with this document for full token tables.

Copy into any Cursor instruction when building UI:

```text
Use skill torpedo-web-design and docs/DESIGN-GUIDE.md v2.1.
Marketing page for torpedoweb.org — clay keycaps, var(--*) only, Button + ClayCard,
tw-section bands, useTextScramble eyebrows (900, 3000), sectionVariants. No gray Tailwind.
```

---

## 23. Versioning

When the design system changes:

1. Update `app/globals.css` tokens first.
2. Sync `lib/critical-css.ts` if above-the-fold styles change.
3. Update this document with exact new values.
4. Mention breaking visual changes in PR description.

---

*Torpedo Web — Digital Infrastructure Partner. This document is the enforcement layer for visual consistency across all pages.*
