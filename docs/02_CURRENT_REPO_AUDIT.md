# Current Repo Audit

## Verdict

Hatid is a prototype, not an MVP, beta, or production-ready transport platform.

The repo has a Next.js UI shell and client-facing prototype infrastructure, but it does not have authoritative production systems for transport, dispatch, payment, wallet, payout, safety, admin, or compliance operations. UI completeness must not be treated as operational readiness.

## Current repo signals

- `package.json` is now named `hatid`.
- `README.md` has been rewritten and honestly says Hatid is prototype-only.
- `next.config.ts` no longer suppresses TypeScript or ESLint build failures.
- The test script was previously Unix-only because it used `rm -rf`; this PR changes it to `rimraf`.
- The build script was previously environment-shell dependent; this PR changes it to `cross-env NODE_ENV=production`.
- CI previously did not provide the requested Phase 0 shape; lint, typecheck, tests, and build are now hard blockers.
- CI now includes hard-blocking Supabase database validation through `npm run db:test`; database failures must not be made report-only.
- Dependency hardening has reduced the audit count from 28 moderate vulnerabilities to 25 moderate vulnerabilities. `npm run audit:high` still exits 0 at the high threshold, but plain `npm audit` remains nonzero and must be tracked before production readiness.
- Branch protection and required checks are documented in `docs/28_BRANCH_PROTECTION_AND_REQUIRED_CHECKS.md`, but this documentation does not prove GitHub settings are enabled.

## What is real

- Next.js app shell.
- Prototype rider and driver UI surfaces.
- Firebase/Firestore client-facing prototype infrastructure.
- Supabase project files and database tests exist in the repository.
- CI validates lint, typecheck, JS tests, build, and Supabase database tests.
- Trip state-machine source and tests exist as implementation foundation.

## What is not real yet

- No authoritative backend exists.
- No PostgreSQL/PostGIS production runtime exists.
- No Cloud Run service exists.
- No real dispatch exists.
- No production driver availability or location ingest service exists.
- No live payment provider integration exists.
- No wallet, stored-value, cash-in, cash-out, payout, or reconciliation service exists.
- No production admin backend exists.
- No production safety/SOS backend exists.
- No real maps provider wiring, routing, or fare engine exists.
- No production audit-log authority exists.

## Firebase and Firestore boundary

Firestore remains client-facing prototype infrastructure. It must not be treated as the production source of truth for trips, dispatch, driver availability, payment state, wallet balances, payouts, admin overrides, onboarding approvals, safety incidents, or compliance records.

Firebase may support prototype flows while the repo remains in this phase. It does not make Hatid production-ready.

## Database CI status

Supabase database validation is now a hard CI gate. The CI workflow starts the local Supabase stack, applies local migrations, and runs `npm run db:test`.

Any PR that touches migrations, RLS, RPCs, database behavior, or server-owned state must report `npm run db:test` results. Database test failures must fail CI and must not be hidden with `|| true`.

This improves migration and RPC governance only. It does not make Hatid production-ready, and it does not prove production infrastructure exists.

## Dependency audit status

`npm audit --audit-level=high` must be run and reported honestly. The current dependency-hardening pass exits 0 at the high threshold and reports 25 moderate vulnerabilities, with no high or critical failure at the configured threshold.

The remaining moderate vulnerabilities are in the `uuid` advisory family through Genkit and Google dependency chains. The earlier `js-yaml` and `postcss` findings were removed by safe lockfile updates and a PostCSS override.

The remaining `uuid` chain is deferred because npm reports no non-forced fix and a major transitive override would need a dedicated, fully tested dependency PR.

Remaining moderate vulnerabilities block production readiness until they are resolved or explicitly accepted through security review.

## Governance status

Branch protection requirements are documented, including required PR review, required status checks, force-push blocking, branch deletion blocking, and conversation resolution. This repo audit does not claim those GitHub settings are enabled; proof from repository settings is still required.

## Dangerous if left ambiguous

- Any UI copy implying real driver matching.
- Any UI copy implying real card charging, wallet movement, payout, or settlement.
- Any client-side trip completion, payment completion, wallet balance, or driver availability action being treated as production behavior.
- Any audit or database failure hidden by CI or final reporting.
- Any docs claiming MVP, beta, production readiness, live dispatch, live payments, wallet, payouts, admin operations, or safety readiness.

## Production-readiness score

| Area | Score | Reason |
|---|---:|---|
| UI shell | 65/100 | Useful for prototype exploration, not operational proof. |
| Auth/profile foundation | 40/100 | Client-facing foundation exists, but production authority and role controls are incomplete. |
| Trip authority | 10/100 | State-machine foundation exists, but no authoritative backend runtime exists. |
| Dispatch | 0/100 | No real dispatch engine. |
| Payments/wallet | 0/100 | No live provider, ledger, wallet, payout, webhook, or reconciliation service. |
| Driver operations | 10/100 | Prototype UI and planning only; no complete operational backend. |
| Safety | 5/100 | No production incident backend. |
| Admin/ops | 5/100 | No production admin backend. |
| Compliance/privacy | 15/100 | Planning exists; production implementation is incomplete. |
| Production infrastructure | 20/100 | Frontend/build foundation exists; no authoritative backend runtime is operating. |

## Phase 0 cleanup targets

1. Keep package identity honest.
2. Keep README and audit docs prototype-only.
3. Keep lint, typecheck, tests, build, and database validation as hard quality gates.
4. Keep generated test output ignored.
5. Keep dependency audit visible until remaining moderate vulnerabilities are resolved or explicitly accepted.
6. Keep branch protection settings documented and verify them in GitHub before claiming governance completion.
7. Do not add product behavior under repo-cleanup work.

## Rule

No future code should make the current prototype flows look production-real until backend authority, ledger, dispatch, maps, safety, admin, and compliance systems exist.
