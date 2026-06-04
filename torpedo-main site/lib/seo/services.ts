export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceSeoData = {
  slug: string;
  name: string;
  /** Short card tagline shown under the title on /services */
  headline: string;
  h1: string;
  intro: string;
  /** Feature bullets or chips rendered on service cards */
  features: string[];
  /** Optional badge on the card (e.g. pricing model callout) */
  badge?: string;
  serviceType: string;
  deliverables: string[];
  faqs: ServiceFaq[];
  relatedCitySlugs: string[];
  relatedBlogSlugs: string[];
};

export const services: ServiceSeoData[] = [
  {
    slug: 'web-development',
    name: 'Web Development',
    headline: 'Fast, conversion-ready sites and web apps',
    h1: 'Web Development for High-Growth Businesses',
    intro:
      'We build fast, scalable websites and web apps engineered for organic visibility, conversion rate, and operational efficiency—from marketing sites to ecommerce storefronts.',
    features: [
      'Next.js and React architecture',
      'Ecommerce and checkout optimization',
      'Conversion-focused UX and page systems',
      'Core Web Vitals and analytics instrumentation',
    ],
    serviceType: 'Web Development',
    deliverables: [
      'Next.js website architecture',
      'Ecommerce storefront engineering',
      'Conversion-focused page systems',
      'Core Web Vitals optimization',
      'Analytics and event instrumentation',
    ],
    faqs: [
      {
        question: 'Do you build from scratch or use templates?',
        answer:
          'Both options are possible, but high-growth projects usually require custom architecture for speed, SEO, and conversion performance.',
      },
      {
        question: 'Can you migrate an existing website without traffic loss?',
        answer:
          'Yes. We use redirect maps, metadata parity checks, and structured QA to protect existing rankings during migrations.',
      },
      {
        question: 'Do you build ecommerce on Shopify or custom stacks?',
        answer:
          'Both. We choose based on growth stage, ownership requirements, and integration complexity—with SEO-safe migration when needed.',
      },
    ],
    relatedCitySlugs: ['lucknow', 'delhi', 'mumbai', 'bangalore', 'hyderabad', 'kanpur'],
    relatedBlogSlugs: [
      'web-development-growth-infrastructure-playbook-founders',
      'nextjs-seo-architecture-for-service-websites-2026',
      'website-speed-optimization-lucknow-why-slow-sites-lose-leads',
      'custom-website-vs-template-for-lead-generation-india',
      'design-systems-for-faster-website-iteration-practical-playbook',
      'ecommerce-website-development-kanpur-growth-playbook',
    ],
  },
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    headline: 'Ads, brand systems, and search that compound',
    h1: 'Digital Marketing: Ads, Branding, and SEO as One Growth Layer',
    intro:
      'We run paid media, brand systems, and technical SEO as one connected growth engine—so messaging, audiences, and measurement stay aligned from first click to qualified pipeline.',
    features: [
      'Meta and Google Ads with shared tracking',
      'Branding systems and trust signal architecture',
      'Technical SEO, schema, and local search clusters',
    ],
    serviceType: 'Digital Marketing',
    deliverables: [
      'Cross-channel Meta and Google Ads architecture',
      'Positioning, visual identity, and messaging frameworks',
      'Technical SEO audit and semantic content architecture',
      'Schema deployment and indexation optimization',
      'GA4, GTM, and conversion quality instrumentation',
    ],
    faqs: [
      {
        question: 'Do you manage Meta and Google together or separately?',
        answer:
          'We design them as one system so messaging, audiences, and measurement stay aligned. You can still phase rollout by channel if budget requires it.',
      },
      {
        question: 'Do you cover both local SEO and national SEO?',
        answer:
          'Yes. We implement city-level landing pages and national intent clusters in one connected architecture.',
      },
      {
        question: 'Can branding improve SEO performance too?',
        answer:
          'Yes. Stronger branded search demand and better CTR from branded SERP snippets often improve organic outcomes.',
      },
      {
        question: 'Can you run paid media alongside SEO?',
        answer:
          'Yes. We synchronize paid and organic targeting to reduce wasted spend and improve total SERP and funnel coverage.',
      },
    ],
    relatedCitySlugs: ['lucknow', 'noida', 'gurugram', 'pune', 'kolkata', 'mumbai', 'delhi', 'hyderabad'],
    relatedBlogSlugs: [
      'technical-seo-and-service-page-architecture-for-lead-quality',
      'technical-seo-checklist-india-2026-priority-fixes',
      'meta-ads-lead-generation-lucknow-quality-funnel',
      'google-ads-vs-meta-ads-local-smb-india-decision-guide',
      'website-trust-signals-that-boost-conversions-india',
      'build-marketing-moat-for-services-business-in-india',
    ],
  },
  {
    slug: 'custom-software',
    name: 'Custom Software',
    headline: 'Built for your ops — own it for life',
    badge: 'No subscription · EMI available',
    h1: 'Custom Software You Own — Billing, Ops, and Lead Systems',
    intro:
      'Billing, business management, lead management, internal ops, and data orchestration software built for life. No recurring subscription lock-in: totally on-demand, each feature implemented when you need it. Monthly payment (EMI) available — then good to go for life.',
    features: [
      'Billing and invoicing systems',
      'Lead and pipeline management',
      'Internal ops and admin dashboards',
      'Data orchestration and API integrations',
      'On-demand features — pay once, own forever',
    ],
    serviceType: 'Software Development',
    deliverables: [
      'Workflow and billing system architecture',
      'Lead management and CRM tooling',
      'Custom dashboards and admin tools',
      'API and integration engineering',
      'Security-first backend implementation',
    ],
    faqs: [
      {
        question: 'Is there a monthly subscription after launch?',
        answer:
          'No. We build software you own. You can add features on demand over time. Optional monthly EMI plans are available during build-out — after that, the system is yours for life.',
      },
      {
        question: 'Can I add features incrementally?',
        answer:
          'Yes. Each capability — billing, lead routing, reporting, integrations — can be scoped and implemented independently as your operations grow.',
      },
      {
        question: 'Is custom software suitable for SMBs?',
        answer:
          'Yes, when recurring process friction or tool sprawl is blocking growth and team velocity.',
      },
      {
        question: 'Do you support post-launch maintenance?',
        answer:
          'Yes. We provide structured maintenance and iteration on your terms — no forced subscription tiers.',
      },
    ],
    relatedCitySlugs: ['bangalore', 'hyderabad', 'delhi', 'pune', 'chennai', 'lucknow'],
    relatedBlogSlugs: [
      'building-scalable-web-apps-hyper-growth-ecommerce',
      'sales-marketing-handoff-system-smb-implementation',
      'growth-ops-for-small-service-businesses-india-playbook',
      'kpi-dashboard-for-founders-marketing-spend-operator-template',
    ],
  },
  {
    slug: 'ai-agents-automations',
    name: 'AI Agents and Automations',
    headline: 'Agents that qualify, route, and follow up',
    h1: 'AI Agents and Automations for Lead and Operations Workflow',
    intro:
      'We connect AI agents and automation workflows across lead capture, qualification, follow-ups, and reporting — reducing manual overhead and response time without replacing relationship-driven sales.',
    features: [
      'AI-assisted lead qualification and routing',
      'WhatsApp, email, and CRM workflow automations',
      'Operational reporting and alert systems',
      'Secure API integrations with your existing stack',
    ],
    serviceType: 'Business Process Automation',
    deliverables: [
      'AI agent design and deployment',
      'Lead routing and follow-up automation',
      'WhatsApp and CRM workflow integration',
      'AI-assisted content and ops pipelines',
      'Reporting automation dashboards',
    ],
    faqs: [
      {
        question: 'Can AI automation integrate with our existing CRM stack?',
        answer:
          'Yes. We design around your current stack first, then connect AI workflows through secure APIs and event triggers.',
      },
      {
        question: 'Will automation replace our sales team?',
        answer:
          'No. The goal is faster qualification and better handoff, not replacing relationship-driven sales work.',
      },
      {
        question: 'What kinds of tasks can AI agents handle?',
        answer:
          'Intake triage, FAQ responses, lead scoring, appointment scheduling, status updates, and internal ops alerts — scoped to your approval workflows.',
      },
    ],
    relatedCitySlugs: ['bangalore', 'hyderabad', 'mumbai', 'delhi', 'chennai', 'pune'],
    relatedBlogSlugs: [
      'lead-response-automation-systems-for-service-businesses',
      'lead-nurture-whatsapp-automation-uttar-pradesh',
      'whatsapp-marketing-funnel-india-lead-to-sale-system',
      'building-predictable-lead-pipeline-smb-operator-guide',
      'funnel-analytics-for-service-businesses-india-operator-guide',
    ],
  },
];

/** Permanent redirects from legacy service slugs to consolidated pages */
export const legacyServiceSlugRedirects: Record<string, string> = {
  seo: 'digital-marketing',
  branding: 'digital-marketing',
  'meta-google-ads': 'digital-marketing',
  'meta-ads': 'digital-marketing',
  'google-ads': 'digital-marketing',
  'ui-ux-design': 'digital-marketing',
  'ecommerce-development': 'web-development',
  'ai-automation': 'ai-agents-automations',
};

export const servicesBySlug = new Map(services.map((service) => [service.slug, service]));
