// Prints the built /resume/<lang>/ routes to the PDFs referenced by
// src/data/profile.ts (profile.resume) using headless Chrome.
//
// Run: `npm run resume` (= `astro build && node scripts/generate-resume.mjs`)
//
// Build-time tool with zero npm deps: serves dist/ on an ephemeral port,
// drives Chrome with --print-to-pdf, then checks each PDF is exactly one page.
// The PDFs are committed so the site ships them without anyone needing Chrome.
// Override the browser with CHROME=/path/to/chrome.

import { createServer } from 'node:http';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { resolve, dirname, join, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = join(root, 'dist');

// Output names — keep in sync with `profile.resume` in src/data/profile.ts.
const OUTPUTS = {
  en: 'Resume_Luis_Pazzanese_EN.pdf',
  pt: 'Curriculo_Luis_Pazzanese_PT.pdf',
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
};

function fail(msg) {
  console.error(`generate-resume: ${msg}`);
  process.exit(1);
}

if (!existsSync(join(dist, 'resume', 'en', 'index.html'))) {
  fail('dist/resume/en/index.html not found — run `astro build` first (or `npm run resume`).');
}

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  for (const name of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
    const r = spawnSync('which', [name], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  }
  fail('no Chrome/Chromium on PATH — set CHROME=/path/to/chrome.');
}

// Minimal static handler: `/x/` → dist/x/index.html, everything else by path.
const server = createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = join(dist, pathname);
  if (!file.startsWith(dist)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) {
    res.writeHead(404).end('not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});

await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const port = server.address().port;
const chrome = findChrome();

/** Page count from the document catalog's /Pages node (`/Type /Pages ... /Count N`). */
function pageCount(pdf) {
  const text = pdf.toString('latin1');
  const m = text.match(/\/Type\s*\/Pages\b[^>]*?\/Count\s+(\d+)/) ?? text.match(/\/Count\s+(\d+)[^>]*?\/Type\s*\/Pages\b/);
  return m ? Number(m[1]) : NaN;
}

/** spawn() as a promise of { status, stderr }; kills the child after 60 s. */
function run(cmd, args) {
  return new Promise((ok, err) => {
    const child = spawn(cmd, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', (d) => (stderr += d));
    const timer = setTimeout(() => child.kill('SIGKILL'), 60_000);
    child.on('error', err);
    child.on('close', (status) => {
      clearTimeout(timer);
      ok({ status, stderr });
    });
  });
}

// A throwaway profile: without it Chrome blocks forever on the lock of an
// already-running desktop instance instead of printing.
const profileDir = mkdtempSync(join(tmpdir(), 'mywispy-resume-'));

let failed = false;
try {
  for (const [lang, name] of Object.entries(OUTPUTS)) {
    const out = join(root, 'public', name);
    const url = `http://127.0.0.1:${port}/resume/${lang}/`;
    const args = [
      '--headless=new',
      '--disable-gpu',
      `--user-data-dir=${profileDir}`,
      '--no-pdf-header-footer',
      '--virtual-time-budget=5000', // lets the Google Fonts stylesheet + woff2 land before printing
      `--print-to-pdf=${out}`,
      url,
    ];
    console.log(`${chrome} ${args.join(' ')}`);
    // Must be async: a blocking spawnSync would freeze the static server
    // above and Chrome would wait on the page forever.
    const { status, stderr } = await run(chrome, args);
    if (status !== 0 || !existsSync(out)) {
      console.error(stderr);
      fail(`Chrome exited with ${status} for ${lang}`);
    }

    const pdf = readFileSync(out);
    const pages = pageCount(pdf);
    console.log(`${name}: ${(pdf.length / 1024).toFixed(1)} KiB, ${pages} page(s)`);
    if (pages !== 1) {
      console.error(`generate-resume: ${name} has ${pages} pages — trim src/pages/resume/[lang].astro until it fits one A4 page.`);
      failed = true;
    }
  }
} finally {
  server.close();
  rmSync(profileDir, { recursive: true, force: true });
}

if (failed) process.exit(1);
