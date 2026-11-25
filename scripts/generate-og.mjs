// Generates public/og.png (1200×630) in the site's datasheet look: paper,
// hairlines, mono labels, PCB green.
//
// Run: `npm run og`. The PNG is committed; re-run only when the name, focus
// or palette changes.
//
// Rendered by headless Chrome (the same browser `npm run resume` uses) from a
// throwaway HTML page that loads IBM Plex from the @fontsource packages, so
// the image uses the site's fonts without installing anything system-wide.
// Override the browser with CHROME=/path/to/chrome.

import { mkdtempSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const outPath = join(root, 'public', 'og.png');

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  for (const name of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
    const r = spawnSync('which', [name], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  }
  console.error('generate-og: no Chrome/Chromium on PATH; set CHROME=/path/to/chrome.');
  process.exit(1);
}

const font = (pkg, weight) =>
  pathToFileURL(join(root, `node_modules/@fontsource/${pkg}/files/${pkg}-latin-${weight}-normal.woff2`)).href;

// Light tokens from src/styles/global.css.
const PAPER = '#fbfbf9';
const FG = '#16181a';
const MUTED = '#5c6166';
const LINE = '#d9dcd6';
const ACCENT = '#1f7a4d';

const W = 1200;
const H = 630;
// font-family / font-weight pairs, resolved by the @font-face rules below.
const MONO = `font-family="Plex Mono" font-weight="400"`;
const MONO_MED = `font-family="Plex Mono" font-weight="500"`;
const SANS = `font-family="Plex Sans" font-weight="400"`;
const SANS_SEMI = `font-family="Plex Sans" font-weight="600"`;

const rows = [
  ['FIG. 1', 'Neural network on a Pico 2 plays Subway Surfers'],
  ['FIG. 2', 'MIPS CPU in VHDL, 25 MHz on a Cyclone V'],
  ['FIG. 3', 'Stepper motor IP core, no divider, 168 ALMs'],
];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <g ${MONO_MED} font-size="18" letter-spacing="2" fill="${MUTED}">
    <text x="80" y="76">LUIS PAZZANESE · REV ${new Date().toISOString().slice(0, 7).replace('-', '.')}</text>
    <text x="1120" y="76" text-anchor="end">LUISPAZZANESE.DEV</text>
  </g>
  <line x1="80" y1="98" x2="1120" y2="98" stroke="${LINE}" stroke-width="2"/>

  <text x="80" y="196" ${MONO_MED} font-size="22" letter-spacing="3" fill="${ACCENT}">EMBEDDED SYSTEMS AND FPGA</text>
  <text x="76" y="290" ${SANS_SEMI} font-size="96" letter-spacing="-1.5" fill="${FG}">Luis Pazzanese</text>

  <g font-size="24">
    ${rows
      .map(
        ([tag, text], i) => `
    <line x1="80" y1="${352 + i * 64}" x2="1120" y2="${352 + i * 64}" stroke="${LINE}" stroke-width="2"/>
    <text x="80" y="${394 + i * 64}" ${MONO_MED} font-size="18" letter-spacing="2" fill="${MUTED}">${tag}</text>
    <text x="220" y="${394 + i * 64}" ${SANS} fill="${FG}">${text}</text>`,
      )
      .join('')}
    <line x1="80" y1="544" x2="1120" y2="544" stroke="${LINE}" stroke-width="2"/>
  </g>

  <text x="80" y="590" ${MONO} font-size="18" fill="${MUTED}">Computer Engineering · Insper</text>
  <rect x="1104" y="572" width="16" height="16" fill="${ACCENT}"/>
</svg>`;

const html = `<!doctype html><meta charset="utf-8"><style>
  @font-face { font-family: 'Plex Sans'; font-weight: 400; src: url(${font('ibm-plex-sans', 400)}) format('woff2'); }
  @font-face { font-family: 'Plex Sans'; font-weight: 600; src: url(${font('ibm-plex-sans', 600)}) format('woff2'); }
  @font-face { font-family: 'Plex Mono'; font-weight: 400; src: url(${font('ibm-plex-mono', 400)}) format('woff2'); }
  @font-face { font-family: 'Plex Mono'; font-weight: 500; src: url(${font('ibm-plex-mono', 500)}) format('woff2'); }
  html, body { margin: 0; }
  svg { display: block; }
</style>${svg}`;

const tmp = mkdtempSync(join(tmpdir(), 'og-'));
try {
  const page = join(tmp, 'og.html');
  writeFileSync(page, html);
  const r = spawnSync(
    findChrome(),
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      `--user-data-dir=${join(tmp, 'profile')}`,
      `--window-size=${W},${H}`,
      '--virtual-time-budget=3000', // let the woff2 files load before the shot
      `--screenshot=${outPath}`,
      pathToFileURL(page).href,
    ],
    { encoding: 'utf8', timeout: 60_000 },
  );
  if (r.status !== 0 || !existsSync(outPath)) {
    console.error(r.stderr);
    process.exit(1);
  }
  console.log(`Wrote ${outPath}`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
