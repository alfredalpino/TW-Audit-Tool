import Link from 'next/link';
import type { InternalLink } from '@/lib/i18n/internal-links';

type Props = {
  title?: string;
  markets?: InternalLink[];
  services?: InternalLink[];
  showServicesHeading?: boolean;
  showMarketsHeading?: boolean;
};

export function ProgrammaticInternalLinks({
  title = 'Explore related pages',
  markets = [],
  services = [],
  showServicesHeading = true,
  showMarketsHeading = true,
}: Props) {
  if (markets.length === 0 && services.length === 0) return null;

  return (
    <section className="mt-14 rounded-xl border border-gray-200 bg-white p-6 md:p-8" aria-labelledby="internal-links-heading">
      <h2 id="internal-links-heading" className="mb-6 text-xl font-semibold text-torpedo-dark">
        {title}
      </h2>
      <div className="grid gap-8 md:grid-cols-2">
        {markets.length > 0 && (
          <div>
            {showMarketsHeading && (
              <h3 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-torpedo-orange">
                Markets
              </h3>
            )}
            <ul className="space-y-2 text-sm text-torpedo-gray">
              {markets.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="font-medium text-torpedo-dark transition hover:text-torpedo-orange">
                    {item.label}
                  </Link>
                  {item.description ? (
                    <span className="mt-0.5 block text-xs text-torpedo-gray">{item.description}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        )}
        {services.length > 0 && (
          <div>
            {showServicesHeading && (
              <h3 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-torpedo-orange">
                Services by market
              </h3>
            )}
            <ul className="space-y-2 text-sm text-torpedo-gray">
              {services.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="font-medium text-torpedo-dark transition hover:text-torpedo-orange">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
