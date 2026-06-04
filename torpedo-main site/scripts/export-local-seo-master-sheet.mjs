import fs from 'fs/promises';
import path from 'path';
import { MASTER_SHEET_COLUMNS, draftLocalSeoPages, localSeoPageRecords, publishedLocalSeoPages } from '../lib/seo/local-pages.ts';

const outputDir = path.join(process.cwd(), 'data', 'seo');
const jsonPath = path.join(outputDir, 'local-seo-master-sheet.json');
const csvPath = path.join(outputDir, 'local-seo-master-sheet.csv');

function escapeCsv(value) {
  const text = String(value ?? '');
  if (text.includes('"') || text.includes(',') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function rowToColumns(row) {
  return MASTER_SHEET_COLUMNS.map((column) => row[column]);
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  await fs.writeFile(
    jsonPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalRecords: localSeoPageRecords.length,
        publishedRecords: publishedLocalSeoPages.length,
        draftRecords: draftLocalSeoPages.length,
        columns: MASTER_SHEET_COLUMNS,
        records: localSeoPageRecords,
      },
      null,
      2
    )}\n`,
    'utf8'
  );

  const csvLines = [MASTER_SHEET_COLUMNS.join(',')];
  for (const row of localSeoPageRecords) {
    csvLines.push(rowToColumns(row).map(escapeCsv).join(','));
  }
  await fs.writeFile(csvPath, `${csvLines.join('\n')}\n`, 'utf8');

  console.log(`Exported ${localSeoPageRecords.length} records.`);
  console.log(`Published: ${publishedLocalSeoPages.length}, Draft: ${draftLocalSeoPages.length}`);
  console.log(`JSON: ${jsonPath}`);
  console.log(`CSV: ${csvPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
