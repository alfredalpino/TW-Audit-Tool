import { BackToHomeLinkSm } from '@/components/BackToHomeLink';
import type { LegalDocumentContent } from '@/lib/i18n/legal-content';
import { localeByCode, type LocaleCode } from '@/lib/i18n/config';

type Props = {
  document: LegalDocumentContent;
  locale: LocaleCode;
};

export function LegalDocumentPage({ document, locale }: Props) {
  const dir = localeByCode[locale].direction;

  return (
    <main id="main-content" className="flex flex-col w-full pt-20 min-h-screen">
      <article
        dir={dir}
        className="container mx-auto px-6 md:px-12 max-w-3xl pt-12 md:pt-16 pb-20 md:pb-24"
      >
        <BackToHomeLinkSm />
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-torpedo-dark tracking-tight mb-3">
            {document.title}
          </h1>
          <p className="text-sm text-torpedo-gray">{document.lastUpdated}</p>
        </header>

        <div className="space-y-8 text-[var(--fg-primary)] leading-[1.75]">
          <p>{document.intro}</p>

          <section>
            <h2 className="text-xl font-semibold text-[var(--fg-primary)] mb-3">{document.scopeHeading}</h2>
            <p>{document.scopeBody}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--fg-primary)] mb-3">{document.collectHeading}</h2>
            <p>{document.collectBody}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--fg-primary)] mb-3">{document.rightsHeading}</h2>
            <p>{document.rightsBody}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--fg-primary)] mb-3">{document.contactHeading}</h2>
            <p>{document.contactBody}</p>
          </section>

          <p className="text-sm text-torpedo-gray border-t border-[var(--border-subtle)] pt-6">
            {document.authoritativeNotice}
          </p>
        </div>
      </article>
    </main>
  );
}
