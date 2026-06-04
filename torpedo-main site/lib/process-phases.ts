import type { LucideIcon } from 'lucide-react';
import Search from 'lucide-react/dist/esm/icons/search.js';
import Layers from 'lucide-react/dist/esm/icons/layers.js';
import PenTool from 'lucide-react/dist/esm/icons/pen-tool.js';
import Zap from 'lucide-react/dist/esm/icons/zap.js';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up.js';

export type ProcessPhase = {
  phaseLabel: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const PROCESS_PHASES: ProcessPhase[] = [
  {
    phaseLabel: 'Phase 1',
    title: 'Audit & Deconstruction',
    icon: Search,
    description:
      'Technical audit of assets, competitor context, and gap mapping across performance, UX, and conversion goals.',
  },
  {
    phaseLabel: 'Phase 2',
    title: 'Architecture & Strategy',
    icon: Layers,
    description:
      'IA, conversion-first wires, SEO hierarchy, and scalable system decisions. Not page-by-page guesswork.',
  },
  {
    phaseLabel: 'Phase 3',
    title: 'Design System & UI',
    icon: PenTool,
    description:
      'High-fidelity UI, a real design system (type, spacing, components), and prototypes when the flow needs them.',
  },
  {
    phaseLabel: 'Phase 4',
    title: 'Build & Optimization',
    icon: Zap,
    description: 'Modern stack build, Core Web Vitals, CMS and integrations, plus responsive and cross-browser QA.',
  },
  {
    phaseLabel: 'Phase 5',
    title: 'Launch & Scale',
    icon: TrendingUp,
    description: 'Ship with QA, analytics, CRO, and an iteration roadmap. Launch is the start of improvement.',
  },
];
