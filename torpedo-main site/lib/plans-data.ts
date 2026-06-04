/** Shared pricing tiers for PlansSection: USD (global) vs INR (India /en-in). */

export type PlanTier = {
  slug: string;
  name: string;
  priceRange: string;
  tag?: string;
  features: readonly string[];
  featured: boolean;
  ctaLabel: string;
};

export const PLANS_USD: PlanTier[] = [
  {
    slug: 'starter',
    name: 'Starter',
    priceRange: '$2,000+',
    tag: 'For early-stage founders',
    features: [
      'Marketing site built around your conversion goals',
      'Performance-first build',
      'Basic SEO structure',
      'Conversion-focused layout',
    ],
    featured: false,
    ctaLabel: 'Get Started',
  },
  {
    slug: 'growth',
    name: 'Growth',
    priceRange: '$3,500 – $6,500',
    features: [
      'Custom UI/UX system',
      'Full SEO architecture',
      'CMS integration',
      'Speed optimization (Core Web Vitals)',
      'Lead funnels',
    ],
    featured: true,
    ctaLabel: 'Get Started',
  },
  {
    slug: 'scale',
    name: 'Scale',
    priceRange: '$7,000 – $9,500+',
    features: [
      'Web app / complex builds',
      'Backend integrations',
      'Automation systems',
      'Advanced analytics + tracking',
      'Conversion engineering',
    ],
    featured: false,
    ctaLabel: 'Get Started',
  },
  {
    slug: 'retainer',
    name: 'Retainer',
    priceRange: '$100 – $1100/month',
    features: ['Maintenance', 'SEO iteration', 'Landing pages', 'A/B testing'],
    featured: false,
    ctaLabel: 'Book a Call',
  },
];

export const PLANS_INR: PlanTier[] = [
  {
    slug: 'starter',
    name: 'Starter',
    priceRange: '₹60,000 – ₹90,000',
    tag: 'For early-stage founders',
    features: [
      'Marketing site built around your conversion goals',
      'Performance-first build',
      'Basic SEO structure',
      'Conversion-focused layout',
    ],
    featured: false,
    ctaLabel: 'Get Started',
  },
  {
    slug: 'growth',
    name: 'Growth',
    priceRange: '₹1,20,000 – ₹2,00,000',
    features: [
      'Custom UI/UX system',
      'Full SEO architecture',
      'CMS integration',
      'Speed optimization (Core Web Vitals)',
      'Lead funnels',
    ],
    featured: true,
    ctaLabel: 'Get Started',
  },
  {
    slug: 'scale',
    name: 'Scale',
    priceRange: '₹2,50,000 – ₹5,00,000+',
    features: [
      'Web app / complex builds',
      'Backend integrations',
      'Automation systems',
      'Advanced analytics + tracking',
      'Conversion engineering',
    ],
    featured: false,
    ctaLabel: 'Get Started',
  },
  {
    slug: 'retainer',
    name: 'Retainer',
    priceRange: '₹15,000 – ₹60,000/month',
    features: ['Maintenance', 'SEO iteration', 'Landing pages', 'A/B testing'],
    featured: false,
    ctaLabel: 'Book a Call',
  },
];
