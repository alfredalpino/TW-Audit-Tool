import { execSync, spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const LOCK_PATH = join(ROOT, '.next/dev/lock');
const DEBUG_ENDPOINT = 'http://127.0.0.1:7765/ingest/3efc6b45-ee18-4e7e-a305-3eace499486e';
const SESSION_ID = 'dde73e';

function log(location, message, data, hypothesisId, runId = 'pre-fix') {
  const body = JSON.stringify({
    sessionId: SESSION_ID,
    runId,
    hypothesisId,
    location,
    message,
    data,
    timestamp: Date.now(),
  });
  fetch(DEBUG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': SESSION_ID },
    body,
  }).catch(() => {});
}

function getPids(port) {
  try {
    const out = execSync(`lsof -ti :${port} 2>/dev/null`, { encoding: 'utf8', cwd: ROOT });
    return (out.trim() || '').split(/\s+/).filter(Boolean);
  } catch {
    return [];
  }
}

function getLockExists() {
  return existsSync(LOCK_PATH);
}

// #region agent log
log('start-dev-with-logging.mjs:before-cleanup', 'State before cleanup', {
  lockExists: getLockExists(),
  pids3000: getPids(3000),
  pids3001: getPids(3001),
}, 'H1-H3', 'pre-fix');
// #endregion

// Run dev:kill to free ports and remove lock
execSync('sh scripts/kill-dev.sh', { cwd: ROOT, stdio: 'inherit' });

// #region agent log
log('start-dev-with-logging.mjs:after-cleanup', 'State after dev:kill', {
  lockExists: getLockExists(),
  pids3000: getPids(3000),
  pids3001: getPids(3001),
}, 'H5', 'post-fix');
// #endregion

// Start next dev (single instance)
// Webpack dev: Turbopack + lucide-react often hits "module factory is not available" for icon chunks.
const child = spawn('npx', ['next', 'dev', '--webpack'], { cwd: ROOT, stdio: 'inherit', shell: false });
child.on('exit', (code) => process.exit(code ?? 0));
