# WCAG 2.1 Level AA Accessibility Audit Report

**Project:** Torpedo Web  
**Standard:** WCAG 2.1 Level AA (Americans with Disabilities Act / ADA alignment)  
**Date:** 2025  
**Scope:** Full codebase refactor for semantic structure, keyboard access, forms, dynamic content, and robustness.

---

## Executive Summary

A full accessibility refactor was applied across marketing pages, portal (authenticated) pages, and auth flows. Changes are architectural where needed and preserve existing design, performance, and SEO. All identified WCAG 2.1 AA violations in the audited areas have been addressed.

---

## Phase 1: Semantic Structure

| Violation | Severity | Fix Applied | WCAG Ref |
|-----------|----------|-------------|----------|
| No skip-to-content link | AA | Added "Skip to main content" link at top of every layout (marketing, portal, auth). Link is sr-only until focused; focus reveals it. | 2.4.1 Bypass Blocks |
| Main content not identifiable | AA | Every page uses a single `<main id="main-content">` landmark. Skip link targets `#main-content`. | 1.3.1 Info and Relationships, 2.4.1 |
| Multiple or missing h1 | AA | Single h1 per page: Home (Hero), Services, About, Our Work (sr-only when COMING_SOON), Book (sr-only), Privacy/Terms (from markdown), Blocked, Auth/Portal pages. Our Work section uses h2 for "Our Work" / "Coming soon" under page-level h1. | 1.3.1, 2.4.6 Headings and Labels |
| Heading hierarchy | AA | Sections use consistent h2/h3/h4; no level skipping. | 1.3.1 |
| html lang | AA | Root layout already had `<html lang="en">`. No change. | 3.1.1 Language of Page |
| Page titles | AA | Metadata titles are unique and descriptive per route. No change. | 2.4.2 Page Titled |

**Files changed:** `app/layout.tsx` (unchanged), `ClientLayout.tsx`, `app/(marketing)/page.tsx`, all marketing and auth page files, `app/(portal)/layout.tsx`, `app/(auth)/layout.tsx`, `OurWork.tsx`, `our-work/page.tsx`, `book/page.tsx`.

---

## Phase 2: Text Alternatives

| Violation | Severity | Fix Applied | WCAG Ref |
|-----------|----------|-------------|----------|
| Decorative images without alt="" | AA | Logo/asterisk in BookingForm already had alt="". Decorative SVGs and canvas (Hero pixel art, scroll indicator, icons in nav/buttons) wrapped or marked with `aria-hidden`. | 1.1.1 Non-text Content |
| Interactive icons without accessible name | AA | Navbar menu button has `aria-label` ("Open menu" / "Close menu"). Show password, Calendar CTA, Portal sidebar links, Sign out: icons have `aria-hidden`; buttons/links have visible or sr-only text. | 1.1.1, 2.4.6 |
| External links not indicated | AA | Footer social links have `aria-label="… (opens in new tab)"`. MarkdownProse external links append sr-only " (opens in new tab)". FloatingCalendlyButton aria-label and tabIndex when hidden. | 2.4.4 Link Purpose (In Context), 3.2.5 Change on Request |

**Files changed:** `Navbar.tsx`, `Footer.tsx`, `Button.tsx`, `BookingForm.tsx`, `LoginForm.tsx`, `FloatingCalendlyButton.tsx`, `MarkdownProse.tsx`, `Hero.tsx`, `Contact.tsx`, `PortalSidebar.tsx`, `ProfileForm.tsx`.

---

## Phase 3: Keyboard Accessibility

| Violation | Severity | Fix Applied | WCAG Ref |
|-----------|----------|-------------|----------|
| No visible focus indicator | AA | Global `:focus-visible` styles in `globals.css`: 2px solid orange outline, 2px offset for links, buttons, and [tabindex]. Navbar toggle and other interactive elements use focus-visible ring. | 2.4.7 Focus Visible |
| Mobile menu not keyboard-trapped | AA | When mobile menu (dialog) is open: focus moves to first focusable; Tab/Shift+Tab trapped within dialog; Escape closes and restores focus to toggle. | 2.1.2 No Keyboard Trap |
| Clickable divs / non-focusable controls | AA | No clickable divs identified; CTAs use `<a>` or `<button>`. Show-password control was `tabIndex={-1}`; removed so it is keyboard operable and given min touch target. | 2.1.1 Keyboard |
| Skip link not keyboard-visible | AA | Skip link uses `sr-only` + `focus:not-sr-only` (Tailwind) so it appears on focus. | 2.4.1, 2.4.7 |
| Hidden CTA still focusable | AA | FloatingCalendlyButton when hidden has `aria-hidden` and `tabIndex={-1}` so it is not in tab order. | 2.1.1 |

**Files changed:** `globals.css`, `Navbar.tsx`, `ClientLayout.tsx`, `app/(portal)/layout.tsx`, `app/(auth)/layout.tsx`, `LoginForm.tsx`, `FloatingCalendlyButton.tsx`.

---

## Phase 4: Forms & Inputs

| Violation | Severity | Fix Applied | WCAG Ref |
|-----------|----------|-------------|----------|
| Error messages not announced | AA | All forms with inline errors: error element has `id` and `role="alert"`; form has `aria-describedby={error ? 'id' : undefined}` so errors are announced. | 3.3.1 Error Identification, 4.1.3 Status Messages |
| Required fields not programmatically indicated | AA | Required inputs use HTML `required`; asterisk in BookingForm is decorative (`aria-hidden`). | 3.3.2 Labels or Instructions |
| Placeholder-only labeling | AA | All inputs have associated `<label htmlFor="…">`; placeholders are supplementary. | 1.3.1, 3.3.2 |
| File upload not described | AA | ProfileForm file input is sr-only; label includes visible icon + sr-only "Change profile photo". | 1.1.1, 2.4.6 |
| Loading state not communicated | AA | ProfileForm upload overlay has `aria-busy="true"`, `aria-live="polite"`, and sr-only "Uploading photo…". | 4.1.3 |

**Files changed:** `BookingForm.tsx`, `LoginForm.tsx`, `SignupForm.tsx`, `ForgotPasswordForm.tsx`, `ProfileForm.tsx`, `app/(auth)/reset-password/page.tsx`.

---

## Phase 5: Color & Visual Contrast

| Violation | Severity | Fix Applied | WCAG Ref |
|-----------|----------|-------------|----------|
| Focus indicator contrast | AA | Focus outline uses `#FF5500` (torpedo-orange) on white; 2px solid meets 3:1 against adjacent background. | 2.4.7 |
| Text/background contrast | AA | No design token changes. Existing palette (torpedo-dark, torpedo-gray, torpedo-orange on white/dark) was assumed to meet 4.5:1 / 3:1 where used. Recommend a dedicated contrast audit (e.g. axe DevTools or Contrast Checker) for any custom combinations. | 1.4.3 Contrast (Minimum) |

**Files changed:** `globals.css` (focus-visible outline).

---

## Phase 6: Dynamic Content & ARIA

| Violation | Severity | Fix Applied | WCAG Ref |
|-----------|----------|-------------|----------|
| Mobile menu not a dialog | AA | Mobile menu already had `role="dialog"`, `aria-modal="true"`, `aria-label="Navigation menu"`, `aria-expanded`/`aria-controls` on toggle. Added focus trap and initial focus. | 2.1.2, 4.1.2 Name, Role, Value |
| Carousel auto-motion without control | AA | QuoteCarousel: added Pause/Play button; when `useReducedMotion()` is true or user pauses, static list of testimonials is shown. Carousel region has `aria-roledescription="carousel"` and `aria-label`. | 2.2.2 Pause, Stop, Hide |
| Decorative motion | AA | MotionConfig `reducedMotion="user"` in ClientLayout so Framer Motion respects system preference. `prefers-reduced-motion: reduce` in globals.css sets `scroll-behavior: auto`. | 2.3.3 Animation from Interactions (AAA), best practice for 2.2.2 |
| Status messages | AA | Form errors use `role="alert"`. ProfileForm success/error and upload state use alert or aria-live/sr-only. | 4.1.3 |

**Files changed:** `Navbar.tsx`, `QuoteCarousel.tsx`, `ClientLayout.tsx`, `globals.css`, `BookingForm.tsx`, `LoginForm.tsx`, `SignupForm.tsx`, `ForgotPasswordForm.tsx`, `ProfileForm.tsx`, `reset-password/page.tsx`.

---

## Phase 7: Media

| Violation | Severity | Fix Applied | WCAG Ref |
|-----------|----------|-------------|----------|
| Video/audio | N/A | No video or audio content in the audited scope. | — |

---

## Phase 8: Robustness & Testing

| Item | Status |
|------|--------|
| Semantic HTML | Header/nav/main/footer/section/article used; no unnecessary ARIA where semantics suffice. |
| Single main landmark | Every route has one `<main id="main-content">`. |
| Skip link | Present in marketing, portal, and auth layouts; visible on focus. |
| Keyboard operability | All interactive elements are buttons or links; mobile dialog has focus trap. |
| Form labels & errors | All inputs labeled; errors with role="alert" and aria-describedby. |
| Reduced motion | MotionConfig + CSS prefers-reduced-motion; QuoteCarousel static fallback. |
| Screen reader assumptions | Decorative content aria-hidden; live/alert used for dynamic messages. |

**Recommended next steps:** Run axe-core or Lighthouse accessibility audit on each route after deployment; fix any remaining contrast or ARIA issues. Manually test with VoiceOver (macOS/iOS) and NVDA (Windows).

---

## Files Modified (Summary)

- **Layouts:** `app/layout.tsx`, `app/(marketing)/layout.tsx`, `app/(portal)/layout.tsx`, `app/(auth)/layout.tsx`, `ClientLayout.tsx`
- **Marketing pages:** `app/(marketing)/page.tsx`, `services/page.tsx`, `about/page.tsx`, `our-work/page.tsx`, `book/page.tsx`, `privacy-policy/page.tsx`, `terms-of-service/page.tsx`, `blocked/page.tsx`
- **Auth:** `app/(auth)/reset-password/page.tsx`
- **Components:** `Navbar.tsx`, `Footer.tsx`, `Hero.tsx`, `Contact.tsx`, `OurWork.tsx`, `QuoteCarousel.tsx`, `FloatingCalendlyButton.tsx`, `Button.tsx`, `MarkdownProse.tsx`, `BookingForm.tsx`, `LoginForm.tsx`, `SignupForm.tsx`, `ForgotPasswordForm.tsx`, `ProfileForm.tsx`, `PortalSidebar.tsx`
- **Global:** `app/globals.css`

---

*This report documents the refactor performed for ADA/WCAG 2.1 AA alignment. Ongoing monitoring and testing (automated and manual) are recommended.*
