# GSC + Looker Studio Local Rank Tracking

This setup tracks location keyword performance for the first 30 published local pages and then scales to all 253 records.

## Data Sources

- Google Search Console property for production domain.
- Master sheet export at `data/seo/local-seo-master-sheet.csv`.
- Optional conversion export from analytics CRM.

## Build the Looker Studio dashboard

1. Connect GSC `Site Impression` table.
2. Connect `data/seo/local-seo-master-sheet.csv` as a file source.
3. Blend on page URL slug:
   - GSC Page contains `/en-in/local/<urlSlug>`.
   - Master sheet `urlSlug`.
4. Add dimensions:
   - `state`, `city`, `intent`, `keyword`, `page`.
5. Add metrics:
   - `impressions`, `clicks`, `ctr`, `averagePosition`.

## Required dashboard views

- **Launch Cohort**: 30 published pages only.
- **State and City View**: filter by `state` and `city`.
- **Intent View**: compare web agency vs web developer vs SEO company.
- **Winners and Losers**:
  - high impressions + low CTR.
  - high clicks + low conversions (from optional conversion data).

## Weekly operating checklist

1. Export last 7 days and prior 7 days from GSC.
2. Update dashboard filters to inspect:
   - pages with impressions > threshold and low CTR.
   - pages with strong CTR but weak conversion.
3. Add changes to annotation log (`docs/seo/local-seo-annotation-log.csv`).
4. Submit updated URLs in GSC URL inspection after metadata or on-page edits.

## Success criteria

- CTR trend improves for high-impression pages.
- Qualified lead conversion trend improves for top-click pages.
- Number of ranking pages expands beyond first 30 as draft pages are published.
