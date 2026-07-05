import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';

function findRepoRoot(): string {
  let dir = __dirname;
  for (let i = 0; i < 8; i += 1) {
    if (existsSync(resolve(dir, 'src/app/page.tsx')) && existsSync(resolve(dir, 'package.json'))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(`Could not locate repo root from ${__dirname}`);
}

const repoRoot = findRepoRoot();
const readRepo = (rel: string) => readFileSync(resolve(repoRoot, rel), 'utf8');

const HATID_UI_FILES = [
  'app-header.tsx',
  'bottom-nav.tsx',
  'bottom-sheet.tsx',
  'button.tsx',
  'card.tsx',
  'badge.tsx',
  'location-card.tsx',
  'ride-card.tsx',
  'driver-card.tsx',
  'safety-card.tsx',
  'map-preview.tsx',
  'index.ts',
];

test('all Hatid UI adoption component files exist', () => {
  for (const file of HATID_UI_FILES) {
    assert.ok(
      existsSync(resolve(repoRoot, 'src/components/hatid-ui', file)),
      `expected src/components/hatid-ui/${file} to exist`,
    );
  }
});

test('rider prototype page imports from the hatid-ui component library', () => {
  const page = readRepo('src/app/page.tsx');
  assert.match(page, /from ['"]@\/components\/hatid-ui['"]/);
});

test('rider prototype page no longer uses the old hardcoded blue treatment', () => {
  const page = readRepo('src/app/page.tsx');
  assert.ok(!page.includes('#0033CC'), 'page.tsx must not contain #0033CC');
  assert.ok(!/text-\[#0033CC\]/.test(page), 'page.tsx must not contain text-[#0033CC]');
  assert.ok(!/focus:border-\[#0033CC\]/.test(page), 'page.tsx must not contain focus:border-[#0033CC]');
  assert.ok(!/ring-blue/.test(page), 'page.tsx must not contain ring-blue');
  assert.ok(!/\b(bg|text|border)-blue-/.test(page), 'page.tsx must not contain blue-* utility classes');
});

test('new Hatid UI components adopt the design-system tokens', () => {
  const combined = HATID_UI_FILES
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => readRepo(join('src/components/hatid-ui', f)))
    .join('\n');
  for (const token of ['var(--hatid-primary)', 'var(--hatid-ink)', 'var(--surface-raised)', 'var(--radius-card)', 'var(--shadow-card)']) {
    assert.ok(combined.includes(token), `expected hatid-ui components to use ${token}`);
  }
});

test('brand marks use red/navy/yellow tokens instead of the old blue hex', () => {
  const brand = readRepo('src/components/hatid-brand.tsx');
  assert.ok(!brand.includes('#0033CC'), 'hatid-brand.tsx must not contain #0033CC');
  assert.ok(brand.includes('var(--hatid-primary)'), 'brand should use --hatid-primary');
  assert.ok(brand.includes('var(--hatid-yellow)'), 'brand should use --hatid-yellow accent');
});

test('prototype-honesty copy remains present across dispatch, fare/payment/wallet, trip state, and safety', () => {
  const page = readRepo('src/app/page.tsx');
  // dispatch
  assert.match(page, /does not imply live emergency or dispatch operations/);
  assert.match(page, /must be confirmed by server workflows before real use/);
  // fare + payment + wallet
  assert.match(page, /estimates for prototype review/i);
  assert.ok(page.includes('Not charged'), 'payment must state Not charged');
  assert.match(page, /does not move, hold, charge, refund, or reconcile money/);
  // trip state
  assert.match(page, /Trip completion is a prototype state/);
  assert.match(page, /client-authoritative/);
  // safety
  assert.match(page, /Safety actions are visual only here/);
  assert.match(page, /escalation/);
});

test('no design-system bundle HTML, compiled runtime, or screenshots are committed', () => {
  const skip = new Set(['node_modules', '.git', '.next', '.tmp-tests', 'coverage', 'dist', '.turbo']);
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      if (skip.has(entry)) continue;
      const full = join(dir, entry);
      let s;
      try {
        s = statSync(full);
      } catch {
        continue;
      }
      if (s.isDirectory()) {
        walk(full);
      } else if (
        /\.dc\.html$/i.test(entry) ||
        /_ds_bundle\.js$/i.test(entry) ||
        (entry.toLowerCase().endsWith('.zip') && /design system/i.test(entry)) ||
        (/^components\.png$/i.test(entry) && /screenshots$/i.test(dir))
      ) {
        offenders.push(full);
      }
    }
  };
  walk(repoRoot);
  assert.deepEqual(offenders, [], `unexpected bundle artifacts committed: ${offenders.join(', ')}`);
});
