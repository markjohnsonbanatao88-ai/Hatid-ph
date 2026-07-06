import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test from 'node:test';

test('tracked files pass repository hygiene guardrails', () => {
  assert.doesNotThrow(() => {
    execFileSync(process.execPath, ['scripts/repo-hygiene-check.mjs'], {
      encoding: 'utf8',
      stdio: 'pipe',
    });
  });
});
