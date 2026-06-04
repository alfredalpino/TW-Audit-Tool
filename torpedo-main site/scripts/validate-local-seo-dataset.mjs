import { localSeoPageRecords, publishedLocalSeoPages } from '../lib/seo/local-pages.ts';

function main() {
  console.log(`Total records: ${localSeoPageRecords.length}`);
  console.log(`Published records: ${publishedLocalSeoPages.length}`);
  console.log('Dataset validation passed via module guards.');
}

main();
