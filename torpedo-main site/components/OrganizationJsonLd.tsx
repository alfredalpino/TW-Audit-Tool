import {
  buildIndiaLocalBusiness,
  buildOrganization,
  buildUSLocalBusiness,
  buildWebSite,
} from '@/lib/seo/schema';

const graph = [buildOrganization(), buildWebSite(), buildUSLocalBusiness(), buildIndiaLocalBusiness()];

export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

