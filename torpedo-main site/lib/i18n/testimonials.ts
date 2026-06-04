import type { LocaleCode } from '@/lib/i18n/config';

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
  metric: string;
};

const proofUS: Testimonial[] = [
  {
    quote:
      'Our previous site looked good but didn\'t convert. After the rebuild, demo bookings increased by ~35% within the first month.',
    author: 'Founder',
    role: 'SaaS Startup',
    company: 'San Francisco',
    metric: '~35% more demo bookings in 30 days',
  },
  {
    quote:
      'They approached the project like engineers, not designers. Everything from load speed to funnel flow was optimized for revenue.',
    author: 'CEO',
    role: 'Ecommerce Brand',
    company: 'Austin',
    metric: 'Sub-2.5s LCP on core templates; checkout completion up ~20%',
  },
  {
    quote: 'We cut page load time from 5.2s to under 2s. That alone had a measurable impact on paid ad performance.',
    author: 'Growth Lead',
    role: 'D2C Brand',
    company: 'New York',
    metric: '5.2s → sub-2s; paid efficiency lift',
  },
  {
    quote:
      'We needed a partner who could own performance end-to-end. Conversion tracking finally matched revenue reality.',
    author: 'VP Growth',
    role: 'B2B SaaS',
    company: 'Seattle',
    metric: 'MQL-to-SQL velocity up ~25% in <30 days',
  },
];

const proofIN: Testimonial[] = [
  {
    quote:
      'We were losing leads due to a slow, outdated website. Within 3 weeks of launch, inbound conversions improved by ~28%.',
    author: 'Founder',
    role: 'D2C Brand',
    company: 'Mumbai',
    metric: '~28% inbound conversion lift in 3 weeks',
  },
  {
    quote:
      'Most agencies focus on design. These guys fixed our entire funnel architecture. The site now loads under 2 seconds.',
    author: 'Owner',
    role: 'Local Service Business',
    company: 'Delhi NCR',
    metric: 'Lead-to-call rate up ~32%; organic leads up ~40% in 90 days',
  },
  {
    quote:
      'Clear communication, fast execution, and no unnecessary complexity. Backend automation saved us 10–12 hours per week.',
    author: 'Co-Founder',
    role: 'Startup',
    company: 'Bangalore',
    metric: '10–12 hrs / week ops time returned',
  },
  {
    quote:
      'Patients book online now. Hindi + English flows and faster mobile LCP made search actually deliver consults.',
    author: 'Practice Manager',
    role: 'Multi-location Clinic',
    company: 'Hyderabad',
    metric: 'Online booked consults +41% QoQ; mobile bounce down ~29%',
  },
];

const proofMX: Testimonial[] = [
  {
    quote:
      'El sitio anterior se veía bien pero no convertía. Tras el rediseño, las solicitudes de demo subieron ~32% en el primer mes.',
    author: 'Fundador',
    role: 'SaaS B2B',
    company: 'Ciudad de México',
    metric: '~32% más demos en 30 días',
  },
  {
    quote:
      'Trataron el proyecto como ingeniería, no solo diseño. Velocidad, SEO técnico y embudo alineados a ingresos.',
    author: 'Directora',
    role: 'Marca D2C',
    company: 'Monterrey',
    metric: 'LCP <2.5s; checkout +18% en 6 semanas',
  },
  {
    quote:
      'Pasamos de 5.1s a menos de 2s de carga. Eso solo ya mejoró el rendimiento de campañas pagadas.',
    author: 'Head of Growth',
    role: 'Ecommerce',
    company: 'Guadalajara',
    metric: '5.1s → sub-2s; ROAS estable al escalar',
  },
];

const proofFR: Testimonial[] = [
  {
    quote:
      'Notre ancien site était joli mais ne convertissait pas. Après la refonte, les demandes de démo ont augmenté d\'environ 30% le premier mois.',
    author: 'Fondatrice',
    role: 'SaaS B2B',
    company: 'Paris',
    metric: '~30% de demandes en plus en 30 jours',
  },
  {
    quote:
      'Approche d\'ingénierie, pas de slides. Performance, SEO technique et parcours de conversion pensés pour le chiffre d\'affaires.',
    author: 'CEO',
    role: 'Marque e-commerce',
    company: 'Lyon',
    metric: 'LCP <2.5s ; complétion checkout +17%',
  },
  {
    quote:
      'Conformité RGPD intégrée dès le départ — consentement, analytics, pages légales — sans ralentir les releases.',
    author: 'Head of Product',
    role: 'FinTech',
    company: 'Paris',
    metric: 'Remédiation audit -40% ; cadence bihebdomadaire rétablie',
  },
];

const proofDE: Testimonial[] = [
  {
    quote:
      'Die alte Website wirkte premium, konvertierte aber nicht. Nach dem Relaunch stiegen qualifizierte Anfragen um ~28% im ersten Monat.',
    author: 'Gründer',
    role: 'B2B SaaS',
    company: 'Zürich',
    metric: '~28% mehr qualifizierte Anfragen in 30 Tagen',
  },
  {
    quote:
      'Technisches SEO, Core Web Vitals und Funnel-Architektur aus einer Hand — endlich messbare Pipeline statt Vanity-Metriken.',
    author: 'CEO',
    role: 'E-Commerce',
    company: 'Basel',
    metric: 'LCP <2.4s; Checkout-Abschluss +19%',
  },
];

const proofFI: Testimonial[] = [
  {
    quote:
      'Edellinen sivusto näytti hyvältä mutta ei konvertoinut. Uudelleenrakennuksen jälkeen demopyynnöt nousivat ~29 % ensimmäisen kuukauden aikana.',
    author: 'Perustaja',
    role: 'B2B SaaS',
    company: 'Helsinki',
    metric: '~29 % enemmän demoja 30 päivässä',
  },
  {
    quote:
      'Lähestyivät projektia insinööreinä, ei vain designereina. Nopeus, tekninen SEO ja suppilo linjassa liikevaihdon kanssa.',
    author: 'Toimitusjohtaja',
    role: 'Verkkokauppa',
    company: 'Tampere',
    metric: 'LCP <2,4 s; checkout +18 % 6 viikossa',
  },
  {
    quote:
      'GDPR-yhteensopiva analytiikka ja suostumusvirrat valmiina — ilman että julkaisutahti hidastui.',
    author: 'Tuotepäällikkö',
    role: 'FinTech',
    company: 'Espoo',
    metric: 'Audit-korjaukset -38 %; kaksiviikkoinen release-tahti palautui',
  },
];

const proofSE: Testimonial[] = [
  {
    quote:
      'Den gamla webbplatsen såg bra ut men konverterade inte. Efter ombyggnaden ökade demo-förfrågningar ~30 % första månaden.',
    author: 'Grundare',
    role: 'B2B SaaS',
    company: 'Stockholm',
    metric: '~30 % fler demos på 30 dagar',
  },
  {
    quote:
      'De behandlade projektet som ingenjörskonst, inte bara design. Hastighet, teknisk SEO och funnel i linje med intäkter.',
    author: 'VD',
    role: 'E-handel',
    company: 'Göteborg',
    metric: 'LCP <2,4 s; checkout +17 % på 6 veckor',
  },
  {
    quote:
      'GDPR-anpassad analytics och samtyckesflöden från dag ett — utan att sakta ner releaser.',
    author: 'Produktchef',
    role: 'FinTech',
    company: 'Malmö',
    metric: 'Audit-åtgärder -36 %; biweekly release-takt återställd',
  },
];

const proofIT: Testimonial[] = [
  {
    quote:
      'Il vecchio sito sembrava professionale ma non convertiva. Dopo il rebuild, le richieste demo sono aumentate del ~32% nel primo mese.',
    author: 'Fondatore',
    role: 'B2B SaaS',
    company: 'Milano',
    metric: '~32% più demo in 30 giorni',
  },
  {
    quote:
      'Hanno trattato il progetto come ingegneria, non solo design. Velocità, SEO tecnico e funnel allineati al fatturato.',
    author: 'CEO',
    role: 'E-commerce',
    company: 'Roma',
    metric: 'LCP <2,4 s; checkout +17% in 6 settimane',
  },
  {
    quote:
      'Analytics conforme GDPR e flussi di consenso pronti dal giorno uno — senza rallentare le release.',
    author: 'Product Lead',
    role: 'FinTech',
    company: 'Torino',
    metric: 'Correzioni audit -37%; ritmo biweekly ripristinato',
  },
];

const proofTR: Testimonial[] = [
  {
    quote:
      'Eski sitemiz yavaştı ve mobilde dönüşüm düşüktü. Yenilemeden sonra form gönderimleri ilk ayda ~34% arttı.',
    author: 'Kurucu',
    role: 'B2B SaaS',
    company: 'İstanbul',
    metric: 'İlk ay ~34% daha fazla form gönderimi',
  },
  {
    quote:
      'Teknik SEO, hız ve dönüşüm mimarisi birlikte ele alındı. Reklam verimliliği ve organik trafik birlikte yükseldi.',
    author: 'Growth Lead',
    role: 'D2C Marka',
    company: 'Ankara',
    metric: '5.0s → 1.9s; paid ROAS stabil',
  },
];

const proofRU: Testimonial[] = [
  {
    quote:
      'Старый сайт выглядел солидно, но не конвертировал. После перезапуска заявки выросли примерно на 29% за первый месяц.',
    author: 'Основатель',
    role: 'B2B SaaS',
    company: 'Москва',
    metric: '~29% больше заявок за 30 дней',
  },
  {
    quote:
      'Подошли как инженеры: скорость, техническое SEO и воронка — всё под выручку, а не под «красивую презентацию».',
    author: 'CEO',
    role: 'E-commerce',
    company: 'Санкт-Петербург',
    metric: 'LCP <2.5s; конверсия checkout +16%',
  },
];

const proofAE: Testimonial[] = [
  {
    quote:
      'الموقع السابق كان بطيئاً على الجوال. بعد إعادة البناء، ارتفعت طلبات الحجز بنسبة ~31% خلال الشهر الأول.',
    author: 'مؤسس',
    role: 'علامة D2C',
    company: 'دبي',
    metric: '~31% زيادة في الحجوزات خلال 30 يوماً',
  },
  {
    quote:
      'دمجوا الأداء والـ SEO التقني وتجربة التحويل — وواجهة عربية/إنجليزية بدون التضحية بالسرعة.',
    author: 'مدير التسويق',
    role: 'خدمات محلية',
    company: 'أبوظبي',
    metric: 'LCP أقل من 2.3 ثانية؛ ارتداد الجوال -27%',
  },
];

const proofJA: Testimonial[] = [
  {
    quote:
      '以前のサイトは見た目は良いがコンバージョンしませんでした。再構築後、初月でデモ予約が約34%増加しました。',
    author: '創業者',
    role: 'B2B SaaS',
    company: '東京',
    metric: '30日でデモ予約 ~34% 増',
  },
  {
    quote:
      'デザイン会社ではなくエンジニアリングとして取り組んでくれました。表示速度からファネルまで、売上に直結する設計です。',
    author: 'CEO',
    role: 'D2Cブランド',
    company: '大阪',
    metric: 'LCP 2.5秒未満；チェックアウト完了率 +19%',
  },
];

const proofZHCN: Testimonial[] = [
  {
    quote:
      '旧网站加载慢、线索流失严重。上线三周内，站内转化提升约 30%。',
    author: '创始人',
    role: 'D2C 品牌',
    company: '上海',
    metric: '3 周内站内转化 ~30% 提升',
  },
  {
    quote:
      '他们把项目当工程而非美工。从技术 SEO 到转化漏斗，全部围绕收入设计。',
    author: '增长负责人',
    role: 'B2B SaaS',
    company: '深圳',
    metric: 'LCP 低于 2.4 秒；MQL 转化 +22%',
  },
];

const proofZHHK: Testimonial[] = [
  {
    quote:
      '舊網站載入慢、線索流失嚴重。上線三週內，站內轉化提升約 30%。',
    author: '創辦人',
    role: 'D2C 品牌',
    company: '香港',
    metric: '3 週內站內轉化 ~30% 提升',
  },
  {
    quote:
      '佢哋將項目當工程而唔係美工。由技術 SEO 到轉化漏斗，全部圍繞收入設計。',
    author: '增長負責人',
    role: 'B2B SaaS',
    company: '中環',
    metric: 'LCP 低於 2.4 秒；MQL 轉化 +22%',
  },
];

const proofKO: Testimonial[] = [
  {
    quote:
      '이전 사이트는 예뻤지만 전환이 안 됐습니다. 재구축 후 첫 달 데모 예약이 약 33% 증가했습니다.',
    author: '창업자',
    role: 'B2B SaaS',
    company: '서울',
    metric: '30일 내 데모 예약 ~33% 증가',
  },
  {
    quote:
      '디자인이 아니라 엔지니어링으로 접근했습니다. 로딩 속도부터 퍼널까지 매출에 맞춰 최적화했습니다.',
    author: 'CEO',
    role: 'D2C 브랜드',
    company: '판교',
    metric: 'LCP 2.5초 미만；결제 완료율 +17%',
  },
];

const TESTIMONIALS_BY_LOCALE: Partial<Record<LocaleCode, Testimonial[]>> = {
  'en-US': proofUS,
  'en-IN': proofIN,
  'es-MX': proofMX,
  'fr-FR': proofFR,
  'fr-MA': proofFR,
  'fr-CH': proofFR,
  'de-CH': proofDE,
  'fi-FI': proofFI,
  'sv-SE': proofSE,
  'it-IT': proofIT,
  'tr-TR': proofTR,
  'ru-RU': proofRU,
  'ar-AE': proofAE,
  'ja-JP': proofJA,
  'zh-CN': proofZHCN,
  'zh-HK': proofZHHK,
  'ko-KR': proofKO,
};

export function getTestimonialsForLocale(locale: LocaleCode): Testimonial[] {
  return TESTIMONIALS_BY_LOCALE[locale] ?? proofUS;
}
