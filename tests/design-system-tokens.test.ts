import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';

import { riderPrototypeHonesty } from '../src/lib/rider/rider-ui-state';

function findRepoFile(relativePath: string): string {
  let dir = __dirname;
  for (let i = 0; i < 8; i += 1) {
    const candidate = resolve(dir, relativePath);
    if (existsSync(candidate)) {
      return candidate;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  throw new Error(`Could not locate ${relativePath} from ${__dirname}`);
}

const globalsCss = readFileSync(findRepoFile('src/app/globals.css'), 'utf8');

test('imported Hatid design-system tokens are present in globals.css', () => {
  for (const token of [
    '--hatid-primary',
    '--hatid-navy',
    '--hatid-yellow',
    '--surface-canvas',
    '--text-heading',
    '--space-md',
    '--radius-card',
    '--shadow-card',
  ]) {
    assert.ok(globalsCss.includes(token), `expected globals.css to define ${token}`);
  }
});

test('imported tokens do not re-skin the live theme (blue primary is untouched)', () => {
  // The bundle proposes a red primary; adopting it would re-skin every product
  // page. This import must stay additive: the live shadcn primary stays blue.
  assert.match(globalsCss, /--primary:\s*223 84% 61%/);
  assert.doesNotMatch(globalsCss, /--primary:\s*#E4002B/i);
});

test('design-system import preserves rider prototype-honesty copy', () => {
  assert.match(riderPrototypeHonesty.mapDisclaimer, /not live routing or dispatch/i);
  assert.match(riderPrototypeHonesty.fareDisclaimer, /estimates/i);
  assert.match(riderPrototypeHonesty.paymentDisclaimer, /no live charging or wallet balance/i);
});
