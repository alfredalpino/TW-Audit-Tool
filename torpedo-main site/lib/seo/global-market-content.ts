import { type LocaleCode } from '@/lib/i18n/config';
import {
  type GlobalMarket,
  type GlobalMarketId,
  type GlobalServiceSlug,
  globalMarketsById,
  serviceLabel,
} from '@/lib/seo/global-markets';

export type ContentSection = {
  heading: string;
  paragraphs: string[];
};

export type ProgrammaticPageContent = {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  intro: string;
  sections: ContentSection[];
  faqs: Array<{ question: string; answer: string }>;
};

function resolveLocale(locale: LocaleCode, market: GlobalMarket): LocaleCode {
  if (market.contentLocales.includes(locale)) return locale;
  if (market.contentLocales.includes(market.primaryLocale)) return market.primaryLocale;
  return 'en-US';
}

type LocaleContentMap = Partial<Record<LocaleCode, ProgrammaticPageContent>>;

const marketContent: Record<GlobalMarketId, LocaleContentMap> = {
  france: {
    'fr-FR': {
      eyebrow: 'Marché France',
      h1: 'Ingénierie web et infrastructure de croissance pour les entreprises françaises',
      metaTitle: 'Agence web France | Développement, SEO & automatisation | Torpedo Web',
      metaDescription:
        'Torpedo Web accompagne les entreprises françaises avec des sites performants, du SEO technique et des systèmes d’automatisation IA — en conformité RGPD.',
      intro:
        'Les acheteurs B2B en France comparent la crédibilité de votre marque, la vitesse mobile et la clarté RGPD avant de remplir un formulaire. Nous concevons des sites Next.js, des architectures sémantiques et des parcours de conversion qui transforment la recherche organique en pipeline qualifié — sans pages génériques ni promesses creuses.',
      sections: [
        {
          heading: 'Contexte local',
          paragraphs: [
            'Les PME et ETI françaises opèrent souvent sur WordPress, Shopify ou des stacks hybrides héritées. Les équipes marketing veulent des preuves de performance (Core Web Vitals, taux de conversion, clics non-brand) alors que les directions juridiques exigent des bannières cookies et des traitements de données documentés.',
            'Nous adaptons l’information architecture aux requêtes françaises : intention transactionnelle sur des services professionnels, comparaisons « agence + ville », et contenus de confiance (études de cas, certifications, processus de delivery).',
          ],
        },
        {
          heading: 'Livrables orientés résultats',
          paragraphs: [
            'Audit technique SEO et cartographie sémantique pour capter la demande à forte intention.',
            'Refonte ou migration vers une architecture rapide (Next.js) avec redirections et parité métadonnées.',
            'Automatisations IA pour qualification de leads, enrichissement CRM et reporting opérationnel.',
            'Tableaux de bord analytics avec consentement granulaire compatible CNIL.',
          ],
        },
        {
          heading: 'Conformité & confiance',
          paragraphs: [
            'Chaque projet intègre des notices RGPD, des catégories de consentement et des DPA lorsque des outils tiers traitent des données personnelles. Pour les secteurs réglementés (finance, santé, industrie), nous structurons FAQ schema, pages preuve et parcours de contact à faible friction.',
            'Notre équipe opère depuis l’Inde et les États-Unis avec des processus documentés — idéal pour les groupes français qui externalisent l’ingénierie tout en gardant un interlocuteur stratégique en anglais ou en français.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Travaillez-vous en français avec des équipes basées en France ?',
          answer:
            'Oui. Les livrables clés (arborescence, métadonnées, FAQ) peuvent être rédigés en français. Les ateliers techniques se font en français ou en anglais selon vos parties prenantes.',
        },
        {
          question: 'Comment gérez-vous le RGPD sur les sites que vous livrez ?',
          answer:
            'Nous configurons le consentement, minimisons les données collectées, documentons les finalités et alignons les tags analytics sur les choix utilisateur.',
        },
        {
          question: 'Pouvez-vous migrer un site existant sans perte SEO ?',
          answer:
            'Oui. Plan de redirections, contrôle des canonicals, tests d’indexation et monitoring post-lancement font partie du runbook standard.',
        },
      ],
    },
    'en-US': {
      eyebrow: 'France market',
      h1: 'Web engineering and growth infrastructure for French companies',
      metaTitle: 'France Web Agency | Development, SEO & AI Automation | Torpedo Web',
      metaDescription:
        'Torpedo Web helps French businesses ship fast websites, technical SEO, and GDPR-aware automation systems.',
      intro:
        'French buyers evaluate brand credibility, mobile performance, and GDPR clarity before they submit a lead form. We build Next.js sites, semantic architectures, and conversion paths that turn organic search into qualified pipeline.',
      sections: [
        {
          heading: 'Local business context',
          paragraphs: [
            'French SMEs and mid-market firms often run legacy WordPress or hybrid stacks. Marketing teams want Core Web Vitals proof and non-brand click growth; legal teams require documented consent and data processing.',
            'We map information architecture to French search intent—professional services, geo-modified agency queries, and trust content that supports longer B2B cycles.',
          ],
        },
        {
          heading: 'Delivery focus',
          paragraphs: [
            'Technical SEO audits and semantic clustering for high-intent demand.',
            'Performance migrations with redirect maps and metadata parity.',
            'AI automation for lead qualification, CRM enrichment, and reporting.',
            'Analytics with granular consent aligned to EU expectations.',
          ],
        },
        {
          heading: 'Compliance posture',
          paragraphs: [
            'RGPD notices, consent categories, and vendor DPAs are part of the default implementation—not bolt-ons. Regulated sectors receive FAQ schema, proof pages, and low-friction contact flows.',
            'We operate from India and the US with documented delivery—suited to French groups that offshore engineering while keeping strategic oversight.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Do you deliver French-language SEO assets?',
          answer: 'Yes. Metadata, FAQs, and core landing copy can be authored in French with English engineering documentation.',
        },
        {
          question: 'How do you protect rankings during migrations?',
          answer: 'Redirect maps, canonical checks, indexation monitoring, and staged releases reduce traffic risk.',
        },
        {
          question: 'Can you integrate with our existing CRM?',
          answer: 'Yes. We connect forms, webhooks, and automation layers to HubSpot, Salesforce, Pipedrive, and custom stacks.',
        },
      ],
    },
  },
  germany: {
    'en-US': {
      eyebrow: 'Germany market',
      h1: 'Web development and technical SEO for German B2B growth teams',
      metaTitle: 'Germany Web Development & SEO | Torpedo Web',
      metaDescription:
        'Engineering-grade websites and technical SEO for German Mittelstand, SaaS, and industrial suppliers.',
      intro:
        'German procurement favors reliability, documentation, and measurable performance. Torpedo Web ships maintainable Next.js architectures, compound-keyword SEO systems, and analytics setups that respect TTDSG-conscious defaults—so your site earns trust before the first sales call.',
      sections: [
        {
          heading: 'Why German buyers are different',
          paragraphs: [
            'Industrial and professional-services firms research vendors deeply. They expect Impressum-ready structures, precise service pages, and proof of operational discipline—not generic agency templates.',
            'We align technical SEO with German compound queries, industry verticals, and regional modifiers (Munich, Hamburg, Stuttgart) without creating doorway pages.',
          ],
        },
        {
          heading: 'What we implement',
          paragraphs: [
            'Performance budgets and Core Web Vitals remediation on existing stacks.',
            'Semantic internal linking between services, industries, and proof content.',
            'Schema for Organization, Service, FAQ, and Breadcrumb where it improves clarity.',
            'Lead flows with explicit purpose statements and minimal data collection.',
          ],
        },
        {
          heading: 'Operating model',
          paragraphs: [
            'Delivery is documented in English with optional German copy support through partners. India/US engineering gives cost efficiency; US entity supports international contracting.',
            'Engagements typically start with a technical audit, a 90-day roadmap, and a phased build that keeps marketing live during migration.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Do you provide German-language content?',
          answer: 'We deliver English-first engineering docs and can coordinate German copy for customer-facing pages.',
        },
        {
          question: 'Can you meet EU hosting expectations?',
          answer: 'We recommend EU-region deployments and document data flows for your legal review.',
        },
        {
          question: 'How do you measure SEO impact?',
          answer: 'Rank tracking, non-brand clicks, and qualified conversions by landing page—not vanity impressions.',
        },
      ],
    },
  },
  mexico: {
    'es-MX': {
      eyebrow: 'Mercado México',
      h1: 'Desarrollo web, SEO técnico y automatización para empresas en México',
      metaTitle: 'Agencia web México | Desarrollo, SEO e IA | Torpedo Web',
      metaDescription:
        'Sitios rápidos, SEO técnico y automatización con IA para marcas en CDMX, Monterrey y Guadalajara.',
      intro:
        'En México, la conversión depende de velocidad móvil, confianza visual y handoffs claros hacia WhatsApp o ventas internas. Construimos sitios Next.js, arquitectura SEO en español (México) y automatizaciones que reducen fricción entre marketing y revenue.',
      sections: [
        {
          heading: 'Contexto del mercado',
          paragraphs: [
            'Las pymes y scale-ups mexicanas invierten en Meta y Google Ads, pero muchas descuidan SEO técnico y deuda de performance. Eso encarece cada lead pagado.',
            'Alineamos contenido a intención local: servicios profesionales, manufactura, logística, educación y SaaS B2B con copy en español mexicano—not Spanglish templates.',
          ],
        },
        {
          heading: 'Entregables',
          paragraphs: [
            'Auditoría técnica SEO + mapa de clusters semánticos.',
            'Sitios o migraciones con Core Web Vitals y tracking de conversiones.',
            'Automatización IA para calificación de leads y reportes operativos.',
            'Formularios compatibles con LFPDPPP y opt-in de marketing.',
          ],
        },
        {
          heading: 'Cómo trabajamos',
          paragraphs: [
            'Kickoff remoto, blueprint de conversión y releases por fases para no apagar campañas activas.',
            'Equipo India/EE.UU. con contratos internacionales y soporte en inglés o español según tu equipo.',
          ],
        },
      ],
      faqs: [
        {
          question: '¿Pueden optimizar para búsquedas en Ciudad de México y Monterrey?',
          answer: 'Sí. Usamos páginas de mercado y clusters semánticos sin duplicar contenido doorway.',
        },
        {
          question: '¿Integran WhatsApp y CRM?',
          answer: 'Sí. Conectamos CTAs, webhooks y automatizaciones con tu stack comercial.',
        },
        {
          question: '¿Migran sitios WordPress sin perder tráfico?',
          answer: 'Sí, con redirecciones 301, paridad de metadatos y monitoreo post-lanzamiento.',
        },
      ],
    },
    'en-US': {
      eyebrow: 'Mexico market',
      h1: 'Web development, SEO, and AI automation for Mexican growth brands',
      metaTitle: 'Mexico Web Agency | Development, SEO & Automation | Torpedo Web',
      metaDescription:
        'Fast websites, technical SEO, and AI automation for Mexico City, Monterrey, and Guadalajara businesses.',
      intro:
        'Mexican conversion paths depend on mobile speed, trust design, and clean handoffs to WhatsApp or inside sales. We ship Next.js sites, Spanish (Mexico) SEO architecture, and automation that connects marketing to revenue.',
      sections: [
        {
          heading: 'Market context',
          paragraphs: [
            'Teams invest heavily in paid social but underfund technical SEO and performance debt—raising CAC over time.',
            'We target high-intent Spanish queries for professional services, logistics, education, and B2B SaaS without doorway duplication.',
          ],
        },
        {
          heading: 'Delivery',
          paragraphs: [
            'Technical SEO audits and semantic clustering.',
            'Performance builds with conversion instrumentation.',
            'AI automation for lead qualification and reporting.',
            'LFPDPPP-aware forms and marketing opt-in.',
          ],
        },
        {
          heading: 'Engagement model',
          paragraphs: [
            'Remote kickoff, conversion blueprint, and phased releases that keep campaigns running.',
            'India/US engineering with international contracting and bilingual stakeholder support.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Do you support Spanish (Mexico) copy?',
          answer: 'Yes. Customer-facing pages and metadata can be authored in es-MX.',
        },
        {
          question: 'Can you integrate WhatsApp CTAs?',
          answer: 'Yes. We wire mobile-first CTAs and tracking into your CRM workflow.',
        },
        {
          question: 'How fast can we launch?',
          answer: 'Timeline depends on scope; most engagements start with a two-week technical audit.',
        },
      ],
    },
  },
  switzerland: {
    'de-CH': {
      eyebrow: 'Schweiz Markt',
      h1: 'Webentwicklung und technisches SEO für Schweizer B2B-Unternehmen',
      metaTitle: 'Webagentur Schweiz | Entwicklung & SEO | Torpedo Web',
      metaDescription:
        'Premium-Websites, technisches SEO und mehrsprachige Strukturen für Zürich, Genf und Basel.',
      intro:
        'Schweizer Käufer erwarten Präzision, diskrete Premium-Ästhetik und belastbare Performance. Wir liefern Next.js-Architekturen, DE/FR-ready Strukturen und Schema-Systeme für regulierte Branchen.',
      sections: [
        {
          heading: 'Lokaler Kontext',
          paragraphs: [
            'Finanz-, Medtech- und Industrieanbieter benötigen vertrauenswürdige Informationsarchitektur—not generic templates.',
            'Wir vermeiden Duplicate Content zwischen Sprachvarianten mit hreflang, klarer Canonical-Strategie und sauberer interner Verlinkung.',
          ],
        },
        {
          heading: 'Leistungen',
          paragraphs: [
            'Technisches SEO für deutsch- und französischsprachige Suchintention.',
            'Performance-Optimierung für mobile Nutzung in urbanen Märkten.',
            'FAQ- und Service-Schema für rich results.',
          ],
        },
        {
          heading: 'Compliance',
          paragraphs: [
            'Datenschutzhinweise nach Schweizer Erwartungen, mehrsprachige Legal-Footer und dokumentierte Datenflüsse für internationale Stakeholder.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Unterstützen Sie Deutsch und Französisch?',
          answer: 'Ja. Struktur und SEO-Systeme sind bilingual ausgelegt; Copy kann koordiniert werden.',
        },
        {
          question: 'Hosting in der EU/Schweiz?',
          answer: 'Wir empfehlen Regionen nach Ihren juristischen Vorgaben und dokumentieren Subprozessoren.',
        },
        {
          question: 'Wie starten Projekte?',
          answer: 'Mit technischem Audit, Roadmap und phasenweiser Umsetzung.',
        },
      ],
    },
    'fr-CH': {
      eyebrow: 'Marché Suisse',
      h1: 'Développement web et SEO technique pour entreprises suisses',
      metaTitle: 'Agence web Suisse | Développement & SEO | Torpedo Web',
      metaDescription:
        'Sites premium, SEO technique et structures bilingues pour Zurich, Genève et Bâle.',
      intro:
        'Les acheteurs suisses exigent précision, discrétion et performance mesurable. Nous livrons des architectures Next.js, des structures prêtes pour le bilinguisme et des systèmes de schema adaptés aux secteurs réglementés.',
      sections: [
        {
          heading: 'Contexte',
          paragraphs: [
            'Finance, medtech et industrie de précision nécessitent des preuves crédibles et une IA claire—not des pages génériques.',
            'Hreflang, canonicals et maillage interne évitent la duplication entre variantes linguistiques.',
          ],
        },
        {
          heading: 'Livrables',
          paragraphs: [
            'SEO technique pour intentions DE/FR.',
            'Optimisation mobile et Core Web Vitals.',
            'FAQ et Service schema pour résultats enrichis.',
          ],
        },
        {
          heading: 'Conformité',
          paragraphs: [
            'Mentions légales multilingues, notices de confidentialité et documentation des flux de données pour parties prenantes internationales.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Travaillez-vous en français en Suisse ?',
          answer: 'Oui, avec structures bilingues et copy FR/DE selon vos marchés cantonaux.',
        },
        {
          question: 'Pouvez-vous migrer sans perte SEO ?',
          answer: 'Oui, via redirections, tests d’indexation et monitoring post-lancement.',
        },
        {
          question: 'Quel est le premier livrable ?',
          answer: 'Un audit technique et une feuille de route priorisée sur 90 jours.',
        },
      ],
    },
    'en-US': {
      eyebrow: 'Switzerland market',
      h1: 'Web development and technical SEO for Swiss B2B brands',
      metaTitle: 'Switzerland Web Agency | Development & SEO | Torpedo Web',
      metaDescription:
        'Premium websites, technical SEO, and bilingual-ready structures for Zurich, Geneva, and Basel firms.',
      intro:
        'Swiss buyers expect precision, discreet premium design, and reliable performance. We deliver Next.js architectures, DE/FR-ready structures, and schema systems for regulated industries.',
      sections: [
        {
          heading: 'Local context',
          paragraphs: [
            'Finance, medtech, and precision manufacturing need credible IA—not generic templates.',
            'Hreflang, canonical strategy, and internal linking prevent duplicate-language traps.',
          ],
        },
        {
          heading: 'Delivery',
          paragraphs: [
            'Technical SEO for German and French search intent.',
            'Mobile performance optimization for urban buyers.',
            'FAQ and Service schema for rich results.',
          ],
        },
        {
          heading: 'Compliance',
          paragraphs: [
            'Privacy notices aligned with Swiss expectations, multilingual legal footers, and documented data flows for international stakeholders.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Do you support German and French?',
          answer: 'Yes. Structures are bilingual-ready; copy can be coordinated per canton.',
        },
        {
          question: 'Can you migrate without SEO loss?',
          answer: 'Yes—redirect maps, indexation checks, and post-launch monitoring.',
        },
        {
          question: 'How do engagements start?',
          answer: 'With a technical audit and a prioritized 90-day roadmap.',
        },
      ],
    },
  },
  turkey: {
    'tr-TR': {
      eyebrow: 'Türkiye pazarı',
      h1: 'Web geliştirme, teknik SEO ve yapay zeka otomasyonu — Türkiye',
      metaTitle: 'Türkiye web ajansı | Geliştirme, SEO ve otomasyon | Torpedo Web',
      metaDescription:
        'Hızlı siteler, Türkçe SEO mimarisi ve KVKK bilinçli otomasyonlar için İstanbul ve Ankara odaklı büyüme.',
      intro:
        'Türkiye’de mobil hız, Türkçe içerik kalitesi ve güven sinyalleri dönüşümü belirler. Next.js altyapıları, semantik SEO ve operasyonel otomasyonlarla pazarlama ile satış arasındaki boşluğu kapatıyoruz.',
      sections: [
        {
          heading: 'Yerel iş bağlamı',
          paragraphs: [
            'Pazaryeri satıcıları ve çok şubeli işletmeler hızlı deneme yapar; ancak sürdürülebilir SEO ve bakımı kolay web yığınlarına yatırım eksiktir.',
            'Yüksek niyetli Türkçe sorgular için hizmet kümeleri, SSS schema ve iç linkleme kuruyoruz—kapı sayfası üretmeden.',
          ],
        },
        {
          heading: 'Teslimatlar',
          paragraphs: [
            'Teknik SEO denetimi ve içerik kümeleme.',
            'Core Web Vitals odaklı performans iyileştirmeleri.',
            'Lead nitelendirme ve raporlama için yapay zeka otomasyonu.',
            'KVKK uyumlu formlar ve açık rıza metinleri.',
          ],
        },
        {
          heading: 'Çalışma modeli',
          paragraphs: [
            'Uzak kickoff, dönüşüm planı ve kampanyaları durdurmadan fazlı yayınlar.',
            'Hindistan/ABD mühendisliği ile uluslararası sözleşme ve iki dilli paydaş desteği.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Türkçe SEO metinleri sağlıyor musunuz?',
          answer: 'Evet. Müşteri yüzeyi Türkçe; teknik dokümantasyon İngilizce olabilir.',
        },
        {
          question: 'WhatsApp ve CRM entegrasyonu var mı?',
          answer: 'Evet. CTA, webhook ve otomasyon katmanlarını bağlarız.',
        },
        {
          question: 'Mevcut siteyi taşıyabilir misiniz?',
          answer: 'Evet. 301 yönlendirmeleri ve meta paritesi ile trafik riskini azaltırız.',
        },
      ],
    },
    'en-US': {
      eyebrow: 'Türkiye market',
      h1: 'Web development, technical SEO, and AI automation for Türkiye',
      metaTitle: 'Türkiye Web Agency | Development, SEO & Automation | Torpedo Web',
      metaDescription:
        'Fast sites, Turkish SEO architecture, and KVKK-aware automation for Istanbul and Ankara growth teams.',
      intro:
        'In Türkiye, mobile speed, Turkish copy quality, and trust signals drive conversion. We ship Next.js infrastructure, semantic SEO, and operational automation that connects marketing to sales.',
      sections: [
        {
          heading: 'Local context',
          paragraphs: [
            'Marketplace sellers and multi-branch operators experiment quickly but under-invest in durable SEO and maintainable stacks.',
            'We build service clusters, FAQ schema, and internal links for high-intent Turkish queries—without doorway pages.',
          ],
        },
        {
          heading: 'Delivery',
          paragraphs: [
            'Technical SEO audits and clustering.',
            'Core Web Vitals improvements.',
            'AI automation for lead qualification and reporting.',
            'KVKK-aware forms and consent copy.',
          ],
        },
        {
          heading: 'Operating model',
          paragraphs: [
            'Remote kickoff, conversion blueprint, and phased releases.',
            'India/US engineering with international contracting and bilingual stakeholder support.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Do you provide Turkish SEO copy?',
          answer: 'Yes. Customer-facing surfaces can be Turkish with English engineering docs.',
        },
        {
          question: 'Can you integrate CRM and WhatsApp?',
          answer: 'Yes. We wire CTAs, webhooks, and automation into your commercial stack.',
        },
        {
          question: 'Do you handle migrations safely?',
          answer: 'Yes—with 301 maps, metadata parity, and post-launch monitoring.',
        },
      ],
    },
  },
  uae: {
    'ar-AE': {
      eyebrow: 'سوق الإمارات',
      h1: 'تطوير المواقع وتحسين محركات البحث للشركات في الإمارات',
      metaTitle: 'وكالة ويب الإمارات | تطوير وSEO | Torpedo Web',
      metaDescription:
        'مواقع سريعة، بنية SEO ثنائية اللغة وأتمتة ذكية لشركات دبي وأبوظبي.',
      intro:
        'في الإمارات، يُقيَّم العميل الموقع خلال ثوانٍ: سرعة الجوال، الثقة البصرية، ووضوح اللغة العربية/الإنجليزية. نبني تجارب RTL، SEO تقني، ومسارات تحويل تربط البحث بالمبيعات.',
      sections: [
        {
          heading: 'سياق السوق',
          paragraphs: [
            'القطاعات المهنية، العقارية، والضيافة تحتاج مواقع ثنائية اللغة مع CTAs واضحة وواتساب أو اتصال.',
            'نربط الصفحات عبر مجموعات دلالية دون صفحات مكررة ضعيفة.',
          ],
        },
        {
          heading: 'مخرجات العمل',
          paragraphs: [
            'تدقيق SEO تقني وبنية محتوى عربية/إنجليزية.',
            'تحسين Core Web Vitals للشبكات المحمولة في الخليج.',
            'مخططات Schema للخدمات والأسئلة الشائعة.',
          ],
        },
        {
          heading: 'الامتثال',
          paragraphs: [
            'جمع بيانات متوافق مع PDPL، هوية تجارية واضحة، وروابط قانونية ثنائية اللغة.',
          ],
        },
      ],
      faqs: [
        {
          question: 'هل تدعمون العربية وRTL؟',
          answer: 'نعم. التخطيط RTL مع نسخ إنجليزية احتياطية حسب الجمهور.',
        },
        {
          question: 'هل يمكن ربط CRM؟',
          answer: 'نعم. نماذج، webhooks، وأتمتة مع أنظمتكم.',
        },
        {
          question: 'كيف تبدأ المشاريع؟',
          answer: 'بتدقيق تقني وخارطة طريق لـ90 يوماً.',
        },
      ],
    },
    'en-US': {
      eyebrow: 'UAE market',
      h1: 'Web development and technical SEO for UAE businesses',
      metaTitle: 'UAE Web Agency | Development & SEO | Torpedo Web',
      metaDescription:
        'Fast bilingual sites, technical SEO, and PDPL-aware lead flows for Dubai and Abu Dhabi firms.',
      intro:
        'UAE buyers judge credibility in seconds—mobile speed, bilingual polish, and clear CTAs must work together. We build RTL-ready experiences, technical SEO, and conversion paths that connect search to revenue.',
      sections: [
        {
          heading: 'Market context',
          paragraphs: [
            'Professional services, real estate, and hospitality need Arabic/English surfaces with WhatsApp or call handoffs.',
            'Semantic clusters and internal links replace thin doorway duplication.',
          ],
        },
        {
          heading: 'Delivery',
          paragraphs: [
            'Technical SEO audits and bilingual IA.',
            'Core Web Vitals tuning for Gulf mobile networks.',
            'Service and FAQ schema for rich results.',
          ],
        },
        {
          heading: 'Compliance',
          paragraphs: [
            'PDPL-conscious collection, clear entity identification, and bilingual legal links.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Do you support Arabic RTL?',
          answer: 'Yes—with English fallbacks where your audience requires it.',
        },
        {
          question: 'Can you integrate CRM?',
          answer: 'Yes. Forms, webhooks, and automation connect to your stack.',
        },
        {
          question: 'How do projects start?',
          answer: 'With a technical audit and a 90-day prioritized roadmap.',
        },
      ],
    },
  },
  'saudi-arabia': {
    'en-US': {
      eyebrow: 'Saudi Arabia market',
      h1: 'Enterprise web systems and SEO for Saudi growth organizations',
      metaTitle: 'Saudi Arabia Web Development & SEO | Torpedo Web',
      metaDescription:
        'Vision 2030-aligned web engineering, technical SEO, and maintainable stacks for Riyadh, Jeddah, and Dammam.',
      intro:
        'Saudi organizations expect enterprise-grade web systems—not brochure sites. We deliver performance-proof Next.js builds, technical SEO for commercial queries, and documentation that satisfies multi-stakeholder procurement.',
      sections: [
        {
          heading: 'Local context',
          paragraphs: [
            'B2B services, industrial suppliers, and professional firms need clarity, speed, and credible proof—not generic agency pages.',
            'We structure English-first experiences with optional Arabic expansion paths when you are ready.',
          ],
        },
        {
          heading: 'Delivery',
          paragraphs: [
            'Technical SEO for Riyadh, Jeddah, and Dammam intent clusters.',
            'Performance migrations with analytics and conversion instrumentation.',
            'Schema and FAQ systems that improve SERP clarity.',
          ],
        },
        {
          heading: 'Compliance & contracting',
          paragraphs: [
            'PDPL-conscious lead capture, clear entity details for cross-border contracts, and documented data flows for legal review.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Do you support Arabic content?',
          answer: 'We launch English-first and can add Arabic surfaces in a phased roadmap.',
        },
        {
          question: 'Can you work with enterprise procurement?',
          answer: 'Yes. Deliverables include documentation, milestones, and measurable KPIs.',
        },
        {
          question: 'How do you measure SEO?',
          answer: 'Qualified conversions by landing page, non-brand clicks, and rank shifts for target clusters.',
        },
      ],
    },
  },
  russia: {
    'ru-RU': {
      eyebrow: 'Рынок России',
      h1: 'Веб-разработка и техническое SEO для российского B2B',
      metaTitle: 'Веб-агентство Россия | Разработка и SEO | Torpedo Web',
      metaDescription:
        'Быстрые сайты, русскоязычное SEO и автоматизация для Москвы и региональных компаний.',
      intro:
        'Российские B2B-покупатели глубоко изучают поставщиков до заявки. Мы создаём быстрые Next.js-стеки, русскоязычную семантику и schema, которые усиливают доверие и снижают зависимость от тяжёлых сторонних скриптов.',
      sections: [
        {
          heading: 'Локальный контекст',
          paragraphs: [
            'Компании часто совмещают устаревшие CMS и рекламу без устойчивого SEO. Это удорожает лид.',
            'Кластеры услуг, FAQ и внутренние ссылки строятся под высокоинтентные русские запросы — без doorway-страниц.',
          ],
        },
        {
          heading: 'Поставка',
          paragraphs: [
            'Технический SEO-аудит и кластеризация.',
            'Оптимизация Core Web Vitals.',
            'Автоматизация лидов и отчётности (по запросу).',
          ],
        },
        {
          heading: 'Доверие и комплаенс',
          paragraphs: [
            'Политики конфиденциальности, юридические контакты и прозрачные потоки данных для международных стейкхолдеров.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Пишете ли вы тексты на русском?',
          answer: 'Да. Клиентские страницы и метаданные могут быть на русском; техдоки — на английском.',
        },
        {
          question: 'Делаете ли миграции без потери трафика?',
          answer: 'Да: 301, каноникалы и мониторинг после запуска.',
        },
        {
          question: 'Как начинается проект?',
          answer: 'С технического аудита и 90-дневного плана.',
        },
      ],
    },
    'en-US': {
      eyebrow: 'Russia market',
      h1: 'Web development and technical SEO for Russian B2B brands',
      metaTitle: 'Russia Web Agency | Development & SEO | Torpedo Web',
      metaDescription:
        'Fast sites, Russian-language SEO, and automation for Moscow and regional commercial teams.',
      intro:
        'Russian B2B buyers research deeply before outreach. We ship fast Next.js stacks, Russian semantic architecture, and schema that builds trust while reducing heavy third-party script bloat.',
      sections: [
        {
          heading: 'Local context',
          paragraphs: [
            'Teams often combine legacy CMS with ads but under-invest in durable SEO—raising lead cost.',
            'Service clusters, FAQ schema, and internal links target high-intent Russian queries without doorway duplication.',
          ],
        },
        {
          heading: 'Delivery',
          paragraphs: [
            'Technical SEO audits and clustering.',
            'Core Web Vitals optimization.',
            'Optional lead automation and reporting layers.',
          ],
        },
        {
          heading: 'Trust',
          paragraphs: [
            'Privacy policies, legal contacts, and transparent data flows for international stakeholders.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Do you author Russian copy?',
          answer: 'Yes for customer-facing pages; engineering docs can remain English.',
        },
        {
          question: 'Safe migrations?',
          answer: 'Yes—301 maps, canonical checks, and post-launch monitoring.',
        },
        {
          question: 'How do we start?',
          answer: 'Technical audit plus a 90-day prioritized roadmap.',
        },
      ],
    },
  },
};

function serviceContentTemplate(
  market: GlobalMarket,
  service: GlobalServiceSlug,
  locale: LocaleCode,
): ProgrammaticPageContent {
  const svc = serviceLabel(service, locale);
  const marketName = market.name;

  const localized: Partial<Record<LocaleCode, ProgrammaticPageContent>> = {
    'fr-FR': {
      eyebrow: `${svc} · France`,
      h1: `${svc} pour entreprises en France`,
      metaTitle: `${svc} France | Torpedo Web`,
      metaDescription: `${svc} orienté performance, RGPD et conversion pour entreprises françaises.`,
      intro: `Nous déployons ${svc.toLowerCase()} pour des marques françaises qui ont besoin de vitesse, de clarté RGPD et de preuves mesurables — pas de livrables génériques.`,
      sections: [
        {
          heading: 'Pourquoi ce marché',
          paragraphs: [
            `En France, la demande sur « ${svc.toLowerCase()} » est souvent comparative et exigeante. Les acheteurs vérifient stack technique, références et conformité avant de booker un call.`,
            market.businessContext,
          ],
        },
        {
          heading: 'Notre approche',
          paragraphs: [
            'Audit technique, blueprint de conversion, puis implémentation par phases.',
            'Maillage interne vers pages marché et études de cas pour renforcer l’autorité topique.',
            'Tableaux de bord KPI : trafic qualifié, leads, Core Web Vitals.',
          ],
        },
        {
          heading: 'Prochaine étape',
          paragraphs: [
            'Réservez un appel découverte pour cadrer périmètre, conformité et calendrier de release.',
          ],
        },
      ],
      faqs: [
        { question: `Quel délai pour ${svc.toLowerCase()} ?`, answer: 'Selon périmètre ; la plupart des missions démarrent par un audit de deux semaines.' },
        { question: 'Livrez-vous en français ?', answer: 'Oui pour les surfaces client ; la documentation technique peut être en anglais.' },
        { question: 'Intégration CRM ?', answer: 'Oui — HubSpot, Salesforce, Pipedrive et webhooks custom.' },
      ],
    },
    'es-MX': {
      eyebrow: `${svc} · México`,
      h1: `${svc} para empresas en México`,
      metaTitle: `${svc} México | Torpedo Web`,
      metaDescription: `${svc} con enfoque móvil, SEO y conversión para marcas mexicanas.`,
      intro: `Implementamos ${svc.toLowerCase()} para equipos en México que necesitan velocidad, SEO en español y handoffs claros a ventas.`,
      sections: [
        {
          heading: 'Contexto',
          paragraphs: [market.businessContext, `La intención de búsqueda para ${svc.toLowerCase()} en ${marketName} exige confianza y performance medible.`],
        },
        {
          heading: 'Entrega',
          paragraphs: [
            'Auditoría, roadmap de 90 días y releases por fases.',
            'Enlaces internos hacia hubs de mercado y servicios relacionados.',
            'Medición por leads calificados y clics no-brand.',
          ],
        },
        {
          heading: 'Siguiente paso',
          paragraphs: ['Agenda una llamada de descubrimiento para definir alcance y cronograma.'],
        },
      ],
      faqs: [
        { question: '¿Copy en español (México)?', answer: 'Sí, para páginas públicas y metadatos.' },
        { question: '¿WhatsApp/CRM?', answer: 'Sí, integramos CTAs y automatización.' },
        { question: '¿Migraciones?', answer: 'Sí, con 301 y monitoreo post-lanzamiento.' },
      ],
    },
    'tr-TR': {
      eyebrow: `${svc} · Türkiye`,
      h1: `${svc} — Türkiye için`,
      metaTitle: `${svc} Türkiye | Torpedo Web`,
      metaDescription: `${svc} mobil performans, Türkçe SEO ve ölçülebilir dönüşüm için.`,
      intro: `${marketName} ekipleri için ${svc.toLowerCase()} : hız, Türkçe SEO ve satışa net handoff.`,
      sections: [
        { heading: 'Bağlam', paragraphs: [market.businessContext] },
        { heading: 'Teslimat', paragraphs: ['Teknik denetim, 90 günlük yol haritası, fazlı yayın.', 'İç linkleme ve KPI panelleri.'] },
        { heading: 'Sonraki adım', paragraphs: ['Keşif görüşmesi planlayın.'] },
      ],
      faqs: [
        { question: 'Türkçe içerik?', answer: 'Evet.' },
        { question: 'CRM?', answer: 'Evet.' },
        { question: 'Migrasyon?', answer: 'Evet, güvenli 301 ile.' },
      ],
    },
    'ar-AE': {
      eyebrow: `${svc} · الإمارات`,
      h1: `${svc} للشركات في الإمارات`,
      metaTitle: `${svc} الإمارات | Torpedo Web`,
      metaDescription: `${svc} بأداء عالٍ وSEO ثنائي اللغة لدبي وأبوظبي.`,
      intro: `ننفّذ ${svc} للشركات في الإمارات مع RTL، SEO تقني، ومسارات تحويل واضحة.`,
      sections: [
        { heading: 'السياق', paragraphs: [market.businessContext] },
        { heading: 'التسليم', paragraphs: ['تدقيق تقني، خطة 90 يوماً، إطلاق تدريجي.', 'روابط داخلية ولوحات KPI.'] },
        { heading: 'التالي', paragraphs: ['احجز مكالمة استكشافية.'] },
      ],
      faqs: [
        { question: 'هل تدعمون العربية؟', answer: 'نعم مع إنجليزية عند الحاجة.' },
        { question: 'CRM؟', answer: 'نعم.' },
        { question: 'الترحيل؟', answer: 'نعم مع مراقبة ما بعد الإطلاق.' },
      ],
    },
    'ru-RU': {
      eyebrow: `${svc} · Россия`,
      h1: `${svc} для компаний в России`,
      metaTitle: `${svc} Россия | Torpedo Web`,
      metaDescription: `${svc} с упором на скорость, русскоязычное SEO и измеримую конверсию.`,
      intro: `${svc} для российского B2B: быстрый стек, семантика и доверие до первой заявки.`,
      sections: [
        { heading: 'Контекст', paragraphs: [market.businessContext] },
        { heading: 'Поставка', paragraphs: ['Аудит, дорожная карта, поэтапные релизы.', 'Внутренние ссылки и KPI.'] },
        { heading: 'Дальше', paragraphs: ['Запланируйте discovery-call.'] },
      ],
      faqs: [
        { question: 'Русские тексты?', answer: 'Да.' },
        { question: 'CRM?', answer: 'Да.' },
        { question: 'Миграции?', answer: 'Да, с 301 и мониторингом.' },
      ],
    },
    'de-CH': {
      eyebrow: `${svc} · Schweiz`,
      h1: `${svc} für Unternehmen in der Schweiz`,
      metaTitle: `${svc} Schweiz | Torpedo Web`,
      metaDescription: `${svc} mit Premium-Performance und technischem SEO für CH.`,
      intro: `${svc} für Schweizer B2B: präzise Umsetzung, messbare Performance, bilingual-ready.`,
      sections: [
        { heading: 'Kontext', paragraphs: [market.businessContext] },
        { heading: 'Lieferung', paragraphs: ['Audit, Roadmap, phasenweise Releases.', 'Interne Verlinkung und KPI-Dashboards.'] },
        { heading: 'Nächster Schritt', paragraphs: ['Discovery-Call buchen.'] },
      ],
      faqs: [
        { question: 'DE/FR Copy?', answer: 'Struktur bilingual; Copy nach Bedarf.' },
        { question: 'CRM?', answer: 'Ja.' },
        { question: 'Migration?', answer: 'Ja, mit Monitoring.' },
      ],
    },
  };

  const fallback: ProgrammaticPageContent = {
    eyebrow: `${svc} · ${marketName}`,
    h1: `${svc} for ${marketName} growth teams`,
    metaTitle: `${svc} ${marketName} | Torpedo Web`,
    metaDescription: `Performance-focused ${svc.toLowerCase()} for ${marketName} businesses—technical SEO, speed, and measurable conversion.`,
    intro: `We implement ${svc.toLowerCase()} for ${marketName} organizations that need speed, credible proof, and clean handoffs to sales—not generic deliverables.`,
    sections: [
      {
        heading: 'Why this market',
        paragraphs: [
          `Buyers searching for ${svc.toLowerCase()} in ${marketName} compare vendors carefully. They expect stack clarity, case proof, and compliance posture before booking a call.`,
          market.businessContext,
        ],
      },
      {
        heading: 'Our approach',
        paragraphs: [
          'Technical audit, conversion blueprint, phased implementation.',
          'Internal links to market hubs and related services for topical authority.',
          'KPI dashboards: qualified traffic, leads, Core Web Vitals.',
        ],
      },
      {
        heading: 'Next step',
        paragraphs: ['Book a discovery call to scope compliance, timeline, and release plan.'],
      },
    ],
    faqs: [
      { question: `How long for ${svc.toLowerCase()}?`, answer: 'Scope-dependent; most engagements start with a two-week audit.' },
      { question: 'CRM integration?', answer: 'Yes—HubSpot, Salesforce, Pipedrive, and custom webhooks.' },
      { question: 'Migration support?', answer: 'Yes—with 301 maps and post-launch monitoring.' },
    ],
  };

  return localized[locale] ?? localized[market.primaryLocale] ?? fallback;
}

export function getMarketPageContent(marketId: GlobalMarketId, locale: LocaleCode): ProgrammaticPageContent {
  const market = globalMarketsById.get(marketId);
  if (!market) throw new Error(`Unknown market: ${marketId}`);
  const resolved = resolveLocale(locale, market);
  const map = marketContent[marketId];
  const content = map[resolved] ?? map[market.primaryLocale] ?? map['en-US'];
  if (!content) throw new Error(`No content for market ${marketId}`);
  return content;
}

export function getServiceMarketPageContent(
  marketId: GlobalMarketId,
  service: GlobalServiceSlug,
  locale: LocaleCode,
): ProgrammaticPageContent {
  const market = globalMarketsById.get(marketId);
  if (!market) throw new Error(`Unknown market: ${marketId}`);
  const resolved = resolveLocale(locale, market);
  return serviceContentTemplate(market, service, resolved);
}
