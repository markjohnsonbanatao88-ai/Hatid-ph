import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import test from 'node:test';

import { PROTOTYPE_HONESTY_COPY, type PrototypeHonestyKey } from '../src/lib/prototype-honesty-copy';

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

// Boundary keywords each shared honesty string must keep stating. The exact
// wording lives only in src/lib/prototype-honesty-copy.ts (rendered by
// page.tsx); these patterns fail if a rewording drops a production boundary.
const HONESTY_BOUNDARIES: Record<PrototypeHonestyKey, RegExp[]> = {
  // dispatch is simulated, never live
  dispatchSimulatedStatus: [/simulated/i, /not live dispatch/i],
  dispatchPermissionCopy: [/does not imply/i, /dispatch/i],
  serverWorkflowsBeforeRealUse: [/dispatch/i, /wallet/i, /server workflow/i, /before real use/i],
  // fares are estimates, priced by the server later
  fareEstimatesForPrototype: [/estimate/i, /prototype/i],
  fareServerPricedLater: [/server-priced/i],
  fareServerOwnedLater: [/server-owned/i],
  // payments are never charged; wallet is preview-only and ledger-owned later
  paymentNotCharged: [/not charged/i],
  walletPreviewOnlySubtitle: [/preview only/i, /no live balance/i],
  walletLedgerOwnedLater: [/ledger-owned/i],
  walletNoMoneyMovement: [/does not move/i, /charge/i, /refund/i, /reconcile/i],
  // trip state is not client-authoritative in production
  tripCompletionPrototype: [/prototype state/i, /server-generated/i],
  tripStateNotClientAuthoritative: [/not client-authoritative/i, /server-owned/i],
  // safety actions are visual-only until backend workflows/operators exist
  safetyVisualOnly: [/visual only/i, /audit logs/i, /operator escalation/i],
};

test('shared prototype-honesty copy still states every required boundary', () => {
  const keys = Object.keys(PROTOTYPE_HONESTY_COPY) as PrototypeHonestyKey[];
  assert.deepEqual(
    keys.sort(),
    (Object.keys(HONESTY_BOUNDARIES) as PrototypeHonestyKey[]).sort(),
    'every honesty string must have boundary expectations (and vice versa)',
  );
  for (const key of keys) {
    const copy = PROTOTYPE_HONESTY_COPY[key];
    assert.ok(copy.trim().length > 0, `PROTOTYPE_HONESTY_COPY.${key} must not be empty`);
    for (const pattern of HONESTY_BOUNDARIES[key]) {
      assert.match(copy, pattern, `PROTOTYPE_HONESTY_COPY.${key} must still match ${pattern}`);
    }
  }
});

test('rider prototype page renders every shared honesty string', () => {
  const page = readRepo('src/app/page.tsx');
  assert.match(
    page,
    /from ['"]@\/lib\/prototype-honesty-copy['"]/,
    'page.tsx must import the shared prototype-honesty copy module',
  );
  for (const key of Object.keys(PROTOTYPE_HONESTY_COPY)) {
    assert.ok(
      new RegExp(`\\b(HONESTY|PROTOTYPE_HONESTY_COPY)\\.${key}\\b`).test(page),
      `page.tsx must render PROTOTYPE_HONESTY_COPY.${key}`,
    );
  }
});

// Route entrypoints that existed before/at this adoption. The design-system
// adoption restyles the existing rider shell only; it must not add showcase
// pages. Legitimate new routes belong in their own PR and update this list.
const ALLOWED_APP_ROUTE_FILES = new Set([
  'src/app/page.tsx',
  'src/app/account/page.tsx',
  'src/app/api/trips/quote/route.ts',
  'src/app/brand-preview/page.tsx',
  'src/app/dashboard/driver/page.tsx',
  'src/app/hatid-ui/page.tsx',
  'src/app/live/page.tsx',
  'src/app/login/page.tsx',
  'src/app/onboarding/permissions/page.tsx',
  'src/app/onboarding/profile/page.tsx',
  'src/app/profile/page.tsx',
  'src/app/profile/payment/page.tsx',
  'src/app/rider/profile/page.tsx',
  'src/app/rider/ride-options/page.tsx',
  'src/app/rider/saved-places/page.tsx',
  'src/app/rider/search/page.tsx',
  'src/app/safety/page.tsx',
  'src/app/signup/page.tsx',
  'src/app/trips/page.tsx',
  'src/app/wallet/page.tsx',
  'src/app/wallet-safety-preview/page.tsx',
]);

test('no new app route files were added for design-system showcase pages', () => {
  const appDir = resolve(repoRoot, 'src/app');
  const unexpected: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (/^(page|route)\.(ts|tsx|js|jsx)$/.test(entry)) {
        const rel = relative(repoRoot, full).split('\\').join('/');
        if (!ALLOWED_APP_ROUTE_FILES.has(rel)) unexpected.push(rel);
      }
    }
  };
  walk(appDir);
  assert.deepEqual(unexpected, [], `unexpected new route files: ${unexpected.join(', ')}`);
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
