import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test from 'node:test';

import { shouldScanContent } from '../scripts/repo-hygiene-check.mjs';

test('tracked files pass repository hygiene guardrails', () => {
  assert.doesNotThrow(() => {
    execFileSync(process.execPath, ['scripts/repo-hygiene-check.mjs'], {
      encoding: 'utf8',
      stdio: 'pipe',
    });
  });
});

test('content scan includes repo hygiene script and root config files', () => {
  assert.equal(shouldScanContent('scripts/repo-hygiene-check.mjs'), true);
  assert.equal(shouldScanContent('scripts/example.js'), true);
  assert.equal(shouldScanContent('package.json'), true);
  assert.equal(shouldScanContent('package-lock.json'), true);
  assert.equal(shouldScanContent('tsconfig.json'), true);
  assert.equal(shouldScanContent('tsconfig.test.json'), true);
  assert.equal(shouldScanContent('next.config.ts'), true);
  assert.equal(shouldScanContent('postcss.config.mjs'), true);
  assert.equal(shouldScanContent('tailwind.config.ts'), true);
});

test('content scan includes GitHub templates, workflows, source, docs, and tests', () => {
  assert.equal(shouldScanContent('.github/PULL_REQUEST_TEMPLATE.md'), true);
  assert.equal(shouldScanContent('.github/workflows/ci.yml'), true);
  assert.equal(shouldScanContent('.github/workflows/verify.yaml'), true);
  assert.equal(shouldScanContent('src/lib/utils.ts'), true);
  assert.equal(shouldScanContent('docs/02_CURRENT_REPO_AUDIT.md'), true);
  assert.equal(shouldScanContent('tests/repo-hygiene.test.ts'), true);
});

test('content scan excludes obvious binary, media, and generated files', () => {
  assert.equal(shouldScanContent('src/app/favicon.ico'), false);
  assert.equal(shouldScanContent('.idx/icon.png'), false);
  assert.equal(shouldScanContent('public/design-system-screenshot.png'), false);
  assert.equal(shouldScanContent('.next/server/app/page.js'), false);
  assert.equal(shouldScanContent('node_modules/example/index.js'), false);
});
