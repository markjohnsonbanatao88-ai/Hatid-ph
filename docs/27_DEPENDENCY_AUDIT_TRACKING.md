# Dependency Audit Tracking

## Current status

Hatid currently has unresolved npm audit vulnerabilities. This document exists so audit risk is visible and not buried in CI logs.

As of this PR, `npm run audit:high` exits 0 at the high threshold, but `npm audit` reports 28 moderate vulnerabilities. The reported moderate advisories include `js-yaml`, `postcss` through `next`, and `uuid` through Genkit/Google dependency chains.

## Rules

- Do not use `npm audit fix --force` blindly.
- Do not upgrade framework/runtime dependencies without running lint, typecheck, tests, and build.
- Do not suppress audit output.
- Do not claim production readiness while high or critical vulnerabilities remain unresolved.
- Dependency hardening must be handled in a dedicated PR.

## Required follow-up PR

Title:

Phase 0: dependency hardening

Scope:

- Review `npm audit --audit-level=high`
- Group upgrades by dependency family
- Avoid forced major upgrades unless explicitly justified
- Run full quality gates after each upgrade group
- Report remaining vulnerabilities honestly

## Not in scope

- Dispatch
- Payments
- Wallet
- Payouts
- Supabase migration
- Firebase removal
- Admin backend
- Safety backend
- AI features
