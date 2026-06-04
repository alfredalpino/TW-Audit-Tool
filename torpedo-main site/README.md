# Torpedo Web

**Built on Belief. Deployed for Growth.**

Marketing and positioning site for Torpedo: a premium web development and design agency. Custom websites, design systems, and scalable infrastructure built for serious brands.

---

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Supabase**: PostgreSQL, Auth, RLS, Storage
- **Tailwind CSS**: styling (PostCSS)
- **Framer Motion**: animations
- **Lucide React**: icons

---

## Services

| Pillar | Description |
|--------|-------------|
| **Websites & Web Apps** | Custom sites and cross-platform apps, dashboards, internal tools, secure integrations, built for speed and scale. |
| **Design & User Experience** | Clean UI, smooth flows, mobile-first layouts, design systems, behavior-driven UX. |
| **Growth & Conversion** | SEO from day one, converting landing pages, messaging and CTAs, content for search and sales. |
| **Brand & Visual Design** | Logo and visual identity, colors/fonts/style systems, graphics for web and marketing, consistent design across pages. |

---

## Run locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm run start     # serve production build locally
# or: npm run preview  # build + start
```

---

## Project structure

- `app/(marketing)/`: Public pages (/, /blog, /services, /plans, /en-in/portfolio, /privacy-policy, /terms-of-service) — booking uses Google Calendar (see `lib/constants.ts`)
- `app/api/`: Auth callback, booking create
- `components/`: React components (marketing, booking)
- `lib/`: Supabase clients, auth, blog (markdown from `public/blogs/`), rate-limit
- `public/blogs/`: Markdown blog posts (frontmatter: title, date, excerpt)
- `supabase/migrations/`: DB schema
- `middleware.ts`: Geo-fence

---

## Site sections

- **Hero**: “Built on Belief. Deployed for Growth.” + pixel-art background
- **What We Do**: Engineering High-Performance Digital Experiences — four pillars (websites & apps, design & UX, growth & conversion, brand & visual design)
- **How We Build**: Strategy & Discovery, Design & Scope, Build & Integrate, Launch & Ongoing
- **Philosophy**: “Web development stays. Automation leads. Systems define the brand.”
- **Who We Are** / **Why Us** / **Our Work** / **Contact**: Company and offerings
