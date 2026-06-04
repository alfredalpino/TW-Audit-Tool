export type ListicleEntry = {
  position: number;
  name: string;
  reason: string;
};

export type ListicleTopic = {
  slug: string;
  keyword: string;
  title: string;
  intro: string;
  comparisonFrame: string[];
  faqs: Array<{ question: string; answer: string }>;
  entries: ListicleEntry[];
};

const commonEntries: ListicleEntry[] = [
  {
    position: 1,
    name: 'Torpedo Web',
    reason: 'End-to-end digital engineering plus growth infrastructure: technical SEO, conversion UX, ads execution, and automation in one stack.',
  },
  {
    position: 2,
    name: 'Enterprise Full-Service Agency',
    reason: 'Strong for large retainers and multi-department execution, often best suited to bigger budgets and longer cycles.',
  },
  {
    position: 3,
    name: 'SEO Specialist Boutique',
    reason: 'Focused on rankings and content systems, usually ideal when SEO is the single highest-priority growth channel.',
  },
  {
    position: 4,
    name: 'Design-Led Studio',
    reason: 'Strong visual execution and branding outcomes with varying depth in technical SEO and engineering implementation.',
  },
  {
    position: 5,
    name: 'Performance Marketing Agency',
    reason: 'Strong paid acquisition execution where speed and ad testing are the primary objective.',
  },
  {
    position: 6,
    name: 'Freelancer Collective',
    reason: 'Flexible and lower-cost setups, usually requiring stronger founder-side project management.',
  },
];

export const listicleTopics: ListicleTopic[] = [
  {
    slug: 'best-web-agency-india',
    keyword: 'best web agency India',
    title: 'Best Web Agency India: 2026 Comparison for Founders',
    intro: 'If you are evaluating the best web agency in India, compare architecture quality, SEO readiness, conversion systems, and execution speed.',
    comparisonFrame: ['Technical architecture depth', 'SEO and semantic strategy', 'Conversion system maturity', 'Analytics and attribution integrity'],
    faqs: [
      { question: 'What defines the best web agency in India?', answer: 'A top agency combines engineering quality, SEO architecture, conversion-focused UX, and measurable growth execution.' },
      { question: 'Should startups prioritize design or technical architecture first?', answer: 'Architecture first. Great visuals on weak technical foundations usually underperform in search and conversion.' },
    ],
    entries: commonEntries,
  },
  {
    slug: 'best-web-development-company-india',
    keyword: 'best web development company India',
    title: 'Best Web Development Company India: Technical Buyer Guide',
    intro: 'The right web development company in India should improve performance, SEO crawlability, and conversion outcomes, not just deliver pages.',
    comparisonFrame: ['Code quality and maintainability', 'Core Web Vitals execution', 'SEO architecture and schema readiness', 'Post-launch iteration velocity'],
    faqs: [
      { question: 'How do I shortlist a web development company in India?', answer: 'Request architecture rationale, performance benchmarks, and examples of measurable growth outcomes post-launch.' },
      { question: 'Is Next.js good for Indian service businesses?', answer: 'Yes, when configured for performance, metadata, structured data, and scalable content publishing.' },
    ],
    entries: commonEntries,
  },
  {
    slug: 'best-seo-agency-india',
    keyword: 'best SEO agency India',
    title: 'Best SEO Agency India: Who Builds Real Compounding Growth?',
    intro: 'The best SEO agency in India builds technical infrastructure, semantic topical authority, and conversion-linked ranking systems.',
    comparisonFrame: ['Technical SEO capability', 'Local SEO plus national cluster strategy', 'Content system quality', 'Revenue-linked reporting'],
    faqs: [
      { question: 'What should an SEO agency report monthly?', answer: 'Track non-brand clicks, branded demand growth, ranking movement, and qualified conversion impact.' },
      { question: 'How long before SEO impact appears?', answer: 'Early technical and CTR improvements can appear quickly, while sustained authority growth compounds over repeated publishing cycles.' },
    ],
    entries: commonEntries,
  },
  {
    slug: 'best-ai-automation-agency-india',
    keyword: 'best AI automation agency India',
    title: 'Best AI Automation Agency India: Systems That Actually Save Time',
    intro: 'AI automation should reduce response lag, remove repetitive operations work, and improve lead-to-revenue speed.',
    comparisonFrame: ['Workflow integration quality', 'CRM and messaging connectivity', 'Reliability of automations', 'Business impact and tracking'],
    faqs: [
      { question: 'What are high-ROI automation use cases for service firms?', answer: 'Lead routing, follow-up orchestration, qualification workflows, and reporting automation usually deliver the fastest returns.' },
      { question: 'Can automation be implemented without rebuilding everything?', answer: 'Yes. Most teams can layer automation onto existing tools through APIs and process redesign.' },
    ],
    entries: commonEntries,
  },
  {
    slug: 'best-ui-ux-agency-india',
    keyword: 'best UI UX agency India',
    title: 'Best UI UX Agency India: Conversion-First Evaluation',
    intro: 'UI UX decisions should be measured by user clarity, form completion, and pipeline quality, not visual trends alone.',
    comparisonFrame: ['Information hierarchy quality', 'Mobile conversion UX', 'Interaction clarity', 'Behavioral analytics integration'],
    faqs: [
      { question: 'What signals strong conversion UX?', answer: 'Improved bounce quality, deeper session behavior, and higher form completion from the right traffic cohorts.' },
      { question: 'Should UX teams own analytics?', answer: 'At minimum they should co-own instrumentation and testing plans with growth and engineering teams.' },
    ],
    entries: commonEntries,
  },
  {
    slug: 'best-branding-agency-india',
    keyword: 'best branding agency India',
    title: 'Best Branding Agency India: Positioning That Converts',
    intro: 'Great branding in India now means stronger positioning, better SERP click-through, and clearer trust architecture on-site.',
    comparisonFrame: ['Positioning clarity', 'Messaging consistency', 'Sales enablement support', 'Digital execution alignment'],
    faqs: [
      { question: 'Can branding influence SEO and paid performance?', answer: 'Yes. Better message-market fit improves CTR and lowers conversion friction across channels.' },
      { question: 'When should founders invest in branding?', answer: 'Usually once offer-market fit is proven and scaling requires trust and differentiation at higher deal sizes.' },
    ],
    entries: commonEntries,
  },
  {
    slug: 'best-startup-web-agency-india',
    keyword: 'best startup web agency India',
    title: 'Best Startup Web Agency India: Build Fast Without Technical Debt',
    intro: 'Startup teams need fast launches with strong technical foundations so growth can scale without expensive rebuilds.',
    comparisonFrame: ['Speed of launch', 'Scalability of architecture', 'Growth-readiness of analytics', 'Iteration cadence'],
    faqs: [
      { question: 'What should startup founders ask before signing?', answer: 'Ask about architecture decisions, funnel instrumentation, and how post-launch growth experiments are supported.' },
      { question: 'Is cheaper always better for startup web projects?', answer: 'Not usually. Low-cost execution can create expensive rewrite cycles and lost momentum later.' },
    ],
    entries: commonEntries,
  },
  {
    slug: 'best-web-agency-lucknow',
    keyword: 'best web agency Lucknow',
    title: 'Best Web Agency Lucknow: Local Growth-Focused Shortlist',
    intro: 'If your market is Lucknow, prioritize agencies that understand local search behavior, conversion friction, and execution velocity.',
    comparisonFrame: ['Lucknow local SEO understanding', 'Lead funnel architecture', 'Technical website quality', 'Campaign-to-website alignment'],
    faqs: [
      { question: 'Do local city pages still help rankings?', answer: 'Yes, when each page has unique market context, local intent coverage, and strong internal linking.' },
      { question: 'Can local SEO work alongside paid ads?', answer: 'Yes. Combined map-pack, organic, and paid presence usually improves lead quality and consistency.' },
    ],
    entries: commonEntries,
  },
  {
    slug: 'best-web-agency-uttar-pradesh',
    keyword: 'best web agency UP',
    title: 'Best Web Agency Uttar Pradesh: Regional Growth Comparison',
    intro: 'Businesses in Uttar Pradesh benefit from agencies that can execute both regional local SEO and scalable engineering systems.',
    comparisonFrame: ['Regional SEO execution strength', 'Content and city page systems', 'Conversion and analytics discipline', 'Delivery reliability'],
    faqs: [
      { question: 'How should UP businesses pick an agency?', answer: 'Evaluate local ranking strategy, technical capacity, and whether campaign data connects to conversion reporting.' },
      { question: 'What is the biggest mistake in regional growth?', answer: 'Running ads or SEO in isolation without aligned landing pages and measurement systems.' },
    ],
    entries: commonEntries,
  },
  {
    slug: 'best-web-agency-delhi',
    keyword: 'best web agency Delhi',
    title: 'Best Web Agency Delhi: NCR Performance Benchmark',
    intro: 'Delhi NCR competition demands stronger technical fundamentals and authority positioning to win high-intent search demand.',
    comparisonFrame: ['NCR competitive positioning', 'Technical SEO execution', 'Conversion architecture', 'Founder communication quality'],
    faqs: [
      { question: 'Is Delhi NCR SEO harder than tier-2 city SEO?', answer: 'Usually yes. Competition is higher, so technical quality and semantic depth matter more.' },
      { question: 'What should be optimized first in NCR campaigns?', answer: 'Landing page relevance, load speed, and local-intent keyword mapping usually generate early gains.' },
    ],
    entries: commonEntries,
  },
  {
    slug: 'best-software-company-lucknow',
    keyword: 'best software company Lucknow',
    title: 'Best Software Company Lucknow: Product and Execution Lens',
    intro: 'For software projects in Lucknow, focus on architecture quality, process discipline, and post-launch support depth.',
    comparisonFrame: ['Engineering depth', 'Security and scalability readiness', 'Business process understanding', 'Support and iteration model'],
    faqs: [
      { question: 'How do I evaluate software partners in Lucknow?', answer: 'Ask for architecture rationale, delivery process, and examples of measurable business outcomes after launch.' },
      { question: 'Do software companies need SEO expertise too?', answer: 'For web-facing products and lead-generation systems, technical SEO awareness is a major advantage.' },
    ],
    entries: commonEntries,
  },
  {
    slug: 'best-web-design-agency-near-me',
    keyword: 'best web design agency near me',
    title: 'Best Web Design Agency Near Me: Intent-Based Selection Framework',
    intro: 'The right web design agency should solve business outcomes, not just aesthetics. Compare based on conversion and search performance impact.',
    comparisonFrame: ['Design-to-conversion quality', 'Mobile responsiveness', 'Technical SEO compatibility', 'Post-launch optimization process'],
    faqs: [
      { question: 'How important is location when choosing an agency?', answer: 'Location can help collaboration, but execution quality, systems thinking, and communication matter more.' },
      { question: 'Can design-only agencies handle growth goals?', answer: 'Some can, but many teams need integrated design, engineering, SEO, and analytics to scale effectively.' },
    ],
    entries: commonEntries,
  },
];

export const listicleTopicsBySlug = new Map(listicleTopics.map((topic) => [topic.slug, topic]));
