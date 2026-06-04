import fs from 'fs/promises';
import path from 'path';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/build-seo-optimization-queue.mjs <path-to-gsc-csv>');
  process.exit(1);
}

function parsePercent(value) {
  return Number(String(value).replace('%', '').trim()) / 100;
}

function parseCsv(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map((header) => header.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const row = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] || '').trim();
    });
    return row;
  });
}

async function main() {
  const raw = await fs.readFile(path.resolve(process.cwd(), inputPath), 'utf8');
  const rows = parseCsv(raw);

  const ctrQueue = rows
    .map((row) => ({
      page: row.Page || row.page,
      query: row.Query || row.query,
      impressions: Number(row.Impressions || row.impressions || 0),
      clicks: Number(row.Clicks || row.clicks || 0),
      ctr: parsePercent(row.CTR || row.ctr || '0'),
      position: Number(row.Position || row.position || 0),
    }))
    .filter((row) => row.impressions >= 100 && row.ctr <= 0.02)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 30);

  const cvrQueue = rows
    .map((row) => ({
      page: row.Page || row.page,
      clicks: Number(row.Clicks || row.clicks || 0),
      conversions: Number(row.Conversions || row.conversions || 0),
    }))
    .filter((row) => row.clicks >= 20)
    .map((row) => ({ ...row, cvr: row.clicks > 0 ? row.conversions / row.clicks : 0 }))
    .filter((row) => row.cvr <= 0.02)
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 30);

  const outputDir = path.join(process.cwd(), 'data', 'seo');
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'ctr-priority-queue.json'), `${JSON.stringify(ctrQueue, null, 2)}\n`, 'utf8');
  await fs.writeFile(path.join(outputDir, 'cvr-priority-queue.json'), `${JSON.stringify(cvrQueue, null, 2)}\n`, 'utf8');

  console.log(`CTR queue size: ${ctrQueue.length}`);
  console.log(`CVR queue size: ${cvrQueue.length}`);
  console.log('Output: data/seo/ctr-priority-queue.json and data/seo/cvr-priority-queue.json');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
