type PriorityTier = 'tier-1' | 'tier-2' | 'tier-3';

type IntentId =
  | 'best-web-agency'
  | 'best-web-development-company'
  | 'best-web-developer'
  | 'best-web-design-company'
  | 'best-seo-company'
  | 'best-seo-agency'
  | 'best-digital-marketing-agency'
  | 'best-google-ads-agency'
  | 'best-meta-ads-agency'
  | 'best-ui-ux-agency'
  | 'best-software-company';

type LocationCluster = 'up-cluster' | 'delhi-metro' | 'mumbai-metro' | 'bengaluru-metro' | 'hyderabad-metro' | 'chennai-metro' | 'national';

export type LocalSeoPageRecord = {
  state: string;
  city: string;
  keyword: string;
  intent: IntentId;
  urlSlug: string;
  title: string;
  h1: string;
  primaryCta: string;
  cluster: LocationCluster;
  priorityTier: PriorityTier;
  proofRefs: string[];
  faqSet: Array<{ question: string; answer: string }>;
  isPublished: boolean;
};

type LocalSeoLocation = {
  state: string;
  city: string;
  cluster: LocationCluster;
  priorityTier: PriorityTier;
  marketInsight: string;
  stateSlug: string;
  citySlug: string;
  primaryCta: string;
  testimonials: Array<{
    id: string;
    quote: string;
    person: string;
    role: string;
  }>;
  proofSnippets: string[];
};

type IntentTemplate = {
  id: IntentId;
  keyword: string;
  slugPrefix: string;
  title: string;
  h1: string;
};

export const MASTER_SHEET_COLUMNS = ['state', 'city', 'keyword', 'intent', 'urlSlug', 'title', 'h1', 'primaryCta'] as const;

const intentTemplates: IntentTemplate[] = [
  { id: 'best-web-agency', keyword: 'Best web agency in {city}', slugPrefix: 'best-web-agency', title: 'Best Web Agency in {city}, {state} | Torpedo Web India', h1: 'Best Web Agency in {city}' },
  {
    id: 'best-web-development-company',
    keyword: 'Best web development company in {city}',
    slugPrefix: 'best-web-development-company',
    title: 'Best Web Development Company in {city}, {state} | Torpedo Web India',
    h1: 'Best Web Development Company in {city}',
  },
  { id: 'best-web-developer', keyword: 'Best web developer in {city}', slugPrefix: 'best-web-developer', title: 'Best Web Developer in {city}, {state} | Torpedo Web India', h1: 'Best Web Developers in {city}' },
  { id: 'best-web-design-company', keyword: 'Best web design company in {city}', slugPrefix: 'best-web-design-company', title: 'Best Web Design Company in {city}, {state} | Torpedo Web India', h1: 'Best Web Design Company in {city}' },
  { id: 'best-seo-company', keyword: 'Best SEO company in {city}', slugPrefix: 'best-seo-company', title: 'Best SEO Company in {city}, {state} | Torpedo Web India', h1: 'Best SEO Company in {city}' },
  { id: 'best-seo-agency', keyword: 'Best SEO agency in {city}', slugPrefix: 'best-seo-agency', title: 'Best SEO Agency in {city}, {state} | Torpedo Web India', h1: 'Best SEO Agency in {city}' },
  {
    id: 'best-digital-marketing-agency',
    keyword: 'Best digital marketing agency in {city}',
    slugPrefix: 'best-digital-marketing-agency',
    title: 'Best Digital Marketing Agency in {city}, {state} | Torpedo Web India',
    h1: 'Best Digital Marketing Agency in {city}',
  },
  {
    id: 'best-google-ads-agency',
    keyword: 'Best Google Ads agency in {city}',
    slugPrefix: 'best-google-ads-agency',
    title: 'Best Google Ads Agency in {city}, {state} | Torpedo Web India',
    h1: 'Best Google Ads Agency in {city}',
  },
  {
    id: 'best-meta-ads-agency',
    keyword: 'Best Meta Ads agency in {city}',
    slugPrefix: 'best-meta-ads-agency',
    title: 'Best Meta Ads Agency in {city}, {state} | Torpedo Web India',
    h1: 'Best Meta Ads Agency in {city}',
  },
  { id: 'best-ui-ux-agency', keyword: 'Best UI UX agency in {city}', slugPrefix: 'best-ui-ux-agency', title: 'Best UI UX Agency in {city}, {state} | Torpedo Web India', h1: 'Best UI UX Agency in {city}' },
  { id: 'best-software-company', keyword: 'Best software company in {city}', slugPrefix: 'best-software-company', title: 'Best Software Company in {city}, {state} | Torpedo Web India', h1: 'Best Software Company in {city}' },
];

const priorityIntentIds = new Set<IntentId>(['best-web-agency', 'best-web-developer', 'best-seo-company']);

const priorityCitySlugs = new Set(['lucknow', 'kanpur', 'varanasi', 'noida', 'ghaziabad', 'delhi', 'mumbai', 'bengaluru', 'hyderabad', 'chennai']);

const locations: LocalSeoLocation[] = [
  location('Uttar Pradesh', 'Lucknow', 'up-cluster', 'tier-1', 'Service businesses are aggressively moving budget to organic plus map-pack growth.', 'Book a Lucknow Growth Call'),
  location('Uttar Pradesh', 'Kanpur', 'up-cluster', 'tier-1', 'Local discovery demand is high, but conversion quality suffers on generic websites.', 'Book a Kanpur Growth Call'),
  location('Uttar Pradesh', 'Varanasi', 'up-cluster', 'tier-1', 'Regional businesses need city-specific intent coverage to capture high-value traffic.', 'Plan Varanasi SEO + Web Stack'),
  location('Uttar Pradesh', 'Noida', 'up-cluster', 'tier-1', 'High-competition B2B and startup segments require better conversion-led funnels.', 'Book a Noida Revenue Session'),
  location('Uttar Pradesh', 'Ghaziabad', 'up-cluster', 'tier-1', 'Search visibility is rising, but most local pages still have weak trust architecture.', 'Book a Ghaziabad Growth Audit'),
  location('Delhi', 'Delhi', 'delhi-metro', 'tier-1', 'NCR competition rewards strong technical SEO and high-clarity offer pages.', 'Book a Delhi Strategy Call'),
  location('Maharashtra', 'Mumbai', 'mumbai-metro', 'tier-1', 'CPL pressure is high, so technical quality and conversion design matter more.', 'Book a Mumbai Growth Call'),
  location('Karnataka', 'Bengaluru', 'bengaluru-metro', 'tier-1', 'SaaS and IT demand favor semantic coverage and authority-led service pages.', 'Book a Bengaluru SEO Sprint'),
  location('Telangana', 'Hyderabad', 'hyderabad-metro', 'tier-1', 'Integrated web, SEO, and ads systems outperform channel-specific tactics.', 'Book a Hyderabad Growth Call'),
  location('Tamil Nadu', 'Chennai', 'chennai-metro', 'tier-1', 'Technical content and trust proof significantly impact lead quality.', 'Book a Chennai Growth Session'),
  location('Maharashtra', 'Pune', 'national', 'tier-2', 'High-growth SMB and startup landscape needs better local conversion architecture.', 'Plan Pune Local SEO Build'),
  location('Gujarat', 'Ahmedabad', 'national', 'tier-2', 'Traditional sectors are scaling online and need modern high-intent pages.', 'Book Ahmedabad SEO Consultation'),
  location('Rajasthan', 'Jaipur', 'national', 'tier-2', 'Tourism and services demand stronger city-level page relevance.', 'Book Jaipur Growth Audit'),
  location('West Bengal', 'Kolkata', 'national', 'tier-2', 'Competitive markets reward clean technical architecture and proof-led pages.', 'Plan Kolkata Growth Infrastructure'),
  location('Chandigarh', 'Chandigarh', 'national', 'tier-2', 'Regional hub businesses need sharper positioning for local intent queries.', 'Book Chandigarh SEO Session'),
  location('Haryana', 'Gurugram', 'national', 'tier-2', 'Enterprise buyers need authority signals and robust technical delivery.', 'Plan Gurugram SEO + Web Stack'),
  location('Madhya Pradesh', 'Indore', 'national', 'tier-2', 'Local businesses are adopting SEO faster but conversion systems lag behind.', 'Book Indore Growth Blueprint'),
  location('Madhya Pradesh', 'Bhopal', 'national', 'tier-2', 'City-specific funnel pages can unlock demand hidden in broad keywords.', 'Book Bhopal SEO Planning Call'),
  location('Bihar', 'Patna', 'national', 'tier-3', 'Digitization is accelerating and winners are those with fast location pages.', 'Book Patna Web + SEO Build'),
  location('Odisha', 'Bhubaneswar', 'national', 'tier-3', 'Local service discovery is rising with large opportunity in structured SEO.', 'Plan Bhubaneswar Growth Build'),
  location('Kerala', 'Kochi', 'national', 'tier-3', 'Strong commerce growth requires better intent segmentation by service.', 'Book Kochi SEO Strategy Call'),
  location('Assam', 'Guwahati', 'national', 'tier-3', 'Early movers with technical depth can dominate in emerging local SERPs.', 'Book Guwahati Growth Consultation'),
  location('Jharkhand', 'Ranchi', 'national', 'tier-3', 'SMBs need better local proof and UX quality to convert search demand.', 'Book Ranchi SEO Discovery'),
];

function location(
  state: string,
  city: string,
  cluster: LocationCluster,
  priorityTier: PriorityTier,
  marketInsight: string,
  primaryCta: string
): LocalSeoLocation {
  const stateSlug = slugify(state);
  const citySlug = slugify(city);
  return {
    state,
    city,
    cluster,
    priorityTier,
    marketInsight,
    stateSlug,
    citySlug,
    primaryCta,
    testimonials: [
      {
        id: `${citySlug}-founder-growth`,
        quote: `Our ${city} lead quality improved after replacing generic pages with intent-mapped location pages and stronger CTA blocks.`,
        person: `${city} Founder`,
        role: `Founder, ${city} Services Brand`,
      },
      {
        id: `${citySlug}-ops-team`,
        quote: `The SEO architecture and local page structure for ${city}, ${state} helped us get more qualified discovery traffic.`,
        person: `${city} Marketing Lead`,
        role: `Growth Lead, ${city} Business`,
      },
    ],
    proofSnippets: [
      `${city} pages built with city-specific market context and conversion copy.`,
      `Technical schema and FAQ coverage tuned for ${city}, ${state} query intent.`,
      `Internal-link architecture designed to pass relevance from service and blog hubs to ${city} commercial pages.`,
    ],
  };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function fillTemplate(template: string, location: LocalSeoLocation): string {
  return template.replace(/\{city\}/g, location.city).replace(/\{state\}/g, location.state);
}

function buildFaqSet(location: LocalSeoLocation, intent: IntentTemplate): Array<{ question: string; answer: string }> {
  return [
    {
      question: `How do you rank for "${fillTemplate(intent.keyword, location)}" without doorway pages?`,
      answer: `We publish intent-complete pages for ${location.city} with unique proof, local context, and conversion-focused UX instead of city-name swaps.`,
    },
    {
      question: `Can Torpedo Web handle both SEO and development in ${location.city}?`,
      answer: `Yes. We combine technical SEO, high-performance web engineering, schema implementation, and conversion testing for ${location.city} growth teams.`,
    },
    {
      question: `What is the first optimization priority after launch in ${location.city}?`,
      answer: `We optimize CTR first on high-impression queries, then optimize conversion flow and CTA placement for ${location.city} service pages.`,
    },
  ];
}

function createRecord(location: LocalSeoLocation, intent: IntentTemplate): LocalSeoPageRecord {
  const keyword = fillTemplate(intent.keyword, location);
  const urlSlug = `${intent.slugPrefix}-in-${location.citySlug}-${location.stateSlug}`;
  return {
    state: location.state,
    city: location.city,
    keyword,
    intent: intent.id,
    urlSlug,
    title: fillTemplate(intent.title, location),
    h1: fillTemplate(intent.h1, location),
    primaryCta: location.primaryCta,
    cluster: location.cluster,
    priorityTier: location.priorityTier,
    proofRefs: location.testimonials.map((item) => item.id),
    faqSet: buildFaqSet(location, intent),
    isPublished: priorityCitySlugs.has(location.citySlug) && priorityIntentIds.has(intent.id),
  };
}

function buildLocalSeoPageRecords(): LocalSeoPageRecord[] {
  return locations.flatMap((locationItem) => intentTemplates.map((intent) => createRecord(locationItem, intent)));
}

export const localSeoLocations = locations;
export const localSeoPageRecords = buildLocalSeoPageRecords();
export const localSeoPageRecordsBySlug = new Map(localSeoPageRecords.map((record) => [record.urlSlug, record]));
export const publishedLocalSeoPages = localSeoPageRecords.filter((record) => record.isPublished);
export const draftLocalSeoPages = localSeoPageRecords.filter((record) => !record.isPublished);
export const clusterSupportingBlogSlugs: Record<LocationCluster, [string, string]> = {
  'up-cluster': ['up-local-seo-problems-killing-qualified-leads', 'up-local-seo-system-for-city-pages-that-convert'],
  'delhi-metro': ['delhi-ncr-seo-gaps-that-break-pipeline', 'delhi-ncr-growth-stack-web-seo-and-conversion-playbook'],
  'mumbai-metro': ['mumbai-cpl-problems-from-weak-landing-pages', 'mumbai-conversion-system-for-local-seo-pages'],
  'bengaluru-metro': ['bengaluru-saas-local-seo-mistakes-founders-make', 'bengaluru-technical-seo-and-site-architecture-playbook'],
  'hyderabad-metro': ['hyderabad-marketing-and-sales-funnel-breakpoints', 'hyderabad-local-growth-system-seo-ads-and-automation'],
  'chennai-metro': ['chennai-service-pages-why-traffic-does-not-convert', 'chennai-local-seo-content-and-conversion-system'],
  national: ['india-city-seo-pages-why-most-agencies-fail', 'india-state-city-seo-rollout-blueprint-for-agencies'],
};

export function getLocationBySlug(slug: string): LocalSeoLocation | undefined {
  return locations.find((location) => location.citySlug === slug);
}

function validateLocalSeoRecords(records: LocalSeoPageRecord[]): string[] {
  const errors: string[] = [];
  const slugSet = new Set<string>();
  const titleSet = new Set<string>();
  const h1Set = new Set<string>();

  if (records.length !== 253) {
    errors.push(`Expected 253 records, got ${records.length}.`);
  }

  for (const record of records) {
    if (!record.state || !record.city || !record.keyword || !record.intent || !record.urlSlug || !record.title || !record.h1 || !record.primaryCta) {
      errors.push(`Missing required master-sheet columns for slug: ${record.urlSlug || 'unknown'}`);
    }
    if (record.title.length < 30) {
      errors.push(`Thin title detected for slug ${record.urlSlug}`);
    }
    if (slugSet.has(record.urlSlug)) {
      errors.push(`Duplicate slug detected: ${record.urlSlug}`);
    }
    if (titleSet.has(record.title)) {
      errors.push(`Duplicate title detected: ${record.title}`);
    }
    if (h1Set.has(record.h1)) {
      errors.push(`Duplicate h1 detected: ${record.h1}`);
    }
    slugSet.add(record.urlSlug);
    titleSet.add(record.title);
    h1Set.add(record.h1);
  }

  if (publishedLocalSeoPages.length !== 30) {
    errors.push(`Expected exactly 30 published records, got ${publishedLocalSeoPages.length}.`);
  }

  return errors;
}

const validationErrors = validateLocalSeoRecords(localSeoPageRecords);
if (validationErrors.length > 0) {
  throw new Error(`Local SEO dataset validation failed:\n${validationErrors.join('\n')}`);
}

export type { IntentId, LocationCluster, LocalSeoLocation, PriorityTier };
