# Dependency Audit Tracking

## Current status

Hatid still has unresolved npm audit vulnerabilities. The high/critical threshold passes, but plain `npm audit` still exits nonzero because moderate vulnerabilities remain.

This document keeps audit risk visible. It does not make Hatid production-ready.

## Previous audit state

After PR #113, `npm audit` reported 28 moderate vulnerabilities and no high or critical threshold failure under `npm run audit:high`.

The reported families were:

- `js-yaml` through Istanbul/Jest configuration tooling
- `postcss` through Next.js
- `uuid` through Genkit and Google dependency chains

The baseline audit for this PR matched that state before dependency changes:

- Total vulnerabilities: 28
- Moderate: 28
- High: 0
- Critical: 0

## Current audit state

After `npm update` and a targeted PostCSS override, the final audit state is:

- Total vulnerabilities: 25
- Moderate: 25
- High: 0
- Critical: 0

`npm run audit:high` passes. Plain `npm audit` still exits nonzero because the remaining findings are moderate.

## Changes made in this PR

- Ran `npm update`, which refreshed safe dependency versions within existing package ranges.
- Updated Genkit packages in the lockfile from `1.37.0` to `1.39.0`.
- Updated other package-lock entries within existing semver ranges, including Radix UI packages, `@supabase/supabase-js`, `react-hook-form`, and `postcss`.
- Added an npm override so transitive PostCSS consumers resolve to the direct PostCSS dependency range.
- Removed the `js-yaml` and `postcss` audit findings from the final audit output.

## Remaining vulnerabilities

The remaining 25 moderate vulnerabilities are all in the `uuid` advisory family:

- Advisory: `uuid` missing buffer bounds check in v3/v5/v6 when `buf` is provided
- Current transitive package: `uuid@10.0.0`
- Required safe version per advisory: `uuid>=11.1.1`
- Main chains: Genkit, `@genkit-ai/*`, Google Cloud libraries, `google-gax`, `googleapis-common`, `teeny-request`, and `firebase-admin`

No direct Hatid `src/` or `tests/` usage of `uuid` was found during this PR.

## Deferred upgrades

The remaining `uuid` issue is deferred because npm reports no non-forced fix, and resolving it would require forcing a major transitive upgrade across Genkit and Google dependency chains.

Do not force this upgrade blindly. The next hardening pass should wait for upstream packages to adopt `uuid>=11.1.1`, or isolate and test a targeted override in a dedicated PR with full quality-gate evidence.

Major framework/runtime upgrades remain deferred unless explicitly justified:

- `next`
- `react`
- `react-dom`
- `typescript`
- `@supabase/*`
- `genkit`
- `@genkit-ai/*`

## Rules

- Do not use `npm audit fix --force` blindly.
- Do not suppress audit output.
- Do not claim production readiness while high or critical vulnerabilities remain.
- Moderate vulnerabilities must be reviewed before production launch.
- Dependency changes must pass lint, typecheck, tests, build, and audit checks.

## Required follow-up

Open a focused dependency follow-up only after reviewing upstream Genkit and Google package releases for a safe `uuid>=11.1.1` path.

That follow-up must:

- Avoid forced installs.
- Avoid casual major framework/runtime upgrades.
- Run lint, typecheck, tests, build, `npm run audit:high`, and plain `npm audit`.
- Report remaining vulnerabilities honestly.
